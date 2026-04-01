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
    name: "trader",
    date: "march, 2026",
    collabs: [],
    type: "fullstack/ml",
    featured: true,
    description:
      "autonomous trading system for indian equity markets using short-term mean-reversion on nifty 100 stocks.",
    content:
      "multi-engine autonomous trading system targeting nifty 50 and nifty 100 stocks. uses a short-term mean-reversion strategy — identifies stocks with the largest declines over a 5-21 day lookback and bets on a rebound within 5 trading days. features a regime classifier (bull/neutral/weak) that dynamically adjusts capital allocation using information coefficient, win rate, momentum, and market breadth. includes risk management layers with drawdown dampening, recovery boost, and kill switches. integrates with zerodha kite connect for live/paper trading. backtested over 5.4 years with 54-58% win rate and +40% combined returns.",
    links: {
      github: "https://github.com/sarthakbiswas97/trader",
      demo: "https://trader-wine-omega.vercel.app",
    },
    technologies: [
      "python",
      "fastapi",
      "next.js",
      "typescript",
      "tailwind css",
      "neon postgres",
      "docker",
      "github actions",
      "zerodha kite connect",
    ],
    features: [
      {
        title: "multi-engine design",
        description:
          "separate engines for large-cap (nifty 50) and midcap (nifty 100) universes with independent strategies.",
      },
      {
        title: "regime classifier",
        description:
          "categorizes market conditions as bull, neutral, or weak and dynamically adjusts capital allocation.",
      },
      {
        title: "risk management",
        description:
          "regime-based exposure gates, drawdown dampening curves, recovery boost, and kill switches on declining win rates.",
      },
      {
        title: "paper trading",
        description:
          "full paper trading mode that logs trades, snapshots, stock rankings, and regime transitions daily.",
      },
      {
        title: "dashboard",
        description:
          "real-time frontend with market status, regime display, pnl tracking, price charts, and replay mode.",
      },
    ],
    workflow: [
      "regime classifier evaluates market conditions",
      "stock ranker identifies top reversal candidates",
      "risk guardian validates exposure limits",
      "trade executor places orders via zerodha",
    ],
  },
  {
    id: 2,
    name: "research copilot",
    date: "september, 2025",
    collabs: [],
    type: "ai/platform",
    description:
      "ai-powered research copilot for engineers that unifies search across internal and external knowledge.",
    content:
      "a scalable platform for engineers to query and ingest knowledge from multiple sources. features a gateway api with endpoints for natural language queries and content ingestion. built with a microservice architecture designed to support additional services like vector search and rag pipelines. includes strict dev tooling with ci, linting, type checking, and pre-commit hooks.",
    links: {
      github: "https://github.com/sarthakbiswas97/research-copilot",
    },
    technologies: [
      "python",
      "fastapi",
      "pydantic",
      "postgresql",
      "docker",
      "github actions",
      "ruff",
      "mypy",
    ],
    features: [
      {
        title: "query endpoint",
        description:
          "natural language question interface with session tracking for contextual follow-ups.",
      },
      {
        title: "ingestion pipeline",
        description:
          "accepts source urls or raw content for indexing into the knowledge base.",
      },
      {
        title: "microservice architecture",
        description:
          "gateway-based design ready to scale with dedicated query and ingestion services.",
      },
    ],
  },
  {
    id: 3,
    name: "opinion trading",
    date: "october, 2024",
    collabs: [],
    type: "backend",
    description:
      "event-based opinion trading platform backend with in-memory order book and real-time websocket updates.",
    content:
      "backend for an opinion/event trading platform similar to probo or polymarket. users trade yes/no shares on event outcomes with a full in-memory order book and matching engine. uses a task queue pattern — express api pushes tasks to redis, a worker processes them against in-memory state, and results are published back via pub/sub. includes real-time websocket updates so clients get live order book changes. supports user management, inr on-ramp, order placement, minting, and balance queries.",
    links: {
      github: "https://github.com/sarthakbiswas97/opinion-trading",
    },
    technologies: [
      "javascript",
      "express",
      "redis",
      "websocket",
      "prisma",
      "postgresql",
      "jest",
      "bun",
    ],
    features: [
      {
        title: "order book engine",
        description:
          "full matching engine for yes/no shares with price levels summing to 10. handles buy/sell matching and order reversal.",
      },
      {
        title: "task queue architecture",
        description:
          "redis-backed task queue with pub/sub for decoupled api and worker processing.",
      },
      {
        title: "real-time updates",
        description:
          "websocket server pushes live order book changes to subscribed clients per symbol.",
      },
      {
        title: "user & balance management",
        description:
          "user creation, inr on-ramp, stock minting, and balance/locked tracking.",
      },
    ],
  },
  {
    id: 4,
    name: "vps deploy guide",
    date: "april, 2026",
    collabs: [],
    type: "docs/fullstack",
    description:
      "interactive documentation site teaching end-to-end deployment of dockerized projects to a vps.",
    content:
      "a 9-chapter guide covering the full deployment pipeline: ci/cd with github actions pushing to ghcr, vps setup, docker, nginx reverse proxy, ssl with certbot, dns configuration, auto-deploy via ssh, and operations/maintenance. built as a next.js documentation site with mdx content, syntax highlighting, sidebar navigation, search, and an integrated ai chatbot powered by groq (llama 3.3 70b) that can answer questions grounded in the guide content.",
    links: {
      github: "https://github.com/sarthakbiswas97/devops-learning",
      demo: "https://devops.sarthakb.xyz",
    },
    technologies: [
      "next.js",
      "typescript",
      "tailwind css",
      "mdx",
      "shiki",
      "groq",
      "vercel ai sdk",
      "bun",
    ],
    features: [
      {
        title: "9-chapter guide",
        description:
          "covers ci/cd, docker, nginx, ssl, dns, auto-deploy, and operations from scratch.",
      },
      {
        title: "ai chatbot",
        description:
          "integrated chatbot using groq with llama 3.3 70b, grounded in the documentation content.",
      },
      {
        title: "rich documentation ux",
        description:
          "sidebar navigation, table of contents, breadcrumbs, search, code copy, and prev/next navigation.",
      },
    ],
  },
];
