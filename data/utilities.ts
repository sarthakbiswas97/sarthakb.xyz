export type Utility = {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
};

export const utilities: Utility[] = [
  {
    id: 0,
    name: "clerk-export",
    description:
      "export clerk data -- orgs and users (including metadatas)",
    url: "https://github.com/ankurgajurel/clerk-export",
    language: "TypeScript",
  },
  {
    id: 1,
    name: "s3-preview",
    description: "preview s3",
    url: "https://github.com/ankurgajurel/s3-preview",
    language: "TypeScript",
  },
  {
    id: 2,
    name: "open-graph",
    description: "generate open graph images for any url",
    url: "https://tools.ankurgajurel.com.np/tools/open-graph",
    language: "Web",
  },
  {
    id: 3,
    name: "trimmer",
    description: "trim and cut media files",
    url: "https://tools.ankurgajurel.com.np/tools/trimmer",
    language: "Web",
  },
  {
    id: 4,
    name: "image-compressor",
    description: "compress images without losing quality",
    url: "https://tools.ankurgajurel.com.np/tools/image-compressor",
    language: "Web",
  },
];
