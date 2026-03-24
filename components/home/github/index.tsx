import { cn } from "@/lib/utils";
import { GithubCalendarGrid } from "./github-calendar-grid";

interface ContributionDay {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
}

export interface GithubContributionData {
  contributions: ContributionDay[][];
  totalContributions: number;
}

async function getContributions(username: string): Promise<GithubContributionData | null> {
  try {
    const response = await fetch(
      `https://github-contributions-api.deno.dev/${username}.json`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function GithubCalendar({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  const data = await getContributions(username);

  if (!data) return null;

  return (
    <section className={cn("container p-4 flex flex-col gap-10 my-10 overflow-hidden", className)}>
      <div>
        <h2 className="text-6xl">github</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            @{username}
          </a>
          <span className="text-sm text-foreground/50">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </span>
        </div>

        <GithubCalendarGrid weeks={data.contributions} />
      </div>
    </section>
  );
}
