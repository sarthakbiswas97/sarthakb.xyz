"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { experiences } from "@/data/experience";

function RoleDetails({
  details,
}: {
  details: { title: string; description: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, details]);

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:underline cursor-pointer w-fit"
      >
        <span>{isOpen ? "show less" : "read more"}</span>
        <span
          className="transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ↓
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? `${height}px` : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className="flex flex-col gap-6 mt-2">
          {details.map((detail, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <h4 className="text-base font-medium">{detail.title}</h4>
              <p className="text-sm md:text-base font-light leading-relaxed text-foreground/70">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <div>
        <Link href={"/#experience"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span className="group-hover:underline">experience</span>
            <ArrowUp
              size={48}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </h2>
        </Link>
      </div>

      <div className="flex flex-col gap-12">
        {experiences
          .sort((a, b) => b.id - a.id)
          .map((exp) => (
            <div
              key={exp.company}
              className="group pb-12 last:border-0"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <a
                    href={exp.website}
                    target="_blank"
                    className="text-3xl font-semibold hover:underline"
                  >
                    {exp.company}
                  </a>
                </div>

                <div className="flex flex-col gap-8">
                  {exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="flex flex-col gap-3">
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                        <h3 className="text-2xl font-medium">
                          {role.title}
                        </h3>
                        {role.period && (
                          <span className="text-sm text-foreground">{role.period}</span>
                        )}
                        {role.type && (
                          <span className="text-sm text-foreground">
                            ({role.type})
                          </span>
                        )}
                      </div>

                      <p className="text-base md:text-lg font-light leading-relaxed">
                        {role.description}
                      </p>

                      {role.details && role.details.length > 0 && (
                        <RoleDetails details={role.details} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.stacks.map((stack) => (
                    <span
                      key={stack}
                      className="px-3 py-1 text-sm border-[0.5px] border-foreground hover:bg-card transition-colors duration-200"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
