export interface Skill {
  id: string;
  title: string;
  items: string[];
}

export const skills: Skill[] = [
  {
    id: "ai-ml",
    title: "ai / machine learning",
    items: ["PyTorch", "Hugging Face", "Scikit-learn", "Unsloth AI", "LLMs", "NLP", "Reinforcement Learning"],
  },
  {
    id: "training-techniques",
    title: "training / techniques",
    items: ["SFT", "DPO", "RAG", "Prompt Engineering", "LLM Fine-tuning", "Data Pipelines"],
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
    items: ["AWS/GCP", "DigitalOcean", "Docker", "vLLM", "CI/CD", "GitHub Actions"],
  },
  {
    id: "languages-tools",
    title: "languages & tools",
    items: ["Python", "TypeScript", "Git", "Linux", "Vim"],
  },
];
