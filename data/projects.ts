export type Project = {
  id: number;
  name: string;
  collabs: string[];
  type: string;
  date: string;
  hidePreview?: boolean;
  featured?: boolean;
  description?: string;
  content?: string;
  contentSections?: {
    title: string;
    items: string[];
  }[];
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  technologies?: string[];
  images?: {
    src: string;
    alt: string;
  }[];
  features?: {
    title: string;
    description: string;
  }[];
  workflow?: string[];
};

export const projects: Project[] = [
  {
    id: 1,
    name: "nyc eta engine",
    date: "may, 2026",
    collabs: [],
    type: "ml/deep learning",
    featured: true,
    description:
      "neural eta prediction engine for nyc taxi trips. 560k-param embedding network trained on 37m trips achieves 264.5s mae — 25% better than xgboost baseline, inference under 1ms.",
    contentSections: [
      {
        title: "what it does",
        items: [
          "predicts taxi trip duration given pickup zone, dropoff zone, timestamp, and passenger count using 37 million real nyc yellow taxi trips from 2023",
          "learns all spatial relationships from trip data via zone embeddings — no external geography, shapefiles, or hardcoded coordinates. if zone ids mapped to a different city, the model would work equally well",
          "serves predictions in under 1ms on cpu, packaged in a ~500mb docker container for submission",
        ],
      },
      {
        title: "the model",
        items: [
          "dual-branch architecture: zone embeddings (pickup + dropoff + hash-based pair embedding) processed through an interaction mlp, and 24 continuous features (zone-pair statistics + temporal) through a separate branch",
          "element-wise embedding product captures zone similarity (co-occurrence), element-wise difference captures trip directionality (a→b vs b→a)",
          "residual blocks in the combined mlp for stable gradient flow through deeper layers — unusual for tabular networks but effective here",
          "zone-pair hash embedding: 16,384 buckets handle all 70k+ possible pairs naturally via collision without enumeration",
        ],
      },
      {
        title: "feature engineering",
        items: [
          "13 zone-pair statistics with bayesian shrinkage — smooths sparse pairs toward pickup-zone mean with a fallback hierarchy: pair → pickup zone → dropoff zone → global mean",
          "6 traffic-regime time buckets (late night, early morning, am rush, midday, pm rush, evening) with per-regime pair statistics",
          "11 temporal features: cyclical hour/dow encoding, rush hour flags, night flags, normalized minute-of-day",
          "zone-pair median alone (296.7s) beats xgboost (351s) with zero ml — the signal is in the feature engineering",
        ],
      },
      {
        title: "results",
        items: [
          "264.5s mae on dev set — 25% better than xgboost baseline (351s), 11% better than zone-pair median (296.7s)",
          "3 architecture versions: v1 (272.1s, l1 loss) → v2 (266.2s, huber loss + temporal features) → v3 (264.5s, residual blocks + embedding interactions)",
          "model converges in 5 epochs on 37m rows. training loss keeps dropping after epoch 5 but dev mae rises — classic overfitting window caught by early stopping",
          "inference under 1ms per request (200x faster than the 200ms constraint), ~15mb model checkpoint",
        ],
      },
    ],
    links: {
      github: "https://github.com/sarthakbiswas97/eta-engine",
    },
    technologies: [
      "python",
      "pytorch",
      "pandas",
      "mlflow",
      "docker",
      "hugging face hub",
    ],
    features: [
      {
        title: "learned zone embeddings",
        description:
          "50-dim embeddings for 266 zones learn spatial relationships purely from trip patterns. no external geography needed — model is transferable to any city with zone ids.",
      },
      {
        title: "bayesian shrinkage for sparse pairs",
        description:
          "handles rare and unseen zone pairs gracefully. shrinkage prior smooths toward pickup-zone mean; fallback hierarchy prevents cold-start failures.",
      },
      {
        title: "huber loss for robustness",
        description:
          "l2 penalty for errors under 300s, l1 for errors above. addresses systematic long-trip underprediction without instability from pure l2.",
      },
      {
        title: "onecyclelr with warmup",
        description:
          "10% warmup prevents nan gradients on random embeddings (failed without it). cosine decay from 5e-4 to 5e-7 for stable convergence.",
      },
      {
        title: "memory-efficient training",
        description:
          "37m rows processed in 2m-row chunks. keeps memory under 6gb, enabling free-tier gpu training on colab/kaggle t4.",
      },
      {
        title: "systematic iteration",
        description:
          "3 architecture versions with clear progression. every change measured against dev mae and logged to mlflow. feature ablations documented.",
      },
    ],
    workflow: [
      "download and clean 37m nyc taxi trips (2023), split temporally into train/dev",
      "compute zone-pair statistics with bayesian shrinkage across 6 traffic regimes",
      "extract 24 continuous features (zone-pair stats + temporal) and 2 categorical (zone ids)",
      "train dual-branch embedding network with huber loss, onecyclelr, and early stopping",
      "evaluate on held-out dev set, pick best checkpoint by mae (not training loss)",
    ],
  },
  {
    id: 2,
    name: "stock trader rl environment",
    date: "april, 2026",
    collabs: [],
    type: "rl/ml",
    featured: true,
    description:
      "openenv-compliant reinforcement learning environment for evaluating llm trading agents on indian equity markets. qualified for the meta pytorch openenv hackathon finale (top 800 out of 32,000+ teams).",
    contentSections: [
      {
        title: "what it does",
        items: [
          "simulates daily stock trading on 68 nifty stocks using ~5 years of real historical ohlcv data",
          "agents connect via http/websocket, receive market observations with technical indicators, and respond with plain-text trade actions (buy, sell, hold)",
          "three difficulty tiers: single stock (20 days), portfolio (30 days), full autonomous (40 days) — each with escalating constraints like transaction costs, slippage, position limits, and regime gates",
        ],
      },
      {
        title: "how it works",
        items: [
          "market simulator replays historical price windows with a 50-day lookback buffer for indicator computation",
          "feature engine computes rsi, macd, bollinger bands, volume spikes, trend, momentum, and volatility — served as human-readable text summaries for llm agents",
          "step-level reward shaping: pnl reward, discipline bonus, regime gate penalty, trade limit violations",
          "task-specific graders score the full trajectory on sharpe ratio, discipline, regime compliance, and risk management",
        ],
      },
      {
        title: "why it matters — rlvr & grpo",
        items: [
          "the grading system is designed as a verifiable reward function (rlvr) — deterministic scores that replace traditional reward models",
          "this enables grpo-based training: generate multiple rollouts through the environment, rank them by grader score, and update model weights to favor better trading trajectories",
          "no separate reward model or critic needed — the environment's graders are the reward signal",
          "the trader agent project is the target policy model — the goal is to train it using this environment's verifiable rewards to improve its trading decisions",
        ],
      },
      {
        title: "what's next (in progress)",
        items: [
          "integrating with unsloth/trl for grpo-based rl training of the trader agent",
          "vllm deployment for inference optimization during rollout generation",
          "data pipeline for collecting and processing thousands of training rollouts",
          "the environment (phase 1) is complete — now building the training loop (phase 2)",
        ],
      },
    ],
    links: {
      github: "https://github.com/sarthakbiswas97/stock-trader-env",
    },
    technologies: [
      "python",
      "fastapi",
      "pydantic",
      "docker",
      "websocket",
      "openenv",
      "hugging face spaces",
    ],
    features: [
      {
        title: "meta pytorch hackathon finale",
        description:
          "qualified for the finale (top 800 out of 32,000+ teams). built and presented the environment to meta engineers in bangalore, april 2026.",
      },
      {
        title: "three difficulty tiers",
        description:
          "single stock (easy, 20 days), portfolio (medium, 30 days), and full autonomous (hard, 40 days) with escalating constraints — transaction costs, slippage, position limits, trade caps, and regime gates.",
      },
      {
        title: "verifiable reward design (rlvr)",
        description:
          "deterministic grading functions that score agents on sharpe ratio, discipline, regime compliance, and risk management. designed to serve as verifiable rewards for grpo-based rl training — no separate reward model needed.",
      },
      {
        title: "real market data & technical analysis",
        description:
          "68 nifty stocks with ~5 years of daily ohlcv data. featureengine computes rsi, macd, bollinger bands, volume spikes, trend, momentum, and volatility from a 50-day lookback buffer.",
      },
      {
        title: "llm-native interface",
        description:
          "plain-text action space (buy, sell, hold) and human-readable market summaries — any llm can act as an agent without special tooling. invalid actions gracefully default to hold.",
      },
      {
        title: "seed-reproducible episodes",
        description:
          "fully deterministic episodes for reproducible evaluation. same seed produces same market window and sequence.",
      },
    ],
    workflow: [
      "agent connects via http/websocket and resets environment with a task and seed",
      "environment selects a random market window and returns initial observation",
      "agent reads market summary with technical indicators and submits trade action",
      "environment executes trade with realistic costs/slippage, computes reward, advances to next day",
      "at episode end, grader scores the full trajectory on task-specific criteria",
    ],
  },
  {
    id: 3,
    name: "autonomous trader agent",
    date: "march, 2026",
    collabs: [],
    type: "ml/quant",
    featured: true,
    description:
      "autonomous trading system for indian equity markets using cross-sectional reversal scoring on 96 nifty stocks. backtested 8.6% cagr with 60% win rate over 5.4 years.",
    contentSections: [
      {
        title: "the strategy",
        items: [
          "cross-sectional reversal — ranks 96 nifty stocks by magnitude of decline over a 5-21 day lookback, buys the most oversold, holds for 5 trading days",
          "the edge is behavioral: panic selling pushes stocks below fair value, creating a mean-reversion opportunity that algorithms can't easily arbitrage away",
          "information coefficient: +0.020 (large-cap), +0.025 (midcap) — a small but consistent edge compounded over thousands of trades",
        ],
      },
      {
        title: "research journey",
        items: [
          "tested 6 strategies systematically before finding the edge",
          "5 failed: intraday ml prediction, breakout detection, 5-min mean reversion, 30-min trend following, cross-sectional ml — indian large-cap stocks are too efficient at intraday resolution",
          "daily reversal was the only signal that survived — driven by human psychology, not technical patterns",
          "evolved through 4 versions of allocation logic, each improving capital efficiency — the underlying signal never changed",
        ],
      },
      {
        title: "how it works",
        items: [
          "3-state regime classifier (bull/neutral/weak) using nifty vs 50-dma, momentum, and market breadth with a 2-day persistence filter",
          "adaptive confidence scoring: continuous 0-1 score combining ic, rolling win rate, momentum, and breadth for smooth capital allocation",
          "risk controls: regime-based exposure gates, soft drawdown dampening, recovery boost, kill switches on declining win rates or negative ic, panic filters",
          "a/b pipeline testing with independent scan intervals, capital pools, and paper broker instances for isolated comparison",
        ],
      },
      {
        title: "results",
        items: [
          "backtested over 5.4 years (oct 2020 – jan 2025): 8.6% cagr, 42% total return, 60% win rate",
          "survived the 2025-26 bear market with 6.5% cagr and 9-16% max drawdown",
          "large-cap returns: +38% | midcap returns: +108% (2.8x higher)",
          "~52% average capital deployment — the rest held as a protective cash buffer",
        ],
      },
      {
        title: "what's next",
        items: [
          "this is the target policy model for rl training — the stock-trader-env project provides the verifiable reward environment",
          "goal: use grpo to train the agent's decision-making on thousands of simulated rollouts, optimizing for sharpe ratio and risk discipline",
          "replacing rule-based scoring with a learned policy that adapts to market conditions",
        ],
      },
    ],
    links: {
      github: "https://github.com/sarthakbiswas97/trader",
      demo: "https://trader.sarthakb.xyz",
    },
    technologies: [
      "python",
      "fastapi",
      "postgresql",
      "docker",
      "github actions",
      "zerodha kite connect",
    ],
    features: [
      {
        title: "cross-sectional reversal scoring",
        description:
          "ranks 96 nifty stocks by decline magnitude. information coefficient: +0.020 (large-cap), +0.025 (midcap). exploits behavioral overreaction — a structural edge driven by psychology, not patterns algorithms can arbitrage away.",
      },
      {
        title: "3-state regime classifier",
        description:
          "classifies market as bull (65-85% exposure), neutral (50-75%), or weak (8-40%) using nifty vs 50-dma, momentum, and breadth. 2-day persistence filter prevents whipsawing.",
      },
      {
        title: "adaptive confidence scoring",
        description:
          "continuous 0-1 scoring combining information coefficient, rolling win rate, momentum, and market breadth. replaces hard thresholds for smoother capital allocation.",
      },
      {
        title: "a/b pipeline testing",
        description:
          "two independent pipelines with separate scan intervals and capital pools. each pipeline runs its own paper broker instance for isolated comparison.",
      },
      {
        title: "risk management layers",
        description:
          "regime-based exposure gates, soft drawdown dampening (gentle in bull, aggressive in weak), recovery boost when signal improves during drawdown recovery, and kill switches that pause trading on declining win rates or negative ic.",
      },
      {
        title: "research-driven development",
        description:
          "tested 6 strategies systematically before finding the edge. 5 failed (ml prediction, breakouts, intraday mean reversion, trend following, cross-sectional ml). every version improvement came from better capital allocation — the signal never changed.",
      },
    ],
    workflow: [
      "regime classifier evaluates market conditions (bull/neutral/weak)",
      "confidence scorer computes allocation weight from ic, win rate, momentum, breadth",
      "reversal scanner ranks stocks by decline magnitude across lookback windows",
      "risk guardian validates exposure limits, drawdown gates, and kill switches",
      "trade executor places orders via zerodha kite connect (cnc for swing holding)",
    ],
  },
];
