"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/skills";

export default function HomeSkills() {
  return (
    <section className="container p-4 flex flex-col gap-10 my-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-6xl">skills</h2>
      </motion.div>

      <div className="overflow-x-auto">
        <div className="flex flex-col gap-0 min-w-[600px]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="table-border-header grid grid-cols-4 p-1 text-xs"
          >
            <div>/ CATEGORY</div>
            <div className="col-span-3">/ TOOLS</div>
          </motion.div>

          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="table-border grid grid-cols-4 px-1 py-2 font-light"
            >
              <div className="text-sm">{skill.title}</div>
              <div className="col-span-3 text-sm">
                {skill.items.join(", ")}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
