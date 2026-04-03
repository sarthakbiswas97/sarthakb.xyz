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
    name: "stock trader env",
    date: "april, 2026",
    collabs: [],
    type: "rl/env",
    description:
      "openenv reinforcement learning environment that simulates daily stock trading on indian equity markets for evaluating llm agents.",
    content:
      "a real-world rl environment for llm agents to trade nifty stocks using real historical ohlcv data for 68 stocks spanning ~5 years. agents connect via http or websocket, receive market observations enriched with technical indicators (rsi, macd, bollinger bands, trend, momentum, volatility), and respond with plain-text trade actions. features three difficulty tiers — single stock, portfolio, and full autonomous — with increasing constraints like transaction costs, slippage, position limits, trade caps, and a regime gate that penalizes trading during market-wide downturns. includes step-level reward shaping with pnl reward, risk discipline bonus, and penalty signals.",
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
    ],
    features: [
      {
        title: "three difficulty tiers",
        description:
          "single stock (easy), portfolio (medium), and full autonomous (hard) with escalating constraints like costs, slippage, position limits, and regime gates.",
      },
      {
        title: "real market data",
        description:
          "historical ohlcv data for 68 nifty stocks with technical indicators computed from a 50-day lookback window.",
      },
      {
        title: "llm-native interface",
        description:
          "plain-text action space (buy, sell, hold) and human-readable market summaries — any llm can act as an agent without special tooling.",
      },
      {
        title: "reward shaping",
        description:
          "step-level rewards combining pnl, risk discipline bonus, regime gate penalty, trade limit violations, and invalid sell penalties.",
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
