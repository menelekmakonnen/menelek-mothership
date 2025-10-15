import Link from "next/link";
import React from "react";
import { Instagram, Linkedin, Mail, Youtube } from "lucide-react";

const MENU = [
  { key: "home", label: "Home", href: "/" },
  { key: "bio", label: "Biography", href: "/#biography" },
  { key: "ai", label: "AI", href: "https://icuni.co.uk", external: true },
  { key: "loremaker", label: "Loremaker", href: "/loremaker" },
  { key: "blog", label: "Blog", href: "/#blog" },
];

const SOCIALS = {
  instagram: "https://instagram.com/menelek.makonnen",
  youtube: "https://youtube.com/@director_menelek",
  linkedin: "https://linkedin.com/in/menelekmakonnen",
  email: "mailto:admin@menelekmakonnen.com",
};

function LogoMark() {
  return (
    <div className="relative h-8 w-8 grid place-items-center">
      <svg viewBox="0 0 64 64" className="h-8 w-8">
        <defs>
          <linearGradient id="loremark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopOpacity="0.85" stopColor="#ffffff" />
            <stop offset="100%" stopOpacity="0.15" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <rect
          x="8"
          y="8"
          width="48"
          height="48"
          rx="8"
          transform="rotate(45 32 32)"
          fill="url(#loremark)"
          opacity="0.12"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontSize="20"
          fill="#ffffff"
          opacity="0.9"
          style={{ fontWeight: 800, letterSpacing: 1 }}
        >
          MM
        </text>
      </svg>
    </div>
  );
}

export default function LoreLayout({ children, active = "loremaker" }) {
  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(114,137,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,204,128,0.12)_0%,rgba(111,73,255,0.1)_50%,rgba(6,17,31,0.8)_100%)]" />
        <div className="absolute inset-0 mix-blend-soft-light opacity-40 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_12px)]" />
      </div>

      <header className="sticky top-0 z-30 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-semibold tracking-tight">Menelek Makonnen</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-white/80">
            {MENU.map((item) => {
              const className = `hover:text-white transition ${active === item.key ? "text-white" : ""}`;
              if (item.external) {
                return (
                  <a key={item.key} href={item.href} className={className} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                );
              }
              return (
                <Link key={item.key} href={item.href} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden sm:flex items-center gap-3 text-sm text-white/80">
            <a href={SOCIALS.email} className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a href={SOCIALS.instagram} className="inline-flex items-center gap-2 hover:text-white" target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" />
              IG
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-0">{children}</main>

      <footer className="mt-16 border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold">Menelek Makonnen</div>
            <div className="text-white/70 text-sm mt-1">Filmmaker • Worldbuilder</div>
            <div className="mt-3 flex items-center gap-4 text-white/80">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2">
                <Youtube className="h-4 w-4" /> YouTube
              </a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>
          <div className="md:col-span-2 text-white/70 text-sm flex items-end justify-end">
            <span>© {new Date().getFullYear()} Loremaker • ICUNI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
