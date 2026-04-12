import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";
import Button from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "All projects by Sarthak Biswas.",
};

export default function ProjectsPage() {
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

      <h1 className="text-4xl md:text-6xl font-medium mb-16">projects</h1>

      <div className="max-w-3xl mx-auto flex flex-col">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className={`py-16 ${index !== projects.length - 1 ? "border-b border-foreground/10" : ""}`}
          >
            <header className="mb-12">
              <h2 className="text-3xl md:text-5xl font-medium mb-4">
                {project.name}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-foreground/60">
                <time>{project.date}</time>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tag: string) => (
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

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="mb-6 text-lg md:text-xl font-light leading-relaxed text-foreground/80">
                {project.description}
              </p>

              <div className="mt-12 mb-8 flex gap-4">
                {project.links?.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <Button className="group flex items-center gap-2 text-sm">
                      <span>view demo</span>
                      <ArrowUp
                        size={16}
                        className="group-hover:rotate-45 transition-transform duration-300"
                      />
                    </Button>
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <Button className="group flex items-center gap-2 text-sm">
                      <span>view source</span>
                      <ArrowUp
                        size={16}
                        className="group-hover:rotate-45 transition-transform duration-300"
                      />
                    </Button>
                  </a>
                )}
              </div>

              {project?.contentSections ? (
                <div className="flex flex-col gap-10 mb-6">
                  {project.contentSections.map((section, i) => (
                    <div key={i}>
                      <h3 className="text-sm tracking-widest uppercase text-foreground/40 mb-4">
                        / {section.title}
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {section.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-sm md:text-base font-light leading-relaxed text-foreground/80 pl-4 border-l-2 border-foreground/10"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mb-6 font-light leading-relaxed">
                  {project?.content}
                </p>
              )}

              {project.workflow && project.workflow.length > 0 && (
                <div className="mt-16 not-prose">
                  <h2 className="text-sm tracking-widest uppercase text-foreground/40 mb-6">
                    / how it works
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-foreground/10">
                    {project.workflow.map((step, i) => (
                      <div
                        key={i}
                        className="p-4 border-r last:border-r-0 border-foreground/10"
                      >
                        <span className="text-xs text-foreground/30 block mb-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.features && project.features.length > 0 && (
                <div className="mt-16 not-prose">
                  <h2 className="text-sm tracking-widest uppercase text-foreground/40 mb-6">
                    / features
                  </h2>
                  <div className="flex flex-col gap-0">
                    {project.features.map((feature, i) => (
                      <div
                        key={i}
                        className="border-b border-foreground/10 py-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8"
                      >
                        <div className="text-sm font-normal">
                          {feature.title}
                        </div>
                        <div className="md:col-span-2 text-sm font-light text-foreground/70">
                          {feature.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
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
