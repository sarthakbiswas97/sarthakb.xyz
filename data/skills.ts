export interface Skill {
  id: string;
  title: string;
  items: string[];
}

export const skills: Skill[] = [
  {
    id: "cloud-devops",
    title: "cloud",
    items: ["AWS", "DigitalOcean", "GitHub Actions", "Docker", "Kubernetes"],
  },
  {
    id: "frontend",
    title: "frontend",
    items: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "React Query"],
  },
  {
    id: "backend",
    title: "backend",
    items: ["Node.js", "Express", "Nest.js", "GraphQL", "PostgreSQL", "Strapi"],
  },
  {
    id: "languages-tools",
    title: "language & tools",
    items: ["TypeScript", "JavaScript", "Go", "Git", "Linux", "Vim"],
  },
];
