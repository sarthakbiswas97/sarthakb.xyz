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
            <a
              href={user.openForWork ? user.socials.calcom : "#"}
              target={user.openForWork ? "_blank" : undefined}
            >
              <p
                className={cn(
                  "hidden md:block absolute -right-16 top-[50%] bottom-[50%] rotate-90 hover:underline text-xs",
                  !user.openForWork && "line-through"
                )}
              >
                open for work
              </p>
            </a>
            <div className="md:hidden flex items-baseline justify-between w-full mt-2">
              <p className="text-xl font-normal">
                {user.hero.subtitle}
              </p>
              <a
                href={user.openForWork ? user.socials.calcom : "#"}
                target={user.openForWork ? "_blank" : undefined}
                className={cn(
                  "text-xs hover:underline",
                  !user.openForWork && "line-through"
                )}
              >
                (open for work)
              </a>
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
          <a
            href={user.socials.calcom}
            target="_blank"
            className="group flex items-center gap-2 text-lg hover:underline"
          >
            <span>book a call</span>
            <ArrowUp
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
