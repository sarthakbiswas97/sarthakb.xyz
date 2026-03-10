export type Utility = {
  id: number;
  name: string;
  description: string;
  github: string;
  language: string;
};

export const utilities: Utility[] = [
  {
    id: 0,
    name: "clerk-export",
    description:
      "export clerk data -- orgs and users (including metadatas)",
    github: "https://github.com/ankurgajurel/clerk-export",
    language: "TypeScript",
  },
  {
    id: 1,
    name: "pg-backup-cron",
    description: "script that backs up postgres to s3",
    github: "https://github.com/CogniStream/pg-backup-cron",
    language: "TypeScript",
  },
  {
    id: 2,
    name: "s3-preview",
    description: "preview s3",
    github: "https://github.com/ankurgajurel/s3-preview",
    language: "TypeScript",
  },
];
