export type Project = {
  id: number;
  name: string;
  collabs: string[];
  type: string;
  date: string;
  hidePreview?: boolean;
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
};

export const projects: Project[] = [
  {
    id: 0,
    name: "resimator's landing page",
    date: "march, 2024",
    collabs: [],
    type: "fullstack",
    description:
      "landing page with strapi cms, graphql, framer motion, and a custom design system",
    content:
      "landing page for a finnish company. built with strapi cms for content management and graphql for data fetching. uses framer motion for animations and a custom design system for consistent styling.",
    links: {
      demo: "https://staging.resimator.fi/",
    },
    technologies: ["strapi", "graphql", "framer motion", "design system"],
  },
  {
    id: 1,
    name: "a5it",
    date: "february, 2024",
    collabs: ["sls0n"],
    type: "fullstack/devops",
    description:
      "e-commerce platform developed in collaboration with silson sapkota",
    content:
      "e-commerce platform for selling products online. built with modern web technologies and deployed with proper devops practices.",
    links: {
      demo: "https://a5it.com/",
    },
    technologies: ["e-commerce", "collaboration"],
  },
  {
    id: 2,
    name: "aiprep",
    date: "november, 2025 - present",
    collabs: ["dipenbhat557"],
    type: "fullstack",
    hidePreview: true,
    content:
      "ai video generation tool focused on creating engaging and educational videos for students.",
    links: {
      demo: "https://aiprep.in/",
    },
    technologies: ["manim", "openrouter", "fastapi", "nextjs", "system design"],
  },
  {
    id: 3,
    name: "webcraft",
    date: "december, 2024",
    collabs: ["sls0n"],
    type: "fullstack",
    content:
      "drag-and-drop website builder tool. users can create websites without coding by dragging components and customizing them.",
    links: {
      demo: "https://x.com/usewebcraft",
    },
    technologies: ["website builder", "collaboration"],
  },
  {
    id: 6,
    name: "utarchadhav",
    date: "september, 2023",
    collabs: ["kirangajurel"],
    type: "fullstack",
    description: "podcast platform",
    content:
      "platform for hosting and streaming podcasts. users can upload audio files and listeners can stream episodes.",
    links: {
      demo: "https://utarchadhav.com",
    },
    technologies: ["podcast"],
  },
  {
    id: 9,
    name: "social media scheduler",
    date: "halted",
    collabs: ["sumansid"],
    type: "fullstack",
    links: {
      demo: "https://schedule.video/",
    },
    description:
      "features oauth with tiktok, instagram and linkedin, self-hosted scheduler with express, nextauth, prisma with postgres, stripe, and supabase for storage",
    content:
      "social media scheduling tool. users can connect their social accounts and schedule posts across multiple platforms. includes payment processing and file storage.",
    technologies: [
      "oauth",
      "express",
      "nextauth",
      "prisma",
      "postgres",
      "stripe",
      "supabase",
    ],
  },
  {
    id: 10,
    name: "nepal atlas map",
    date: "feb 11, 2026",
    collabs: [],
    type: "fullstack",
    content:
      "nepal's provinces, district, municipality and constituency visualization",
    links: {
      demo: "https://electionatlas.ankurgajurel.com.np/immersive",
    },
    technologies: ["nextjs", "d3.js", "topojson", "tailwind css"],
  },
  {
    id: 11,
    name: "cognistream.ai",
    date: "july, 2025 - present",
    collabs: [],
    type: "fullstack",
    content:
      "ai video generation tool focused on creating engaging and educational videos for students.",
    links: {
      demo: "https://cognistream.ai/",
    },
    technologies: ["nextjs", "fastapi", "inngest", "typescript", "supabase"],
  },
];
