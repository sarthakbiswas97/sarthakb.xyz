import { user } from "@/data/general";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: user.socials.github,
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: user.socials.twitter,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: user.socials.linkedin,
    },
    {
      name: "Email",
      icon: Mail,
      href: user.socials.mail,
    },
  ];

  return (
    <footer className="container p-4 border-t border-foreground/10 mt-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 py-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-2xl font-medium hover:underline">
            {user.name}
          </Link>
          <p className="text-sm text-foreground">{user.footer.subtitle}</p>
          <p className="text-xs text-foreground/50">building in public · <a href={user.socials.twitter} target="_blank" className="hover:text-foreground transition-colors duration-200">@overfitandchill</a></p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                className="text-foreground hover:text-black transition-colors duration-200"
                aria-label={link.name}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>
          <p className="text-sm text-foreground">
            © {new Date().getFullYear()} {user.name}. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
