# X Thread: Post-Training RL Failures and Fixes (GRPO)

Status: DRAFT
Image: training-curves-final.png (attach to Tweet 1)

---

## Tweet 1 (Hook — with image)

Things nobody tells you before you start post-training with reinforcement learning:

Your training loss will go down. Your model will get worse.

I built an RL environment from scratch, trained GRPO against it on a 7B model — went from 0.300 to 0.537 (79% improvement).

Most of that journey was failures. Here's what to watch for

[attach training-curves-final.png]

---

## Tweet 2 (Training data + checkpoints)

Start here: your data and your checkpoints.

10K reverse-distilled examples beat 40K templates. Start with the correct answer, generate reasoning backward — the model learns to think through trade-offs, not pattern-match indicators to outputs.

And pick checkpoints by eval score, never training loss. My best checkpoint had higher loss than the final one. Lower loss meant the model was memorizing training data, not learning the task.

---

## Tweet 3 (HOLD Collapse)

If inaction has zero cost, the model will always choose inaction.

Any RL setup where "do nothing" has no penalty — the model finds it. Within 200 training steps against the environment, mine collapsed to 85% no-ops. Zero reward variance, zero gradient, nothing learning.

Every possible action needs consequences. Including doing nothing.

---

## Tweet 4 (Reward Hacking)

The model will optimize exactly what you measure.

I had 4 reward components — format, reasoning, task performance, prediction. Audited the breakdown: 84% of reward came from formatting.

The model learned to write beautifully structured responses while making terrible decisions. Optimized for looking smart, not being smart.

Fix: format compliance is a gate (pass/fail), never a gradient signal. Don't reward expected behavior. All positive reward from task outcomes only.

---

## Tweet 5 (KL Catastrophe)

The failure that hurts the most: KL catastrophe.

Reward curves climbing. Action distribution healthy. Every training metric green.

Eval against the environment: worse than the untrained base model.

KL divergence hit 4.2 — the model drifted so far from its SFT base that it forgot everything fine-tuning taught it. Coherent outputs, random decisions.

Monitor KL, not reward. Hard stop at KL > 3.0. The dashboard will lie to you.

---

## Tweet 6 (What fixed it + link)

What actually worked — training GRPO against a neural world model environment instead of static data:

— Clean SFT checkpoint as starting point, never a previous RL run. KL drift compounds.
— 300 steps with strong KL penalty (beta=0.05). Short runs, more retained knowledge.
— Stochastic environment. If the model can memorize price sequences, it will. The neural world model generates unique trajectories every episode — forces generalization.
— Checkpoint every 50 steps. Best model is almost never the last one.

The algorithm wasn't the bottleneck. The environment and reward design were.

Full experiment log — every failure, every fix, training curves, code + models:
sarthakb.xyz/blog/training-llm-stock-trader-sft-grpo
