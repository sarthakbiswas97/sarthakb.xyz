import { ArrowUp } from "lucide-react";
import { Project } from "@/data/projects";
import { useRouter } from "next/navigation";

export default function HomeProjectCard({
  project,
}: {
  project: Project;
}) {
  const router = useRouter();

  return (
    <div
      className={`grid grid-cols-5 px-3 group transition-colors duration-200 font-light cursor-pointer ${
        project.featured
          ? "border-l-2 border-l-foreground bg-foreground/[0.03] py-2.5 hover:bg-foreground/[0.06]"
          : "table-border py-1.5 hover:bg-card"
      }`}
      onClick={() => router.push("/projects/" + project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push("/projects/" + project.id);
      }}
    >
      <div className="text-sm">{project.date}</div>
      <div className="col-span-2 text-sm flex items-center gap-2">
        <span className={project.featured ? "font-normal" : ""}>
          {project.name}
        </span>
        {project.featured && (
          <span className="text-[0.6rem] tracking-widest uppercase text-foreground/40 border border-foreground/15 px-1.5 py-px">
            new
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {project.collabs.map((collab) => (
          <a
            key={collab}
            href={`https://github.com/${collab}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-foreground hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 group/collab"
          >
            @{project.collabs.length > 1 ? collab.slice(0, 5) + "..." : collab}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 items-center">
        <div className="text-sm text-foreground">{project.type}</div>
        <ArrowUp
          size={14}
          className="group-hover:rotate-45 transition-transform duration-300 text-foreground hidden md:block"
        />
      </div>
    </div>
  );
}
