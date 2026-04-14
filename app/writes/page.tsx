import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writes",
  description: "Writing by Sarthak Biswas.",
};

export default function WritesPage() {
  const posts = getAllPostsMeta();

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

      <h1 className="text-4xl md:text-6xl font-medium mb-16">writes</h1>

      <div className="max-w-3xl mx-auto flex flex-col">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className={`group py-10 ${index !== posts.length - 1 ? "border-b border-foreground/10" : ""}`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl md:text-3xl font-medium group-hover:underline">
                  {post.title}
                </h2>
                <ArrowUp
                  size={18}
                  className="shrink-0 group-hover:rotate-45 transition-transform duration-300 text-foreground hidden md:block"
                />
              </div>
              <div className="flex items-center gap-4">
                <time className="text-sm text-foreground/50">{post.date}</time>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 border-[0.5px] border-foreground/30 text-foreground/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm md:text-base font-light text-foreground/70 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <footer className="max-w-3xl mx-auto mt-16 pt-8 border-t border-foreground/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group text-lg"
        >
          <ArrowUp
            size={20}
            className="rotate-90 group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span className="group-hover:underline">back to home</span>
        </Link>
      </footer>
    </section>
  );
}
