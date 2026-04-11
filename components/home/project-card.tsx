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
      className="grid grid-cols-[1fr_2fr_1fr_auto] px-3 group transition-colors duration-200 font-light cursor-pointer table-border py-1.5 hover:bg-card"
      onClick={() => router.push("/projects/" + project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          router.push("/projects/" + project.id);
      }}
    >
      <div className="text-sm">{project.date}</div>
      <div className="text-sm">{project.name}</div>
      <div className="text-sm text-foreground">{project.type}</div>
      <div className="w-6 flex items-center justify-end">
        <ArrowUp
          size={14}
          className="group-hover:rotate-45 transition-transform duration-300 text-foreground hidden md:block"
        />
      </div>
    </div>
  );
}
