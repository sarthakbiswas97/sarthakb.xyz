import { skills } from "@/data/skills";

export default function HomeSkills() {
  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <h2 className="text-6xl">skills</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="flex flex-col gap-0">
          <div className="table-border-header grid grid-cols-4 p-1 text-xs">
            <div>/ CATEGORY</div>
            <div className="col-span-3">/ TOOLS</div>
          </div>

          {skills.map((skill) => (
            <div
              key={skill.id}
              className="table-border grid grid-cols-4 px-1 py-2 font-light"
            >
              <div className="text-sm">{skill.title}</div>
              <div className="col-span-3 text-sm">
                {skill.items.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {skills.map((skill) => (
          <div key={skill.id} className="table-border pb-4 font-light">
            <div className="text-xs text-foreground/50 mb-1">/ {skill.title.toUpperCase()}</div>
            <div className="text-sm">{skill.items.join(", ")}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
