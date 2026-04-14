import { redirect } from "next/navigation";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { getPostById, getAllPostIds } from "@/lib/blog";
import { Metadata } from "next";

export async function generateStaticParams() {
  return getAllPostIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const post = await getPostById(id);

  if (!post)
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      ...(post.ogImage && {
        images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.ogImage && { images: [post.ogImage] }),
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const post = await getPostById(id);

  if (!post) redirect("/");

  return (
    <section className="container p-4 my-10 md:my-16 lg:my-20">
      <Link href="/" className="inline-block mb-10 group">
        <div className="flex items-center gap-2 text-sm">
          <ArrowUp
            size={20}
            className="rotate-90 group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="group-hover:underline">back to home</span>
        </div>
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-medium mb-4">
            {post.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-foreground/60">
            <time>{post.date}</time>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 border-[0.5px] border-foreground hover:bg-card transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-16 pt-8 border-t-[0.5px] border-foreground/20">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 group text-lg"
          >
            <ArrowUp
              size={20}
              className="rotate-90 group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span className="group-hover:underline">back to home</span>
          </Link>
        </footer>
      </article>
    </section>
  );
}
