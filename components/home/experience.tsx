"use client";

import { experiences } from "@/data/experience";
import { motion } from "framer-motion";

export default function Experience() {
  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-6xl">experience</h2>
      </motion.div>

      <div className="flex flex-col gap-12">
        {experiences
          .sort((a, b) => b.id - a.id)
          .map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group table-border pb-12 last:border-0"
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

                      <p className="text-lg font-light leading-relaxed">
                        {role.description}
                      </p>
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
            </motion.div>
          ))}
      </div>
    </section>
  );
}
