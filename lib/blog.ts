import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

const contentDir = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  ogImage?: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

export function getAllPostsMeta(): BlogPostMeta[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const id = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(contentDir, filename), "utf-8");
    const { data } = matter(raw);

    return {
      id,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      tags: data.tags ?? [],
      ogImage: data.ogImage,
    } as BlogPostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const filePath = path.join(contentDir, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: "github-light" })
    .use(rehypeStringify)
    .process(content);

  return {
    id,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    tags: data.tags ?? [],
    ogImage: data.ogImage,
    contentHtml: String(result),
  };
}

export function getAllPostIds(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
