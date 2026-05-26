import { ArrowUp } from "lucide-react";
import { currentWork } from "@/data/current";

export default function CurrentlyWorkingOn() {
  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <h2 className="text-6xl flex gap-2 items-end group">
          <span>exploring</span>
          <ArrowUp
            size={48}
            className="group-hover:rotate-45 transition-transform duration-300"
          />
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {currentWork.map((item) => (
          <div
            key={item.name}
            className="flex flex-col gap-2 pb-6 border-b border-foreground/10 last:border-0"
          >
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
              <h3 className="text-2xl font-medium">
                {item.name}
              </h3>
              <span className="text-xs px-2 py-0.5 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400 w-fit">
                {item.status}
              </span>
            </div>
            <p className="text-base md:text-lg font-light leading-relaxed text-foreground/70">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
