export const experiences = [
  {
    id: 0,
    company: "aiprep",
    website: "https://doubtflix.com",
    stacks: [
      "fastapi",
      "postgresql",
      "pgvector",
      "docker",
      "s3",
      "hugging face",
      "unsloth ai",
      "sentence-transformers",
      "kubernetes",
    ],
    roles: [
      {
        title: "ai engineer",
        period: "nov 2025 - present",
        type: "full time, remote",
        description:
          "built the ai video generation pipeline from scratch — from llm orchestration and model finetuning to production apis serving thousands of users.",
        details: [
          {
            title: "video generation pipeline",
            description:
              "built an end-to-end pipeline that converts text/image queries into animated educational videos with multilingual narration in ~30 seconds. powered 280k+ videos across 14+ languages using manim for animation rendering and elevenlabs for text-to-speech.",
          },
          {
            title: "llm orchestration",
            description:
              "designed a multi-stage llm pipeline with model routing, tool calling, and async task execution. serves 45k+ active users with reliable throughput.",
          },
          {
            title: "dataset engineering & finetuning",
            description:
              "built sft/dpo/repair training data pipelines using unsloth ai for domain-specific model finetuning across multiple subjects — covering supervised fine-tuning, preference optimization, and error recovery.",
          },
          {
            title: "rag & search",
            description:
              "built a rag pipeline that indexes educational content into vector embeddings, retrieves relevant context at query time, and feeds it into the llm for grounded, accurate responses — reducing hallucinations and enabling subject-aware answers.",
          },
          {
            title: "recommendation system",
            description:
              "built a personalized video recommendation engine with multi-source candidate generation (topic-based, collaborative filtering, trending, exploration), embedding similarity search using sentence-transformers and pgvector, and a weighted ranking engine scoring on topic match, freshness, and popularity. handles cold-start users with trending/diverse fallback, and adapts feed composition as users warm up. deployed on kubernetes with 6 background workers for async feed generation.",
          },
        ],
      },
    ],
  },
];
