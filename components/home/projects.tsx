"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { projects, Project } from "@/data/projects";
import HomeProjectCard from "./project-card";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

function getGithubOgUrl(project: Project): string | null {
  if (project.links?.github) {
    return `https://opengraph.githubassets.com/1/${project.links.github.replace("https://github.com/", "")}`;
  }
  return null;
}

export default function HomeProjects() {
  const [hovered, setHovered] = useState<{
    projectId: number;
    x: number;
    y: number;
  } | null>(null);
  const [ogCache, setOgCache] = useState<Record<number, string | null>>({});
  const fetchedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Prefetch OG images for all projects
    projects.forEach(async (project) => {
      if (fetchedRef.current.has(project.id)) return;
      fetchedRef.current.add(project.id);

      const githubOg = getGithubOgUrl(project);
      if (githubOg) {
        setOgCache((prev) => ({ ...prev, [project.id]: githubOg }));
        return;
      }

      if (project.links?.demo) {
        try {
          const res = await fetch(
            `/api/og?url=${encodeURIComponent(project.links.demo)}`,
          );
          const data = await res.json();
          setOgCache((prev) => ({ ...prev, [project.id]: data.ogImage }));
        } catch {
          setOgCache((prev) => ({ ...prev, [project.id]: null }));
        }
      }
    });
  }, []);

  const previewUrl = hovered ? ogCache[hovered.projectId] : null;

  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link href={"/#projects"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span className="group-hover:underline">projects</span>
            <ArrowUp
              size={48}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </h2>
        </Link>
      </motion.div>

      <div className="overflow-x-auto">
        <div className="flex flex-col gap-0 min-w-[600px]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="table-border-header grid grid-cols-5 p-1 text-xs text-foreground/50"
          >
            <div>/ DATE</div>
            <div className="col-span-2">/ PROJECT</div>
            <div>/ COLLABS</div>
            <div className="grid grid-cols-2">
              <div>/ TYPE</div>
              <div></div>
            </div>
          </motion.div>

          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <HomeProjectCard
                project={project}
                onMouseEnter={(e) => {
                  if (ogCache[project.id]) {
                    setHovered({
                      projectId: project.id,
                      x: e.clientX,
                      y: e.clientY,
                    });
                  } else {
                    setHovered(null);
                  }
                }}
                onMouseMove={(e) =>
                  setHovered((prev) =>
                    prev && prev.projectId === project.id
                      ? { ...prev, x: e.clientX, y: e.clientY }
                      : null,
                  )
                }
                onMouseLeave={() => setHovered(null)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* {hovered && previewUrl && !projects[hovered.projectId]?.hidePreview && (
        <img
          src={previewUrl}
          alt="Project preview"
          className="fixed w-80 rounded-lg shadow-lg border border-foreground/20 pointer-events-none"
          style={{
            left: hovered.x + 16,
            top: hovered.y + 16,
            zIndex: 9999,
          }}
        />
      )} */}
    </section>
  );
}
