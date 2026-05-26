export interface Skill {
  id: string;
  title: string;
  items: string[];
}

export const skills: Skill[] = [
  {
    id: "ai-ml",
    title: "ai / ml",
    items: ["PyTorch", "HF Transformers", "Scikit-learn", "Unsloth AI", "vLLM"],
  },
  {
    id: "techniques",
    title: "techniques",
    items: ["LLM Fine-tuning", "Reinforcement Learning", "Deep Learning", "RAG", "Feature Engineering", "Data Pipelines"],
  },
  {
    id: "data-libraries",
    title: "data / libraries",
    items: ["Pandas", "NumPy", "OpenCV", "NLTK", "Matplotlib"],
  },
  {
    id: "backend-databases",
    title: "backend / databases",
    items: ["FastAPI", "Celery", "Redis", "PostgreSQL", "Vector Databases"],
  },
  {
    id: "cloud-devops",
    title: "cloud / devops / mlops",
    items: ["AWS/GCP", "DigitalOcean", "Docker", "CI/CD", "GitHub Actions"],
  },
  {
    id: "languages-tools",
    title: "languages & tools",
    items: ["Python", "TypeScript", "Git", "Linux", "Vim"],
  },
];
