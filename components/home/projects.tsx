"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";
import HomeProjectCard from "./project-card";
import { useRouter } from "next/navigation";

export default function HomeProjects() {
  const router = useRouter();

  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <Link href={"/#projects"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span className="group-hover:underline">projects</span>
            <ArrowUp
              size={48}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </h2>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-0">
          <div className="table-border-header grid grid-cols-[1fr_2fr_1fr_auto] p-1 text-xs text-foreground/50">
            <div>/ DATE</div>
            <div>/ PROJECT</div>
            <div>/ TYPE</div>
            <div className="w-6"></div>
          </div>

          {projects.map((project) => (
            <div key={project.id}>
              <HomeProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-0 md:hidden">
        {projects.map((project) => (
          <div
            key={project.id}
            className="table-border py-3 cursor-pointer"
            onClick={() => router.push("/projects/" + project.id)}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">
                {project.name}
              </span>
              <span className="text-xs text-foreground/50">{project.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
