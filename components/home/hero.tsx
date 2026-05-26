import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { user } from "@/data/general";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="p-4 container my-10 md:my-16 lg:my-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="relative w-fit">
            <h2 className="text-6xl md:text-8xl font-instrument-serif">{user.name}</h2>
            <span
              className={cn(
                "hidden md:flex items-center gap-1.5 absolute -right-16 top-[50%] -translate-y-[50%] rotate-90 text-xs whitespace-nowrap",
                !user.openForWork && "line-through"
              )}
            >
              {user.openForWork && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              open for work
            </span>
            <div className="md:hidden flex items-baseline justify-between w-full mt-2">
              <p className="text-xl font-normal">
                {user.hero.subtitle}
              </p>
              <span
                className={cn(
                  "text-xs",
                  user.openForWork && "bg-emerald-300 dark:bg-emerald-500/50 px-1.5",
                  !user.openForWork && "line-through"
                )}
              >
                (open for work)
              </span>
            </div>
          </div>
          <p className="hidden md:block text-xl md:text-4xl font-bodoni font-extralight tracking-tighter">
            {user.hero.subtitle}
          </p>
        </div>

        <div className="pr-5 md:pr-0 md:max-w-3/5">
          <p className="text-lg md:text-xl font-light leading-relaxed">
            {user.hero.userExcerpt}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/#projects"
            className="group flex items-center gap-2 text-lg hover:underline"
          >
            <span>view projects</span>
            <ArrowUp
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
