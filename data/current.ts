export type CurrentWork = {
  name: string;
  description: string;
  status: string;
};

export const currentWork: CurrentWork[] = [
  {
    name: "browser world model",
    description:
      "causal transformer world model for browser environments — predicting dom state transitions from agent actions, enabling offline rl training for web agents.",
    status: "architecture design",
  },
  {
    name: "specification gaming detection",
    description:
      "formalizing a 3-class taxonomy of llm agent specification gaming (reward-free inaction, proxy gaming, kl catastrophe) and building a world-model-grounded detector that flags gaming during grpo training.",
    status: "research & experiment design",
  },
];
