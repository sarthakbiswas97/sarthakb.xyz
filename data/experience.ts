export const experiences = [
  {
    id: 0,
    company: "doubtflix (aiprep)",
    website: "https://doubtflix.com",
    stacks: [
      "fastapi",
      "postgresql",
      "docker",
      "s3",
      "hugging face",
      "unsloth ai",
    ],
    roles: [
      {
        title: "ai engineer",
        period: "nov 2025 - apr 2026",
        type: "full time, remote",
        description:
          "ai video generation pipeline (0 to 1), llm orchestration, model fine-tuning, rag search, and recommendation systems for an edtech platform.",
        details: [
          {
            title: "video generation pipeline",
            description:
              "ai video generation pipeline (0 to 1) using manim + elevenlabs tts, multilingual narration across 14+ languages.",
          },
          {
            title: "llm orchestration",
            description:
              "multi-stage llm pipeline with model routing, tool calling, and async task execution.",
          },
          {
            title: "dataset engineering & finetuning",
            description:
              "sft/dpo data pipelines using unsloth ai, curated datasets across 13 subjects for domain-specific fine-tuning.",
          },
          {
            title: "rag & search",
            description:
              "rag-powered search and production apis, contextual retrieval across educational content.",
          },
          {
            title: "recommendation system",
            description:
              "personalized recommendation engine using collaborative filtering, vector embeddings, weighted ranking with cold-start handling.",
          },
        ],
      },
    ],
  },
];
