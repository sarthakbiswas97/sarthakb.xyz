"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  contributionCount: number;
  contributionLevel: string;
  date: string;
}

const levelClass: Record<string, string> = {
  NONE: "bg-[#d0d7de] dark:bg-[#161b22]",
  FIRST_QUARTILE: "bg-[#9be9a8] dark:bg-[#0e4429]",
  SECOND_QUARTILE: "bg-[#40c463] dark:bg-[#006d32]",
  THIRD_QUARTILE: "bg-[#30a14e] dark:bg-[#26a641]",
  FOURTH_QUARTILE: "bg-[#216e39] dark:bg-[#39d353]",
};

export function GithubCalendarGrid({ weeks }: { weeks: ContributionDay[][] }) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [gridHeight, setGridHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && gridRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        gridRef.current.style.transform = "scale(1)";
        const gridWidth = gridRef.current.scrollWidth;
        const naturalHeight = gridRef.current.scrollHeight;
        const newScale = Math.min(1, containerWidth / gridWidth);
        gridRef.current.style.transform = `scale(${newScale})`;
        setScale(newScale);
        setGridHeight(naturalHeight * newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [weeks]);

  return (
    <>
      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none px-2 py-1 bg-foreground text-background text-xs whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{ height: gridHeight }}
        onMouseLeave={() => setTooltip(null)}
      >
        <div
          className="flex gap-[3px]"
          ref={gridRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    "w-[10px] h-[10px] md:w-[13px] md:h-[13px] rounded-[2px] transition-colors duration-100",
                    levelClass[day.contributionLevel] || levelClass.NONE
                  )}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      text: `${day.contributionCount} contributions on ${day.date}`,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
