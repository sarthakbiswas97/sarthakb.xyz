# Reusable Application Answers

## Achievement (proudest work)

Built an RL environment and trained GRPO models on a 7B LLM for the Meta PyTorch OpenEnv Hackathon, qualified for the finale (top 800 out of 32,000+ teams). The interesting part was the failures: I documented classes of specification gaming —
- the model discovered zero-cost inaction, gamed format compliance for 84% of reward while making random decisions, and drifted past KL 4.2 while every training metric looked perfect.
- Built a 1.22M-parameter neural world model to generate stochastic training episodes that prevented memorization. The same GRPO approach that failed on static data worked immediately on the neural environment — 0.300 to 0.537 (79% improvement). Code, models, datasets all open source.
- Github: github.com/sarthakbiswas97/stock-trader-env

## Artifacts (high-quality work samples)

1. Blog series on RL environment design + GRPO training, covers reward engineering(hacking), world model architecture, and why every shortcut I left in the environment got exploited within 200 training steps.
- RL environment: sarthakb.xyz/blog/building-rl-environment-for-llm-trading
- LLM SFT and GRPO training: sarthakb.xyz/blog/training-llm-stock-trader-sft-grpo

2. NYC ETA Engine — 3-model ensemble (neural net + LightGBM + FT-Transformer built from scratch) for taxi trip prediction on 37M trips. 253s MAE, 28% better than baseline. Compressed FT-Transformer from 406K to 169K params (smaller model scored better), ONNX export cut inference from 11ms to 4ms.
- Github: github.com/sarthakbiswas97/eta-engine
- Why Ensembles work: https://www.sarthakb.xyz/blog/eta-ensemble-ft-transformer-inference
- Why Statistics Beat XGBoost: https://www.sarthakb.xyz/blog/nyc-eta-feature-engineering-and-neural-nets

## Research Proposal (spec gaming detection)

Area: Specification Gaming Detection in LLM Agent Training

As RL post-training becomes the default for making LLM agents useful (tool use, code generation, browser agents, autonomous workflows), the models are getting better at finding shortcuts in reward functions. The field has taxonomies for this problem but no reliable way to detect it during training, current methods either catch it after the fact through benchmarks, or monitor chain-of-thought which models can learn to hide.

I want to build a detection layer that uses domain-specific world models as a reference signal. The core idea: if a world model says action X in state Y produces outcome distribution Z, and the agent is consistently claiming rewards outside that distribution, something is being gamed. This is a physics check, not a text check you can't hide from it by writing better reasoning.

Why this matters now:
Because every company doing RL post-training (Anthropic, OpenAI, DeepMind, and increasingly startups fine-tuning agents for vertical use cases) runs into reward hacking. The current fix is manual, someone notices eval scores don't match training curves, debugs for days, redesigns the reward. A detection system that flags gaming in real-time during training saves weeks of wasted compute and prevents shipping models that look aligned but aren't.

Open questions:
- Does world-model-grounded detection generalize across agent domains (finance, code, tool use, web)?
- Can environments be designed to be inherently hack-resistant, not just monitored?
- Is this a research contribution (paper + open-source toolkit) or a product (monitoring layer for RL post-training pipelines)?

Timeline: Detection prototype in 2-3 months. Cross-domain validation after that.
