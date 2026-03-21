import { siteConfig } from "@/config/siteConfig";
import { getAllPostsMeta } from "@/lib/blog";
import { projects } from "@/data/projects";
import { user } from "@/data/general";

export function GET() {
  const posts = getAllPostsMeta();

  const content = `# ${user.name}

> ${siteConfig.description}

## About

${user.hero.userExcerpt}

- Location: ${user.location}
- Role: ${user.role}
- Website: ${siteConfig.url}

## Links

- LinkedIn: ${user.socials.linkedin}
- GitHub: ${user.socials.github}
- Twitter: ${user.socials.twitter}
- Email: ${user.socials.mail}
- Calendar: ${user.socials.calcom}

## Blog Posts

${posts.map((post) => `- [${post.title}](${siteConfig.url}/blog/${post.id}): ${post.excerpt}`).join("\n")}

## Projects

${projects.map((p) => `- [${p.name}](${siteConfig.url}/projects/${p.id}): ${p.content || p.description || ""}`).join("\n")}

## Gallery

- [Photo Gallery](${siteConfig.url}/gallery)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
