---
title: "Building an RL Environment That Actually Works — Rewards, World Models, and Why Environments Are Harder Than Training"
excerpt: "Every shortcut I left in the environment, the agent found and exploited. Here's how I designed observations, rewards, grading, and a neural world model for training LLM trading agents on real Indian equity data."
date: "2026-04-26"
tags: ["reinforcement-learning", "llm", "pytorch", "openenv", "world-model"]
ogImage: "/blog/og-building-rl-env.png"
---

The environment took longer to build than training the model. That was the right call -- every shortcut I left in the environment, the agent found and exploited within a few hundred training steps.

This post covers the environment side of a stock trading RL project I built for the [Meta PyTorch OpenEnv Hackathon](https://pytorch.org/blog/openenv/). The next post covers [training -- SFT, GRPO, and 15 experiments](/blog/training-llm-stock-trader-sft-grpo). But the environment came first, and if I had to pick which mattered more, it's this one.

The live environment is on [HuggingFace Spaces](https://huggingface.co/spaces/sarthakbiswas/stock-trader-env). The code is on [GitHub](https://github.com/sarthakbiswas97/stock-trader-env).

---

## The Setup

[OpenEnv](https://pytorch.org/blog/openenv/) is a specification for RL environments that LLM agents can interact with. It requires REST and WebSocket APIs, typed Pydantic models for observations and actions, and seed-reproducible episodes. The idea: standardize how RL environments expose themselves so any agent -- LLM or classical -- can plug in.

I chose stock trading because it has properties that make environment design genuinely hard. Markets are sequential (each day's decision affects the next), stochastic (tomorrow's prices are unknown), and multi-objective (return vs risk vs discipline). There's real data to test against, measurable outcomes to grade, and regime shifts that break simple strategies. If you can build a good RL environment for trading, the design patterns transfer to other domains.

The environment replays real daily OHLCV data from Indian equity markets -- [264,000 rows across 109 NIFTY stocks spanning 2015-2026](https://huggingface.co/datasets/sarthakbiswas/stock-trader-market-data), covering bull, bear, and sideways regimes.

---

## Observations: Text, Not Vectors

Most RL environments feed agents numeric feature vectors. That works for PPO and DQN, but LLMs reason in language. Giving an LLM a vector of `[0.28, -0.15, 0.94, ...]` throws away the modality it's best at.

The environment converts raw OHLCV data into human-readable technical analysis through a `FeatureEngine` that computes 11 indicators:

| Indicator | Source | What it tells the agent |
|-----------|--------|------------------------|
| RSI (14-period) | Close prices | Overbought (>70) or oversold (<30) |
| MACD | 12/26 EMA | Bullish/bearish momentum, crossover signals |
| Bollinger Bands (20-period) | Close + std dev | Price position relative to volatility range |
| Volume (20-day MA ratio) | Volume data | Spike detection (>1.5x = high, >2x = very high) |
| Trend | 10/30 EMA crossover | Bullish, bearish, or sideways |
| Volatility | 20-period rolling std, annualized | Very high (>40%), high, moderate, low (<15%) |
| Momentum (10-period) | Price change | Strong up/down with percentage |
| Candlestick patterns | OHLC | Doji, hammer, shooting star, engulfing patterns |
| Gap detection | Open vs previous close | Up/down gap with percentage |
| Range expansion (20-period) | High-low range | Compressed (<0.5x) or expanded (>1.5x avg) |
| Regime | 50/200 EMA | Bull, bear, or sideways market regime |

The agent sees text like this:

```
Day 7 of 20 | Cash: Rs85,000 | Portfolio: Rs102,340 | Return: +2.3%

RELIANCE: Rs2,500 (+1.5% today)
  RSI: 65.0 (neutral) | MACD: bullish (CROSSOVER)
  Trend: bullish | Bollinger: above_middle
  Volume: 1.2x avg (high) | Volatility: moderate
  Momentum: up (+2.3%) | Regime: bull
  Candle: hammer | Gap: none | Range: normal

Position: 40 shares @ Rs2,450 | Current: Rs2,500 | P&L: +2.0% | Held: 3 days
Available actions: BUY, SELL, HOLD
```

This is the same information a numeric vector would encode, but in a format an LLM can reason about. The results proved it mattered: a zero-shot Qwen 0.5B model reading text observations scored 0.379, while a PPO agent trained for 20,000 steps on numeric vectors scored 0.347. Text gives LLMs an information advantage because they can reason about *relationships* between indicators ("RSI oversold but MACD hasn't confirmed the reversal") rather than treating them as independent features.

---

## Action Space

Actions are plain text strings:

```
HOLD                    -- do nothing
BUY                     -- buy (single-stock tasks)
SELL                    -- sell entire position (single-stock tasks)
BUY RELIANCE 0.5        -- buy using 50% of available cash
SELL INFY 0.3           -- sell 30% of position
```

For single-stock tasks, the symbol defaults to the only stock available. For multi-stock tasks, symbol is required. Fraction is optional (defaults to 1.0) and is clamped to `[0.0, 1.0]`.

One deliberate design choice: **invalid actions default to HOLD**. The environment never crashes on bad input. If the agent outputs gibberish, it's treated as inaction. This means the agent can always interact with the environment regardless of output quality -- which matters during early SFT when the model is still learning the format.

This is different from traditional RL environments that might clip actions or raise errors. For LLMs, you want a forgiving interface that always returns a valid observation, so training can start even before the model reliably follows the format.

---

## Five Difficulty Tiers

The environment has five task configurations with increasing constraints. The idea comes from curriculum learning -- don't throw the hardest problem at the agent on day one. Let it master basic timing before adding transaction costs, then portfolio management, then market regime discipline.

| Task | Days | Capital | Stocks | Costs | Max Trades/Day | Regime Gate | Max per Stock |
|------|------|---------|--------|-------|---------------|-------------|---------------|
| `single_stock` | 20 | Rs 100K | RELIANCE | 0% | 100 | No | 100% |
| `single_stock_costs` | 20 | Rs 100K | RELIANCE | 0.1% | 20 | No | 100% |
| `multi_stock_3` | 25 | Rs 150K | 3 stocks | 0.1% | 15 | No | 50% |
| `portfolio` | 30 | Rs 200K | 10 stocks | 0.1% | 10 | No | 30% |
| `full_autonomous` | 40 | Rs 500K | 25 stocks | 0.2% | 5 | Yes | 15% |

Each tier introduces a new constraint the agent must learn to respect:

**Single stock** teaches basic buy/sell timing. No costs, no limits. Just learn when to enter and exit.

**Single stock with costs** adds 0.1% transaction cost and slippage. Now every trade has a price, so the agent can't churn in and out every day. It must learn that trading has friction.

**Multi stock (3)** introduces portfolio allocation. The agent must pick *which* stock to trade and manage a 50% position limit per stock. It can't go all-in on one name.

**Portfolio (10 stocks)** is where risk management becomes real. 30% max per stock, 10 trades per day, and the grader explicitly rewards discipline and punishes constraint violations.

**Full autonomous (25 stocks)** adds a regime gate: when more than 70% of stocks are declining or the average daily change drops below -0.5%, trading is restricted. The agent must learn *when not to trade* -- arguably the hardest skill.

The curriculum draws from the PAIRED framework (Dennis et al., 2020) -- the environment should be calibrated to the agent's current capability boundary. Too easy and the agent learns nothing. Too hard and it never succeeds. The tier system lets you train at the right difficulty for the agent's current skill level.

---

## Reward Design: The Hardest Problem

This section is the reason I wrote this post. Reward design is where I spent the most time, made the most mistakes, and learned the most.

The core insight: **the model will optimize exactly what you measure, efficiently and without hesitation. If your reward function has a loophole, the model will find it before you do.**

### Iteration 1: Counterfactual Rewards

The first reward was simple. If the agent buys and the price goes up, positive reward. If it goes down, negative. HOLD gets zero.

```
BUY/SELL:  reward = price_change * scaling_factor (can be +/-)
HOLD:      reward = 0.0 (always, no matter what)
```

Within 200 GRPO training steps, 85% of actions were HOLD. The model discovered that HOLD is the only action that never gets penalized. BUY and SELL carry risk. HOLD is always safe.

**The problem**: zero-cost inaction. If doing nothing has no consequence, a risk-averse optimizer will always choose it.

### Iteration 2: Multi-Reward Components

I added four reward functions: format compliance, reasoning quality, trading P&L, and prediction accuracy. Surely more signal dimensions would help.

Score: 0.326 -- barely above the 0.300 HOLD floor.

When I audited the reward breakdown: **84% of total reward came from formatting**. The model had learned that producing clean `<think>...</think>` tags and well-formatted action strings was worth far more than making good trading decisions. It optimized for *looking smart* instead of *being smart*.

**The problem**: unweighted reward components. Format compliance was easy to maximize and contributed the most to total reward. The model found the path of least resistance.

### Iteration 3: Reward Alignment

Format became a gate: pass (0) or fail (-1). Not a reward source -- format compliance is expected, not rewarded. All positive reward came from trading: 30% step-level P&L + 70% episode-level return.

Score: 0.395. Much better. 10 out of 20 test episodes scored 0.6 (the agent was actually trading profitably). But 2 episodes scored 0.1 (catastrophic). The agent learned a strategy but not when to apply it. And KL divergence climbed to 3.9 during training -- the model was forgetting its SFT knowledge while chasing RL reward.

### Final: Signal-Based Rewards

The reward system that actually worked has three components, each targeting a specific failure mode:

**Signal-based HOLD evaluation.** HOLD is no longer free. The environment classifies every HOLD decision using technical signals:

- HOLD when RSI < 25 (strong buy signal ignored) → penalty of -0.15 (missed opportunity)
- HOLD when RSI > 75 (strong sell signal ignored) → penalty of -0.15 (missed opportunity)
- HOLD a position with P&L below -5% → penalty of -0.1 (loss hold)
- HOLD when indicators are neutral → small positive signal of +0.01 (justified patience)

The agent must now *justify not trading*, just as it must justify trading.

**Mistake tracking.** Seven specific error types are detected in real time and feed directly into step rewards:

1. **Regime violation** -- trading during a regime gate block
2. **Overbought buy** -- buying when RSI > 70
3. **Oversold sell** -- selling when RSI < 30
4. **Position limit breach** -- exceeding max exposure per stock
5. **Trade limit breach** -- exceeding max trades per day
6. **Loss hold** -- holding a position at P&L below -5%
7. **Missed opportunity** -- ignoring extreme RSI signals

This provides targeted learning signal. Instead of just "you lost money," the agent learns "you bought into an overbought market" or "you held a losing position too long." Each mistake is a specific lesson, not a generic penalty.

**Position holding costs.** Positions held beyond 5 days incur a daily cost. This forces the agent to think about exit timing, not just entry timing. Without this, agents tend to buy and forget -- they never learn to close positions.

**Drawdown-based capacity scaling.** As the portfolio draws down, trading capacity shrinks from 100% to 25%. The agent learns to trade smaller when it's losing. This prevents a bad streak from turning into a catastrophic one.

---

## Grading: Measuring What Matters

Grading is separate from reward, and this distinction matters.

**Reward** is what the model trains against -- the step-by-step signal that shapes behavior during GRPO. It needs to be informative at every timestep.

**Grading** is how the episode is evaluated at the end -- the final score that determines whether the agent is actually good. It measures outcomes, not process.

Each task tier has its own grader because different difficulty levels test different skills:

**Single stock grader** compares agent return against buy-and-hold. Scoring 0.5 means matching the market. Scoring 0.8+ means beating it. A negative return below -5% scores 0.1 -- catastrophic loss is penalized heavily regardless of what the market did.

**Portfolio grader** weights three dimensions:
- 60% risk-adjusted return (Sharpe ratio, annualized)
- 25% discipline (penalty for each constraint violation: -0.1 per breach)
- 15% activity balance (too passive or too active both penalized)

**Full autonomous grader** adds regime awareness:
- 35% absolute return
- 25% risk-adjusted return
- 25% regime discipline (fraction of regime-gated days where agent respected the gate)
- 15% risk management (violation penalty + drawdown penalty)

The key: the grader measures *what you want the agent to do*. The reward teaches *how to get there*. Conflating them is a common mistake -- a reward that exactly matches the grader gives sparse signal (you only know if the episode was good at the end), while a grader that exactly matches step-level rewards over-optimizes for intermediate behavior at the expense of outcomes.

---

## The Neural World Model

Every experiment until this point used static replay -- the environment plays back historical CSV data. Same price sequences, same indicators, same patterns. An agent can memorize "buy on day 7 of this RELIANCE sequence" and score well without learning anything about actual trading.

Real markets are stochastic. Tomorrow won't look like any day in the training data. An agent that memorized price sequences has learned nothing transferable.

### Architecture

The world model is a causal transformer -- 1.22M parameters, 4 layers, d_model=192, 4 attention heads, feed-forward dimension 384. The output head is a Mixture Density Network (MDN) with 3 Gaussian components that predicts the probability distribution of next-day price features rather than a single point estimate.

```
Real Market Data (264K rows, 109 stocks, 2015-2026)
        |
        v
Causal Transformer (1.22M params, MDN output)
        |
        v
Generated OHLCV --> Feature Engine --> Text Observation
        |                                    |
        v                                    v
  Same interface                      Same format as
  as CSV replay                       static replay
        |
        v
LLM Agent --> BUY / SELL / HOLD
```

Why a causal transformer over a recurrent model? The autoregressive structure naturally handles temporal dependencies without the compounding drift problem that plagues RNN architectures. Each position predicts the next day from only past data -- the causal mask ensures no future information leakage during both training and generation.

Why MDN output instead of direct regression? Markets are multimodal. The same market conditions can lead to different outcomes. A single-point prediction collapses this uncertainty into a mean, which produces unrealistically smooth price trajectories. Three Gaussian components capture the multimodality: one for "market goes up," one for "market goes flat," one for "market goes down," with learned mixing weights.

### Validation

I compared the causal transformer against a CNN+GRU baseline (Conv1d encoder + GRU dynamics, ~140K params) trained on the same data:

| Model | Parameters | Volatility Ratio | MAE | Direction Accuracy |
|-------|-----------|-------------------|-----|-------------------|
| **Causal Transformer** | 1.22M | **0.94x** | **0.0167** | 0.492 |
| CNN+GRU | 140K | 3.15x | 0.0436 | 0.501 |

Volatility ratio is the critical metric. A ratio of 0.94x means the generated prices have 94% of real-market volatility -- realistic enough to train on. The CNN+GRU generates prices 3.15x more volatile than real markets, making them impractical for agent training (the agent would learn strategies calibrated for extreme volatility that don't transfer to real market conditions).

Direction accuracy is near random (0.5) for both -- which is actually the correct behavior. If the model could predict market direction above chance, it would be a trading alpha, not a world model. What matters is that the *statistical properties* of generated data match reality, not that individual predictions are correct.

Temperature sweep from 0.1 to 1.5 found optimal generation at temperature=1.0. Training time: 7 minutes on a single A5000 GPU.

### Drop-In Replacement

The neural simulator implements the exact same interface as the CSV replay simulator. `get_price()`, `get_daily_change()`, `get_lookback_data()`, `advance_day()` -- all the same methods. The `FeatureEngine` computes indicators from the generated OHLCV data identically. The LLM agent sees the same observation format regardless of whether prices come from a CSV file or a neural network.

This meant switching from static to neural required changing one parameter: `simulator_mode="neural"`. No changes to the agent, the training loop, or the evaluation harness.

A deliberate simplification: **agent actions do not affect market prices**. This is a zero-market-impact assumption -- the agent observes and trades within the market, but prices follow their own dynamics. This reflects the reality that a single retail trader does not move NIFTY stock prices, and it simplifies the world model (no action conditioning needed).

### Impact on Training

The static vs neural comparison tells the story. SFT v3 scored 0.399 on static replay but 0.417 on neural. Performance *improved* on the harder, stochastic environment -- because the neural environment surfaces patterns that static replay hides. Every episode generates unique price trajectories. The agent can't memorize its way to a high score. It must develop transferable trading intuition.

When GRPO was later run against the neural environment (covered in the [next post](/blog/training-llm-stock-trader-sft-grpo)), the score jumped to 0.537 -- a 79% improvement over baseline. The same GRPO approach had failed repeatedly against static replay. The environment was the bottleneck, not the training algorithm.

---

## Do's and Don'ts

What I'd tell someone building an RL environment for LLM agents:

**Make inaction costly.** If HOLD/skip/pass has zero consequence, the model will always choose it. Inaction must be a *decision* with *trade-offs*, not a free default.

**Format compliance is a gate, not a reward.** You expect the agent to follow the output format. If you reward it, the agent will optimize format at the expense of actual task performance. Make it pass/fail: valid format gets 0, invalid gets -1.

**Test with dumb agents first.** Before training anything, run a hold-only agent and a random agent. If hold scores well, your reward function has a problem. The hold agent is your floor -- everything must beat it clearly.

**Separate reward from grading.** Reward is the step-level signal that shapes training. Grading is the episode-level evaluation that measures outcomes. They serve different purposes and should be designed independently.

**Seed everything.** Every episode must be reproducible with a seed. Without this, you can't compare experiments, debug failures, or verify that improvements are real and not noise.

**Version the environment separately from the model.** An environment change means the agent is solving a different problem. Tag the environment version in every evaluation result so you know which reality the scores correspond to.

**If the agent can memorize, it will.** Static data, fixed episodes, deterministic sequences -- the agent will find the pattern and exploit it. Stochastic environments (neural world models, procedural generation) force generalization.

**Track specific mistakes, not just outcomes.** "You lost money" is a weak signal. "You bought into an overbought market" is a lesson. The more specific your feedback, the faster the agent learns.

---

## Resources

- **Live environment**: [HuggingFace Spaces](https://huggingface.co/spaces/sarthakbiswas/stock-trader-env)
- **Code**: [GitHub](https://github.com/sarthakbiswas97/stock-trader-env)
- **Market data (264K rows, 109 stocks)**: [HuggingFace Dataset](https://huggingface.co/datasets/sarthakbiswas/stock-trader-market-data)
- **World model validation**: [results/comparison_results.png](https://github.com/sarthakbiswas97/stock-trader-env/tree/main/results)
- **Next post**: [From 0.300 to 0.537 -- 15 Experiments Training an LLM Stock Trader](/blog/training-llm-stock-trader-sft-grpo)
