"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { utilities } from "@/data/utilities";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HomeUtilities() {
  const [hoveredUtility, setHoveredUtility] = useState<{
    github: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Link href={"/#utilities"}>
          <h2 className="text-6xl flex gap-2 items-end group">
            <span className="group-hover:underline">utilities</span>
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
            className="border-b-[0.5px] border-foreground grid grid-cols-4 p-1 text-xs"
          >
            <div>/ NAME</div>
            <div className="col-span-2">/ DESCRIPTION</div>
            <div>/ LANGUAGE</div>
          </motion.div>

          {utilities.map((utility, index) => (
            <motion.div
              key={utility.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <a
                href={utility.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b-[0.5px] border-foreground grid grid-cols-4 p-2 group hover:bg-card transition-colors duration-200 font-light cursor-pointer block"
                onMouseEnter={(e) =>
                  setHoveredUtility({
                    github: utility.github,
                    name: utility.name,
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onMouseMove={(e) =>
                  setHoveredUtility((prev) =>
                    prev
                      ? { ...prev, x: e.clientX, y: e.clientY }
                      : null
                  )
                }
                onMouseLeave={() => setHoveredUtility(null)}
              >
                <div className="text-sm">{utility.name}</div>
                <div className="col-span-2 text-sm">{utility.description}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {utility.language}
                  </span>
                  <ArrowUp
                    size={20}
                    className="group-hover:rotate-45 transition-transform duration-300 text-foreground hidden md:block"
                  />
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {hoveredUtility && (
        <img
          src={`https://opengraph.githubassets.com/1/${hoveredUtility.github.replace("https://github.com/", "")}`}
          alt={`${hoveredUtility.name} GitHub preview`}
          className="fixed w-80 rounded-lg shadow-lg border border-foreground/20 pointer-events-none"
          style={{
            left: hoveredUtility.x + 16,
            top: hoveredUtility.y + 16,
            zIndex: 9999,
          }}
        />
      )}
    </section>
  );
}
