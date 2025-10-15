import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Youtube,
  Instagram,
  Linkedin,
  ShieldCheck,
  Sparkles,
  X,
  Shuffle,
  Calendar as CalendarIcon,
  Info,
  ArrowUp,
  MessageSquare,
  Minimize2,
  Maximize2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Mothership V13.2 — Luxe overhaul + bugfix
 * - FIX: Unterminated string in CharacterCard <img className> + prior truncation.
 * - FIX: Restored missing components (ChatbotWidget, AppShell) and ensured WorkWithMe exists.
 * - Theme: richer glass, deeper gradients, neon accents.
 * - Back‑to‑top: always visible.
 * - Chatbot: compact dock + unread badge + minimize.
 * - Hero: animated showcase slider (reel, photo, epic edit, universe art).
 * - Portfolio: stronger fill + harder hover zoom.
 * - Schedule: days mode for ≤2 weeks; weeks >2. Distribution phase removed.
 * - Featured Universe: robust CSV + Drive image normalization.
 * - MMM Galleries: Google Photos album embeds with modal lightbox.
 * - Self‑tests: added assertions for helpers and component presence.
 */

// ========= FACTUAL LINKS ========= //
const SOCIALS = {
  instagram: "https://instagram.com/menelek.makonnen",
  youtube: "https://youtube.com/@director_menelek",
  linkedin: "https://linkedin.com/in/menelekmakonnen",
  email: "mailto:admin@menelekmakonnen.com",
};

const LINKS = {
  personalYouTube: "https://www.youtube.com/@menelekmakonnen",
  directorYouTube: "https://www.youtube.com/@director_menelek",
  personalIG: "https://www.instagram.com/menelek.makonnen/",
  loremakerIG: "https://www.instagram.com/lore.maker_",
  icuniIG: "https://www.instagram.com/icuni_",
  mmmIG: "https://www.instagram.com/mm.m.media/",
  aiIG: "https://www.instagram.com/mr.mikaelgabriel/",
  personalLI: "https://www.linkedin.com/in/menelekmakonnen/",
  businessLI: "https://www.linkedin.com/in/mikaelgabriel/",
  loremakerSite: "https://menelekmakonnen.com/loremaker",
  icuniSite: "https://icuni.co.uk",
  oldBlog: "https://wordpress.com/mikaelgabriel",
};

const CHATBOT_BASE_URL = "https://mmmai.app.n8n.cloud";
const CHATBOT_ENDPOINTS = {
  trackVisit: ["/webhook/track-visit", "/webhook-test/track-visit"],
  chatbot: ["/webhook/chatbot", "/webhook-test/chatbot"],
  contact: ["/webhook/contact", "/webhook-test/contact"],
  workflow: "/workflow/cQltZgIikkp4fFER",
};
const CHATBOT_NAME = "Zara";
const CHATBOT_TAGLINE = "Menelek's AI Assistant";

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const ensureArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
};

async function postJSONWithFallback(paths, payload, { headers = {}, signal } = {}) {
  const attempts = ensureArray(paths);
  let lastError = null;
  for (const path of attempts) {
    try {
      const res = await fetch(`${CHATBOT_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(payload),
        mode: "cors",
        signal,
      });
      if (!res.ok) {
        lastError = new Error(`Request failed with status ${res.status}`);
        continue;
      }
      return res;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  throw new Error("No endpoints available");
}
const shuffleArray = (arr) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const createSeededRandom = (seed = 1) => {
  let s = Math.floor(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const shuffleWithSeed = (arr, seed = 1) => {
  if (!Number.isFinite(seed)) return shuffleArray(arr);
  const random = createSeededRandom(seed);
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

function Button({ as: Cmp = "button", children, icon: Icon, href, onClick, className = "", target, rel, variant = "default", title, ...rest }) {
  const palettes = {
    default: "bg-white/10 hover:bg-white/15",
    ghost: "bg-white/5 hover:bg-white/10",
    accent: "bg-gradient-to-tr from-cyan-300/20 via-fuchsia-400/20 to-amber-300/20 hover:from-cyan-300/30 hover:to-amber-300/30",
  };
  const base = cn(
    "px-4 py-2.5 rounded-2xl border border-white/15 text-white",
    "shadow-[0_12px_40px_rgba(0,0,0,0.35)] active:translate-y-px backdrop-blur-xl transition-all",
    palettes[variant],
    className
  );
  const inner = (
    <span className="inline-flex items-center gap-2">
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </span>
  );
  if (href)
    return (
      <a href={href} onClick={onClick} className={base} target={target} rel={rel} title={title} {...rest}>
        {inner}
      </a>
    );
  const props = { onClick, className: base, title, target, rel, ...rest };
  if (Cmp === "button" && props.type === undefined) props.type = "button";
  return <Cmp {...props}>{inner}</Cmp>;
}

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(111,66,193,0.18),transparent_60%),radial-gradient(1200px_600px_at_110%_120%,rgba(0,180,255,0.15),transparent_60%)]",
        "backdrop-blur-xl p-5 shadow-[0_15px_70px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_80px_rgba(0,0,0,0.55)] transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            className={cn(
              "relative z-10 mx-auto mt-[6vh] w-[92vw] max-w-5xl",
              "rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 text-white"
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {title}
              </h3>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ========= BACKGROUND ========= //
function DiamondsCanvas({ className }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const scale = () => {
      const dpr = devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const onResize = scale;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => (mouseRef.current = { x: -9999, y: -9999 });
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: 0 });
    };

    scale();
    console.debug("DiamondsCanvas mounted", {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      dpr: typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1,
    });

    const cell = 9;
    const rot = Math.PI / 4;
    const baseAlpha = 0.08;
    const auraR = 90;
    const size = 3.5;
    const defaultGlow = 0.12;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#050611");
      g.addColorStop(1, "#0b0f1a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ripplesRef.current = ripplesRef.current.map((r) => ({ ...r, t: r.t + 1 })).filter((r) => r.t < 260);

      const { x: mx, y: my } = mouseRef.current;

      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell / 2;
          const cy = y + cell / 2;

          const dxh = cx - mx;
          const dyh = cy - my;
          const hoverK = Math.max(0, 1 - Math.hypot(dxh, dyh) / auraR);

          let clickGlow = 0;
          for (const r of ripplesRef.current) {
            const k = r.t / 260;
            const R = 12 + k * 320;
            const thick = 14;
            const d = Math.hypot(cx - r.x, cy - r.y);
            const ring = Math.max(0, 1 - Math.abs(d - R) / thick);
            clickGlow = Math.max(clickGlow, ring * (1 - k));
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);

          const a = Math.min(0.7, defaultGlow + hoverK * 0.5 + clickGlow * 0.85);
          if (a > 0) {
            const grad = ctx.createRadialGradient(0, 0, 0.2, 0, 0, 10);
            grad.addColorStop(0, `rgba(255,255,255,${a})`);
            grad.addColorStop(1, `rgba(255,255,255,0)`);
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = grad;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.globalCompositeOperation = "source-over";
          }

          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10 h-full w-full", className)} style={{ pointerEvents: "auto" }} />;
}

// ========= DATA ========= //
const SERVICES = [
  { id: "feature", name: "Feature Film" },
  { id: "short", name: "Short Film" },
  { id: "ai-film", name: "AI Film" },
  { id: "music-video", name: "Music Video" },
  { id: "doc", name: "Documentary" },
  { id: "bts", name: "BTS" },
  { id: "ai-ad", name: "AI Advert" },
];
const SERVICES_BY_ID = Object.fromEntries(SERVICES.map((s) => [s.id, s.name]));

const PROJECTS = [
  {
    id: "im-alright",
    title: "I'm Alright (2024)",
    role: "Writer–Director",
    runtime: "8 min",
    summary: "Addiction & depression inside a lockdown flat.",
    url: "https://www.youtube.com/watch?v=A8cGpNe2JAE&pp=ygUTbWVuZWxlayBJJ20gYWxyaWdodA%3D%3D",
    thumbZoom: { base: 1.36, hover: 1.58 },
  },
  {
    id: "blinded-by-magic",
    title: "Blinded by Magic (2022)",
    role: "Writer–Director",
    runtime: "12 min",
    summary: "A possessed camera blinds its user while granting powers.",
    url: "https://www.youtube.com/watch?v=ivsCBuD1JYQ&pp=ygUYbWVuZWxlayBibGluZGVkIGJ5IG1hZ2lj",
    thumbZoom: { base: 1.38, hover: 1.6 },
  },
  {
    id: "heroes-gods",
    title: "Heroes & Gods (2024)",
    role: "Writer–Director, Editor",
    runtime: "120 min",
    summary: "Anthology stitched into a feature — heroes vs vengeful goddess & twin.",
    url: "https://www.youtube.com/watch?v=jtiOv0OvD-0&pp=ygUXbWVuZWxlayBoZXJvZXMgYW5kIGdvZHM%3D",
    thumbZoom: { base: 1.34, hover: 1.56 },
  },
  {
    id: "spar-bts",
    title: "SPAR (Doc, 2024)",
    role: "Director, Cinematographer, Editor",
    runtime: "14 min",
    summary: "BTS doc for a boxing pilot in London — Left Hook Gym.",
    url: "https://www.youtube.com/watch?v=4q6X6prhVOE",
    thumbZoom: { base: 1.4, hover: 1.62 },
  },
  {
    id: "soldier-mv",
    title: "Soldier (Music Video)",
    role: "Director, Editor",
    runtime: "3 min",
    summary: "Concept-to-delivery music video including cover art.",
    url: "https://www.youtube.com/watch?v=BHPaJieCAXY&pp=ygUMd29udSBzb2xkaWVy0gcJCfsJAYcqIYzv",
    thumbZoom: { base: 1.42, hover: 1.64 },
  },
  {
    id: "abranteers",
    title: "Abranteers (Proof, 2023)",
    role: "Writer–Director",
    runtime: "9 min",
    summary: "Anti-magic veteran + rookie vs a dangerous magic user.",
    url: "https://www.youtube.com/shorts/CPPkq5zsXgE",
  },
];

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1].split("/")[0];
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1];
    }
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
  } catch (e) {}
  return null;
}

function youtubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

// ========= HERO ========= //
const HERO_SLIDES = PROJECTS.slice(0, 4).map((project) => ({
  id: project.id,
  kind: "video",
  title: project.title,
  caption: project.summary,
  videoUrl: project.url,
  preview: youtubeThumb(project.url),
  credit: project.role,
}));

function Hero({ onOpenLinksModal }) {
  const [idx, setIdx] = useState(0);
  const slides = HERO_SLIDES;
  const slidesLength = slides.length || 1;
  const awaitingSlides = slidesLength === 0;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slidesLength), 5000);
    return () => clearInterval(t);
  }, [slidesLength]);

  useEffect(() => {
    if (idx >= slidesLength) setIdx(0);
  }, [idx, slidesLength]);

  const goPrev = () => setIdx((i) => (i - 1 + slidesLength) % slidesLength);
  const goNext = () => setIdx((i) => (i + 1) % slidesLength);

  const baseSlide = HERO_SLIDES[0];
  const slide = slides[idx] || slides[0];
  const activeSlide = slide || {
    id: baseSlide.id,
    title: baseSlide.title,
    preview: baseSlide.preview,
    videoUrl: baseSlide.videoUrl,
    caption: baseSlide.caption,
    credit: baseSlide.credit,
  };
  const openVideo = () => {
    if (!activeSlide?.videoUrl || activeSlide.kind === "loading") return;
    window.open(activeSlide.videoUrl, "_blank", "noopener,noreferrer");
  };
  const imageSrc = activeSlide?.preview || activeSlide?.thumb || activeSlide?.src || "";
  const ctaLabel = activeSlide?.videoUrl
    ? activeSlide.videoUrl.includes("instagram.com")
      ? "View on Instagram"
      : activeSlide.videoUrl.includes("youtube.com") || activeSlide.videoUrl.includes("youtu.be")
        ? "Watch on YouTube"
        : "Open video"
    : "";
  return (
    <section className="relative pt-24 pb-10" id="hero">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            className="text-5xl sm:text-7xl font-extrabold leading-[1.05] select-none"
            animate={{ textShadow: ["0 0 0 rgba(255,255,255,0)", "0 0 22px rgba(255,255,255,0.35)", "0 0 0 rgba(255,255,255,0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.98), rgba(255,255,255,0.5), rgba(255,255,255,0.98))",
              backgroundSize: "200% 100%",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Menelek Makonnen
          </motion.h1>
          <div className="mt-2 text-xl text-white/85 select-none">Worldbuilder. Filmmaker. Storyteller.</div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={LINKS.loremakerSite} icon={ExternalLink}>Explore the Loremaker Universe</Button>
            <Button href={LINKS.icuniSite} icon={ExternalLink} variant="ghost">Hire Me via ICUNI</Button>
            <Button onClick={onOpenLinksModal} variant="ghost">All Links</Button>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <div className="text-sm uppercase tracking-[0.25em] text-white/60 flex items-center justify-between">
            <span>Showcase</span>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{awaitingSlides ? "Loading…" : `${idx + 1}/${slidesLength}`}</span>
              {slidesLength > 1 ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={goPrev}
                    className="rounded-full bg-black/30 border border-white/20 p-1.5 text-white hover:bg-black/50"
                    aria-label="Previous showcase"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="rounded-full bg-black/30 border border-white/20 p-1.5 text-white hover:bg-black/50"
                    aria-label="Next showcase"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
            <div className="mt-3 aspect-video w-full rounded-2xl overflow-hidden border border-white/10 relative group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                {activeSlide.kind === "loading" ? (
                  <div className="w-full h-full grid place-items-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white/70 text-sm">
                    Loading showcase…
                  </div>
                ) : imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover object-center scale-[1.12] group-hover:scale-[1.18] transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white/70">
                    {activeSlide.title}
                  </div>
                )}
                {activeSlide.videoUrl && activeSlide.kind !== "loading" ? (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                    <button
                      onClick={openVideo}
                      className="rounded-full bg-white/15 border border-white/40 backdrop-blur px-5 py-3 inline-flex items-center gap-2 text-sm font-semibold text-white hover:bg-white/20"
                    >
                      <Play className="h-4 w-4" /> {ctaLabel || "Play"}
                    </button>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
          {slide.caption ? (
            <motion.p
              key={`${activeSlide.id}-caption`}
              className="mt-4 text-sm text-white/75"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {activeSlide.caption}
            </motion.p>
          ) : null}
          {activeSlide.credit ? (
            <div className="mt-2 text-xs text-white/60">{activeSlide.credit}</div>
          ) : null}
        </Card>
      </div>
    </section>
  );
}

// ========= Work with Me ========= //
function WorkWithMe({ currentService, onSetService, onBook, onCalendarChange }) {
  const [randomKey, setRandomKey] = useState(0);
  return (
    <section className="py-12" id="value-calculator">
      <div className="max-w-7xl mx-auto px-6">
        <Card>
          <div className="flex items-end justify-between mb-1">
            <h2 className="text-2xl sm:text-3xl font-bold">Director for Hire • Client Value Calculator</h2>
          </div>
          <p className="text-white/80">
            Scope your idea in minutes. I’ll show you fit, budget bands, and a realistic timeline. No fluff—just the plan.
          </p>

          {/* Service chips + Randomizer */}
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => onSetService(s.name)}
                className={cn(
                  "px-3 py-1.5 rounded-full border",
                  currentService === s.name ? "bg-white/20 border-white/30" : "border-white/15 hover:bg-white/10"
                )}
              >
                <span className="inline-flex items-center gap-2">{s.name}
                  {(s.id === "music-video" || s.id === "ai-ad") && (
                    <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/10">from £200*</span>
                  )}
                </span>
              </button>
            ))}
            <button
              onClick={() => setRandomKey((k) => k + 1)}
              className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"
              title="Suggest a high‑fit configuration"
            >
              <Shuffle className="h-4 w-4" /> Randomize (High‑Fit)
            </button>
          </div>
          <div className="text-white/60 text-xs mt-3 inline-flex items-center gap-2">
            <Info className="h-4 w-4" /> <span>* Only for Music Video & AI Advert when <em>you provide all</em> assets & logistics.</span>
          </div>

          {/* Inline CVC */}
          <div className="mt-6">
            <ValueCalculator
              service={currentService}
              onBook={onBook}
              onCalendarChange={onCalendarChange}
              randomizeKey={randomKey}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}

// ========= Contact ========= //
function ContactInline({ calendarState }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subtype: "",
    otherDetail: "",
    message: "",
    fitScore: "",
    recTier: "Starter",
    scope: "",
  });
  useEffect(() => {
    const handlerSubtype = (e) => { if (e.detail && e.detail.subtype !== undefined) setForm((f) => ({ ...f, subtype: e.detail.subtype })); };
    const handlerFit = (e) => {
      if (!e.detail) return;
      const { service, fit, budget, timeline } = e.detail;
      setForm((f) => ({ ...f, subtype: service || f.subtype, fitScore: `${fit}%`, scope: `~£${budget.toLocaleString()} • ${timeline}w` }));
    };
    window.addEventListener("prefill-subtype", handlerSubtype);
    window.addEventListener("prefill-fit", handlerFit);
    return () => { window.removeEventListener("prefill-subtype", handlerSubtype); window.removeEventListener("prefill-fit", handlerFit); };
  }, []);

  const [agree, setAgree] = useState(false);
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (submitting) return;
    setError(null);
    if (!agree) return setError("Please agree to the Privacy Policy before sending.");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    if (!form.subtype?.trim()) return setError("Pick the service that best fits your project.");
    if (!form.message.trim()) return setError("Tell me a little about the project scope.");

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        otherDetail: form.subtype === "Other" ? form.otherDetail : "",
        recTier: form.subtype === "Other" ? "" : form.recTier || "Starter",
        service: "Director for Hire",
        calendar: calendarState,
        sendCopy: true,
        submittedAt: new Date().toISOString(),
      };
      await postJSONWithFallback(CHATBOT_ENDPOINTS.contact, payload);
      setOk(true);
    } catch (err) {
      console.error("Contact submission failed", err);
      setError("Couldn't send just now—try again in a moment or email hello@menelekmakonnen.com.");
    } finally {
      setSubmitting(false);
    }
  };

  const clear = () =>
    setForm({
      name: "",
      email: "",
      phone: "",
      subtype: "",
      otherDetail: "",
      message: "",
      fitScore: "",
      recTier: "Starter",
      scope: "",
    });

  const choose = (s) =>
    setForm((f) => ({
      ...f,
      subtype: s,
      otherDetail: s === "Other" ? f.otherDetail : "",
      fitScore: s === "Other" ? "" : f.fitScore,
      recTier: s === "Other" ? "" : f.recTier || "Starter",
      scope: s === "Other" ? "" : f.scope,
    }));
  const options = [...SERVICES.map((s) => s.name), "Other"];
  const showFitFields = form.subtype && form.subtype !== "Other";

  return (
    <Card id="contact-inline">
      <h3 className="text-xl font-semibold">Contact</h3>
      <div className="text-white/70 text-sm">Email: <a href={SOCIALS.email} className="underline">hello@menelekmakonnen.com</a></div>
      <p className="text-white/70 text-sm mt-1">Prefer speed? Tap the chat bubble at bottom‑right and leave a short brief.</p>
      {!ok ? (
        <div className="grid gap-3 mt-4">
          {error ? <div className="text-sm text-rose-300">{error}</div> : null}
          <div>
            <label className="text-white/70 text-sm mb-2 block">Select a service</label>
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <button key={o} onClick={() => choose(o)} className={cn("px-3 py-1.5 rounded-full border", form.subtype === o ? "bg-white/20 border-white/30" : "border-white/15 hover:bg-white/10")}>{o}</button>
              ))}
            </div>
          </div>

          {form.subtype === "Other" ? (
            <div>
              <label className="text-white/70 text-sm mb-1 block">Other service</label>
              <input value={form.otherDetail} onChange={(e) => setForm({ ...form, otherDetail: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
          ) : null}

          {showFitFields ? (
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Fit Score %</label>
                <input
                  value={form.fitScore}
                  onChange={(e) => setForm({ ...form, fitScore: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Recommended Package</label>
                <select
                  value={form.recTier || "Starter"}
                  onChange={(e) => setForm({ ...form, recTier: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full text-white"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  {["Starter", "Signature", "Cinema+"].map((x) => (
                    <option key={x} className="text-black">{x}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Budget • Timeline</label>
                <input
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
                />
              </div>
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Service subtype (auto‑filled)</label>
              <input value={form.subtype} onChange={(e) => setForm({ ...form, subtype: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">Project brief / goals</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
          </div>

          <label className="flex items-center gap-2 text-white/70">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the {" "}
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Privacy policy modal placeholder."); }} className="underline">Privacy Policy</a>.
          </label>
          <div className="flex gap-2">
            <Button onClick={submit} icon={ShieldCheck} disabled={submitting}>
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </span>
              ) : (
                "Send Inquiry"
              )}
            </Button>
            <Button href={SOCIALS.email} icon={Mail} variant="ghost">Email Instead</Button>
            <Button onClick={clear} variant="ghost" disabled={submitting}>Clear Form</Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6"><CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" /><div className="mt-2">Thanks — I’ll reply within 24–48h.</div></div>
      )}
    </Card>
  );
}

// ========= Calculator (CVC) with days/weeks modes & no Distribution ========= //
function ValueCalculator({ service: serviceProp, onBook, onCalendarChange, randomizeKey }) {
  const [service, setService] = useState(serviceProp || SERVICES[0].name);
  useEffect(() => { if (serviceProp) setService(serviceProp); }, [serviceProp]);
  const [budget, setBudget] = useState(5000);
  const [ambition, setAmbition] = useState(7);
  const [projectDate, setProjectDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [total, setTotal] = useState(6); // weeks
  const [showTimeline, setShowTimeline] = useState(false);

  const RULES = {
    "Feature Film": { base: 40000, budgetRange: [15000, 250000], ambitionIdeal: [7, 10], durationIdeal: 16, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "Short Film": { base: 8000, budgetRange: [1500, 30000], ambitionIdeal: [6, 10], durationIdeal: 6, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "AI Film": { base: 5000, budgetRange: [1000, 20000], ambitionIdeal: [6, 10], durationIdeal: 4, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "Music Video": { base: 3500, budgetRange: [200, 20000], ambitionIdeal: [7, 10], durationIdeal: 3, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "Documentary": { base: 4000, budgetRange: [1500, 40000], ambitionIdeal: [5, 9], durationIdeal: 8, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "BTS": { base: 900, budgetRange: [300, 5000], ambitionIdeal: [3, 7], durationIdeal: 2, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
    "AI Advert": { base: 3000, budgetRange: [200, 20000], ambitionIdeal: [6, 10], durationIdeal: 2, weights: { budget: 0.35, ambition: 0.35, duration: 0.3 } },
  };
  const cfg = RULES[service] || RULES["Short Film"];
  const norm = (x, [min, max]) => clamp((x - min) / Math.max(1, max - min), 0, 1);
  const durationScoreFor = (svc, tot) => {
    const ideal = RULES[svc].durationIdeal;
    return norm(1 - Math.abs(tot - ideal) / ideal, [0, 1]);
  };
  const scoreFor = (svc, bgt, amb, tot) => {
    const r = RULES[svc];
    const budgetScore = norm(bgt, r.budgetRange);
    const ambitionScore = norm(amb, r.ambitionIdeal);
    const durationScore = durationScoreFor(svc, tot);
    const raw = r.weights.budget * budgetScore + r.weights.ambition * ambitionScore + r.weights.duration * durationScore;
    return Math.round(clamp(raw, 0, 1) * 100);
  };

  const score = scoreFor(service, budget, ambition, total);
  const barColor = `hsl(${Math.round((score / 100) * 120)}, 85%, 55%)`;
  const coverage = budget / cfg.base;
  const suggestedTier = coverage < 0.85 ? "Starter" : coverage < 1.3 ? "Signature" : "Cinema+";
  const descriptor = score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : score >= 40 ? "Borderline" : "Not ideal";

  // No distribution phase. Split across: Development / Pre‑Production / Production / Post‑Production
  const SPLIT = [0.22, 0.33, 0.22, 0.23];
  const KEYS = ["development", "pre", "production", "post"];
  const LABELS = ["Development", "Pre‑Production", "Production", "Post‑Production"];

  const makeFSForTotal = (tWeeks) => {
    if (tWeeks <= 2) {
      const totalDays = Math.max(1, Math.round(tWeeks * 7));
      const minDay = totalDays >= KEYS.length ? 1 : 0;
      const allocations = SPLIT.map((r) => Math.max(minDay, Math.round(totalDays * r)));
      let diff = totalDays - allocations.reduce((a, b) => a + b, 0);
      let guard = 0;
      while (diff !== 0 && guard < 400) {
        const index = guard % allocations.length;
        if (diff > 0) {
          allocations[index] += 1;
          diff -= 1;
        } else if (allocations[index] > minDay) {
          allocations[index] -= 1;
          diff += 1;
        }
        guard += 1;
        if (allocations.every((a) => a === minDay)) break;
      }
      const out = [];
      let sd = 0;
      for (let i = 0; i < allocations.length; i++) {
        const days = Math.max(0, allocations[i]);
        out.push({
          key: KEYS[i],
          label: LABELS[i],
          startDays: sd,
          weeks: days / 7,
          minWeeks: days > 0 ? 1 / 7 : 0,
        });
        sd += days;
      }
      return out;
    }
    const parts = SPLIT.map((r) => Math.max(0.5, Math.round(tWeeks * r * 2) / 2));
    const out = [];
    let sd = 0;
    for (let i = 0; i < parts.length; i++) {
      out.push({ key: KEYS[i], label: LABELS[i], startDays: sd, weeks: parts[i], minWeeks: 0.5 });
      sd += Math.ceil(parts[i] * 7);
    }
    return out;
  };

  const [phases, setPhases] = useState(() => makeFSForTotal(6));

  useEffect(() => {
    setPhases((prev) => {
      if (total <= 2) return makeFSForTotal(total);
      const maxDays = total * 7;
      const minWeeksClamp = 0.5;
      return prev.map((p) => {
        const weeks = Math.max(minWeeksClamp, Math.min(26, p.weeks));
        const allowedStart = Math.max(0, maxDays - Math.ceil(weeks * 7));
        const startDays = Math.min(Math.max(0, p.startDays), allowedStart);
        return { ...p, weeks, startDays };
      });
    });
  }, [total]);

  useEffect(() => {
    onCalendarChange?.(buildCalendarStateOverlapping(phases, projectDate));
    window.dispatchEvent(new CustomEvent("prefill-fit", { detail: { service, fit: score, suggestedTier, budget, timeline: total } }));
    window.dispatchEvent(new CustomEvent("prefill-subtype", { detail: { subtype: service } }));
  }, [phases, projectDate, service, score, suggestedTier, budget, total]);

  useEffect(() => {
    if (randomizeKey === undefined) return;
    let best = { s: service, b: budget, a: ambition, t: total, score: -1 };
    for (let i = 0; i < 60; i++) {
      const svc = SERVICES[Math.floor(Math.random() * SERVICES.length)].name;
      const rcfg = RULES[svc];
      const bgt = Math.round((Math.random() * (rcfg.budgetRange[1] - rcfg.budgetRange[0]) + rcfg.budgetRange[0]) / 50) * 50;
      const amb = Math.floor(Math.random() * 5) + 6;
      const tot = Math.floor(Math.random() * 26) + 1;
      const sc = scoreFor(svc, bgt, amb, tot);
      if (sc > best.score) best = { s: svc, b: bgt, a: amb, t: tot, score: sc };
      if (sc >= 80) { best = { s: svc, b: bgt, a: amb, t: tot, score: sc }; break; }
    }
    setService(best.s);
    setBudget(best.b);
    setAmbition(best.a);
    setTotal(best.t);
    setPhases(makeFSForTotal(best.t));
  }, [randomizeKey]);

  const totalSpanDays = phases.reduce((acc, p) => {
    const durationDays = p.weeks <= 0 ? 0 : Math.max(1, Math.round(p.weeks * 7));
    return Math.max(acc, p.startDays + durationDays);
  }, 0);
  const totalLabel = totalSpanDays <= 14
    ? `${Math.max(1, totalSpanDays)} days`
    : `${(totalSpanDays / 7).toFixed(1)} weeks`;

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <div className="text-white/70 text-sm mb-1">Selected Service</div>
          <div className="px-3 py-2 rounded-xl border border-white/20 bg-white/10">{service}</div>
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
            <span>Budget (£{budget.toLocaleString()})</span>
            <Info className="h-3.5 w-3.5 text-white/50" title="Indicative spend for the scope you have in mind." />
          </div>
          <input aria-label="Budget" type="range" min={200} max={20000} step={50} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
            <span>Ambition ({ambition})</span>
            <Info className="h-3.5 w-3.5 text-white/50" title="How cinematic or complex the execution should feel." />
          </div>
          <input aria-label="Ambition" type="range" min={1} max={10} value={ambition} onChange={(e) => setAmbition(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-1">
            <span>Proposed Project Start</span>
            <Info className="h-3.5 w-3.5 text-white/50" title="When you'd like development to kick off." />
          </div>
          <input aria-label="Project start" type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10" />
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-white/70 text-sm"><span>Fit Score</span><span>{descriptor}</span></div>
        <div className="rounded-3xl p-3 bg-gradient-to-br from-white/12 to-white/6 border border-white/15">
          <svg viewBox="0 0 110 10" className="w-full block" aria-label={`Fit score ${score}%`}>
            <rect x="0" y="0" width="110" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
            <rect x="0" y="0" width={score} height="10" rx="5" fill={barColor} />
          </svg>
          <div className="text-white/80 text-sm mt-3">Recommended: <span className="font-semibold">{suggestedTier}</span> • Total Timeline: {totalLabel}</div>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowTimeline((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-sm"
        >
          {showTimeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showTimeline ? "Hide schedule" : "Customize schedule"}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {showTimeline ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <TimelineGrid phases={phases} onChange={setPhases} total={total} onTotalChange={setTotal} startDate={projectDate} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="mt-4 flex gap-2"><Button onClick={() => onBook?.(service)} icon={Phone} variant="ghost">Book this Scope</Button></div>
    </div>
  );
}

// ========= Calendar helpers ========= //
function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildCalendarStateOverlapping(phases, startDate) {
  return {
    start: startDate,
    phases: phases.map((p) => ({
      key: p.key,
      label: p.label,
      start: addDays(startDate, p.startDays),
      end: addDays(startDate, p.startDays + Math.ceil(p.weeks * 7)),
      weeks: p.weeks,
      startDays: p.startDays,
    })),
    end: phases.length ? addDays(startDate, Math.max(...phases.map((p) => p.startDays + Math.ceil(p.weeks * 7)))) : startDate,
  };
}

// ========= Timeline Grid ========= //
function TimelineGrid({ phases, onChange, total, onTotalChange, startDate }) {
  const containerRef = useRef(null);
  const totalDays = Math.max(7, total * 7);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
  const dragRef = useRef(null);
  const pct = (days) => `${(days / totalDays) * 100}%`;
  const defaultMin = total <= 2 ? 1 / 7 : 0.5;
  const snapWeeks = (value) => {
    if (total <= 2) {
      return Math.max(0, Math.round(value * 7) / 7);
    }
    return Math.max(0, Math.round(value * 2) / 2);
  };
  const clampPhase = (p) => {
    const minForPhase = p.minWeeks ?? defaultMin;
    const snapped = snapWeeks(p.weeks);
    const weeks = clamp(snapped, minForPhase, 26);
    const durationDays = weeks <= 0 ? 0 : Math.max(1, Math.round(weeks * 7));
    const maxStart = Math.max(0, totalDays - durationDays);
    return {
      ...p,
      startDays: clamp(Math.round(p.startDays), 0, maxStart),
      weeks,
    };
  };
  const onPointerDown = (e, idx, mode) => {
    const rect = containerRef.current.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { idx, mode, startX: e.clientX, rectW: rect.width, startStart: phases[idx].startDays, startWeeks: phases[idx].weeks };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current; if (!d) return;
    const dx = e.clientX - d.startX;
    const deltaDays = Math.round((dx / d.rectW) * totalDays);
    const next = phases.map((p) => ({ ...p }));
    if (d.mode === "move") next[d.idx].startDays = d.startStart + deltaDays;
    if (d.mode === "left") {
      const newStart = d.startStart + deltaDays;
      const newWeeks = d.startWeeks - deltaDays / 7;
      next[d.idx].startDays = newStart;
      next[d.idx].weeks = newWeeks;
    }
    if (d.mode === "right") {
      const newWeeks = d.startWeeks + deltaDays / 7;
      next[d.idx].weeks = newWeeks;
    }
    onChange(next.map(clampPhase));
  };
  const onPointerUp = () => { dragRef.current = null; };
  const cal = buildCalendarStateOverlapping(phases, startDate);
  const showDays = total <= 2;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-white/80 text-sm mb-2">
        <div className="inline-flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Interactive Schedule</div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">Total duration</span>
          <input
            aria-label="Total duration"
            type="range"
            min={1}
            max={26}
            step={1}
            value={total}
            onChange={(e) => onTotalChange(parseInt(e.target.value, 10))}
          />
          <span className="text-white/70 text-xs">{showDays ? `${totalDays} d` : `${total} wks`}</span>
        </div>
      </div>
      <div className="text-[12px] text-white/60 mb-1 flex justify-between"><span>Start: {cal.start}</span><span>End: {cal.end}</span></div>
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        <div className="mb-2 flex items-center gap-3">
          <div className="w-44 shrink-0" />
          <div ref={containerRef} className="relative h-6 flex-1 select-none">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]" style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }} />
            {showDays ? (
              [...Array(total).keys()].map((w) => (
                <div key={w} className="absolute top-0 text-center" style={{ left: pct(w * 7), width: pct(7) }}>
                  {dayLabels.map((d, i) => (
                    <span key={i} className="inline-block w-[calc(100%/7)]">{d}</span>
                  ))}
                </div>
              ))
            ) : (
              [...Array(total).keys()].map((w) => (
                <div key={w} className="absolute top-0 text-center font-semibold text-white/80" style={{ left: pct(w * 7), width: pct(7) }}>
                  W{w + 1}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="space-y-3" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          {phases.map((p, idx) => {
            const visibleDays = p.weeks <= 0 ? 0 : Math.max(1, Math.round(p.weeks * 7));
            const widthDays = p.weeks <= 0 ? 0.75 : visibleDays;
            return (
              <div key={p.key} className="flex items-center gap-3">
                <div className="w-44 shrink-0 text-[13px] text-white/80">{p.label}</div>
                <div className="relative h-10 flex-1">
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]" style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-xl border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))] shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                    style={{ left: pct(p.startDays), width: pct(widthDays) }}
                  >
                    <div className="absolute inset-0 cursor-grab active:cursor-grabbing" onPointerDown={(e) => onPointerDown(e, idx, "move")} title="Drag to move" />
                    <div className="absolute left-0 top-0 h-full w-3 cursor-ew-resize" onPointerDown={(e) => onPointerDown(e, idx, "left")} title="Drag to adjust start"><div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/80" /></div>
                    <div className="absolute right-0 top-0 h-full w-3 cursor-ew-resize" onPointerDown={(e) => onPointerDown(e, idx, "right")} title="Drag to adjust end"><div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/80" /></div>
                    <div className="absolute inset-0 grid place-items-center pointer-events-none">
                      <div className="px-2 text-[11px] text-white/95 whitespace-nowrap overflow-hidden text-ellipsis">
                        {total <= 2 ? `${visibleDays}d` : `${Math.round(p.weeks * 10) / 10}w`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-white/65 text-xs">Default is <b>Finish‑to‑Start</b>. Drag edges to overlap phases. Bars snap by <b>day</b>. Days mode auto‑enables when total ≤ 2 weeks.</div>
      </div>
    </div>
  );
}

// ========= Chatbot ========= //
const CHATBOT_SESSION_KEYS = {
  id: "zara_session_id",
  firstSeen: "zara_first_seen",
  fingerprint: "zara_fingerprint",
  lastActive: "zara_session_time",
  visitCount: "zara_visit_count",
};
const CHATBOT_SESSION_TIMEOUT = 30 * 60 * 1000;

function createChatbotFingerprint() {
  if (typeof window === "undefined") return "";
  return JSON.stringify({
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

function ensureChatbotSession() {
  if (typeof window === "undefined") return null;
  const now = Date.now();
  const storedId = localStorage.getItem(CHATBOT_SESSION_KEYS.id);
  const storedFirstSeen = localStorage.getItem(CHATBOT_SESSION_KEYS.firstSeen);
  const storedFingerprint = localStorage.getItem(CHATBOT_SESSION_KEYS.fingerprint);
  const storedLastActive = parseInt(localStorage.getItem(CHATBOT_SESSION_KEYS.lastActive) || "0", 10);
  let visitCount = parseInt(localStorage.getItem(CHATBOT_SESSION_KEYS.visitCount) || "0", 10);
  const fingerprint = createChatbotFingerprint();

  let sessionId = storedId;
  let firstSeen = storedFirstSeen;
  let isReturning = visitCount > 0;

  const invalid =
    !sessionId ||
    !storedFirstSeen ||
    !storedFingerprint ||
    storedFingerprint !== fingerprint ||
    now - storedLastActive > CHATBOT_SESSION_TIMEOUT;

  if (invalid) {
    sessionId = `session_${now}_${Math.random().toString(36).slice(2, 9)}`;
    firstSeen = new Date().toISOString();
    visitCount += 1;
    isReturning = visitCount > 1;
    localStorage.setItem(CHATBOT_SESSION_KEYS.visitCount, String(visitCount));
  }

  localStorage.setItem(CHATBOT_SESSION_KEYS.id, sessionId);
  localStorage.setItem(CHATBOT_SESSION_KEYS.firstSeen, firstSeen);
  localStorage.setItem(CHATBOT_SESSION_KEYS.fingerprint, fingerprint);
  localStorage.setItem(CHATBOT_SESSION_KEYS.lastActive, String(now));

  return { id: sessionId, firstSeen, fingerprint, isReturning, visitCount };
}

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const [isReturning, setIsReturning] = useState(false);
  const listRef = useRef(null);
  const sessionRef = useRef(null);
  const messageCountRef = useRef(0);
  const openRef = useRef(open);
  const minimizedRef = useRef(minimized);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    minimizedRef.current = minimized;
  }, [minimized]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = ensureChatbotSession();
    sessionRef.current = session;
    setIsReturning(Boolean(session?.isReturning));
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: session?.isReturning
          ? "👋 Welcome back! Pick up where we left off—what can I line up for you today?"
          : `Hey there! I'm ${CHATBOT_NAME}. Share your brief, budget, or timeline and I'll map next steps.`,
      },
    ]);

    if (CHATBOT_BASE_URL && CHATBOT_ENDPOINTS.trackVisit) {
      const payload = {
        page: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        sessionId: session?.id,
        firstSeen: session?.firstSeen,
        isReturningVisitor: session?.isReturning,
        visitCount: session?.visitCount,
        fingerprint: session?.fingerprint,
      };
      postJSONWithFallback(CHATBOT_ENDPOINTS.trackVisit, payload).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (open && !minimized) setUnread(0);
  }, [open, minimized, messages.length]);

  useEffect(() => {
    if (!open || minimized) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, open, minimized]);

  const toggleOpen = () => {
    setOpen((prev) => {
      if (!prev) {
        setUnread(0);
        setMinimized(false);
      }
      return !prev;
    });
  };

  const toggleMinimize = () => {
    setMinimized((prev) => {
      const next = !prev;
      if (!next) setUnread(0);
      return next;
    });
  };

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    if (msg.sender === "bot" && (!openRef.current || minimizedRef.current)) {
      setUnread((u) => u + 1);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const baseSession = sessionRef.current || ensureChatbotSession();
    sessionRef.current = baseSession;

    const userMsg = { id: Date.now(), sender: "user", text };
    appendMessage(userMsg);
    messageCountRef.current += 1;
    setLoading(true);

    const typingDelay = new Promise((resolve) => setTimeout(resolve, 450));

    const failSafe = "I'm running in demo mode right now. Drop an email or call sheet and I'll loop Menelek in manually.";

    try {
      if (!CHATBOT_BASE_URL || !CHATBOT_ENDPOINTS.chatbot) {
        await typingDelay;
        appendMessage({ id: Date.now() + 1, sender: "bot", text: failSafe });
        return;
      }

      const payload = {
        message: text,
        sessionId: baseSession?.id,
        messageCount: messageCountRef.current,
        firstSeen: baseSession?.firstSeen,
        isReturningVisitor: baseSession?.isReturning,
        conversationContext: baseSession?.isReturning ? "continuing" : "new",
        page: typeof window !== "undefined" ? window.location.pathname : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        language: typeof navigator !== "undefined" ? navigator.language : "",
      };

      let res;
      let data = null;
      try {
        res = await postJSONWithFallback(CHATBOT_ENDPOINTS.chatbot, payload);
        data = await res.json();
      } catch (err) {
        throw err;
      }

      await typingDelay;

      if (res && data) {
        const replyText = data?.response || data?.reply || data?.message || failSafe;
        appendMessage({ id: Date.now() + 2, sender: "bot", text: replyText });
      } else {
        appendMessage({ id: Date.now() + 3, sender: "bot", text: failSafe });
      }
    } catch (err) {
      await typingDelay;
      appendMessage({
        id: Date.now() + 4,
        sender: "bot",
        text: "Connection hiccup. Email hello@menelekmakonnen.com and I'll jump in directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  if (!open) {
    return (
      <button
        onClick={toggleOpen}
        className="relative rounded-full px-4 py-3 bg-white/10 border border-white/20 backdrop-blur-xl text-left shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:bg-white/15 w-48"
        title="Open chat"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="rounded-full p-2 bg-white/10 border border-white/20"><MessageSquare className="h-4 w-4" /></div>
            {unread > 0 ? (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-xs font-semibold px-1.5 py-0.5 rounded-full">{unread}</span>
            ) : null}
          </div>
          <div>
            <div className="font-semibold text-sm">Chat with {CHATBOT_NAME}</div>
            <div className="text-xs text-white/70">{CHATBOT_TAGLINE}</div>
            {isReturning ? <div className="text-[10px] text-emerald-300/80">Welcome back</div> : null}
          </div>
        </div>
      </button>
    );
  }

  const onHeaderClick = (event) => {
    if (event.target.closest("button")) return;
    toggleMinimize();
  };

  return (
    <div className="w-[320px] bg-black/70 border border-white/15 rounded-3xl backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-pointer select-none"
        onClick={onHeaderClick}
        title={minimized ? "Expand Zara" : "Minimise Zara"}
      >
        <div>
          <div className="font-semibold text-sm">{CHATBOT_NAME}</div>
          <div className="text-xs text-white/70">{CHATBOT_TAGLINE}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMinimize();
            }}
            className="rounded-full p-1.5 hover:bg-white/10"
            title={minimized ? "Maximize" : "Minimize"}
          >
            {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setMinimized(false);
            }}
            className="rounded-full p-1.5 hover:bg-white/10"
            title="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="w-full px-4 py-6 text-sm text-white/75 hover:bg-white/5"
        >
          Tap to resume conversation
        </button>
      ) : (
        <div className="flex flex-col h-[380px]">
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm transition-all",
                  msg.sender === "user" ? "ml-auto bg-white/20" : "bg-white/10 border border-white/15"
                )}
              >
                {msg.text}
              </div>
            ))}
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="relative flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse [animation-delay:120ms]" />
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse [animation-delay:240ms]" />
                </span>
                {CHATBOT_NAME} is typing…
              </div>
            ) : null}
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:text-white/50"
                placeholder="Share your idea…"
                maxLength={500}
              />
              <Button type="submit" variant="accent" disabled={loading}>
                Send
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const INSTAGRAM_VIDEO_COLLECTIONS = [
  {
    id: "epic-edits",
    title: "Epic Edits",
    description: "Signature reels with cinematic pacing, VFX and colour stories.",
    fallbackThumb: "https://i.imgur.com/N7w7LGz.jpg",
    seed: 3,
    urls: [
      "https://www.instagram.com/p/DMKpVGwoOC2/",
      "https://www.instagram.com/p/C7TX-jlqQFB/",
      "https://www.instagram.com/reel/C8rQp-kq5PG/",
      "https://www.instagram.com/reel/C8kNL16KIZc/",
      "https://www.instagram.com/reel/C8z0DAtKq8B/",
      "https://www.instagram.com/reel/DFPiXCOo220/",
      "https://www.instagram.com/reel/CIDASf-n6mv/",
    ],
  },
  {
    id: "beauty-travel",
    title: "Beauty & Travel",
    description: "Luxe portraiture and destination vignettes shot for brands and creators.",
    fallbackThumb: "https://i.imgur.com/1xqQwBn.jpg",
    seed: 11,
    urls: [
      "https://www.instagram.com/reel/C6YtlD2Kbd6/",
      "https://www.instagram.com/reel/C3sDA4AqP5z/",
      "https://www.instagram.com/reel/C-VzUiFqfkm/",
      "https://www.instagram.com/reel/DIx8Dkao7wR/",
      "https://www.instagram.com/reel/DJZC9tpIIOF/",
      "https://www.instagram.com/reel/DEPpHmFIGAl/",
      "https://www.instagram.com/reel/DLfna4ao-z-/",
      "https://www.instagram.com/reel/C7BdCzwqgKo/",
      "https://www.instagram.com/reel/C6JjwNGIKni/",
      "https://www.instagram.com/reel/C5N9JhvK9to/",
      "https://www.instagram.com/reel/C4yA5RKK0zg/",
      "https://www.instagram.com/reel/C4YBtJdqoWr/",
      "https://www.instagram.com/reel/C4LBUi7K9wr/",
      "https://www.instagram.com/reel/C3igTEsqyam/",
      "https://www.instagram.com/reel/DLDh5OUt9mQ/",
      "https://www.instagram.com/reel/DKZRaYntlpH/",
      "https://www.instagram.com/reel/DGwLruRtP9F/",
      "https://www.instagram.com/reel/C5BqJyMKBeD/",
      "https://www.instagram.com/reel/C1ZHmHbKt4u/",
    ],
  },
  {
    id: "bts",
    title: "BTS & Production Diaries",
    description: "Behind the scenes momentum from boxing docs to commercial sets.",
    fallbackThumb: "https://i.imgur.com/dg9lQbH.jpg",
    seed: 7,
    urls: [
      "https://www.instagram.com/reel/CthPmc7OKK5/",
      "https://www.instagram.com/reel/CtjWyXJNxwY/",
      "https://www.instagram.com/reel/Ctlc7--veax/",
      "https://www.instagram.com/reel/Ctn4hRENjQW/",
      "https://www.instagram.com/reel/Cttvmy2AdWU/",
      "https://www.instagram.com/reel/Cue_nHag-QS/",
      "https://www.instagram.com/reel/CuhtdZYMwWj/",
      "https://www.instagram.com/reel/C69G68OPF5N/",
      "https://www.instagram.com/reel/C7KeP-sIHBk/",
      "https://www.instagram.com/reel/DFNRIRqoFH_/",
      "https://www.instagram.com/reel/DFPiY-Do1z0/",
    ],
  },
  {
    id: "ai-edu",
    title: "AI Lab & Learning",
    description: "AI-driven experiments plus educational reels that deconstruct the craft.",
    fallbackThumb: "https://i.imgur.com/2h2x3sC.jpg",
    seed: 5,
    urls: [
      "https://www.instagram.com/reel/DK1bY8couuK/",
      "https://www.instagram.com/reel/DK4gIZtNB-U/",
      "https://www.instagram.com/reel/DIvxSY9tQio/",
      "https://www.instagram.com/reel/DLAbo5mtbC2/",
      "https://www.instagram.com/reel/C5oZNM5KF77/",
      "https://www.instagram.com/reel/C5fciTUqXBR/",
      "https://www.instagram.com/reel/C5c74nYKdI2/",
      "https://www.instagram.com/reel/DMzghyEtXu1/",
    ],
  },
];

function getInstagramCodeFromUrl(url) {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === "p" || segments[i] === "reel") {
        return segments[i + 1] || null;
      }
    }
    return segments[segments.length - 1] || null;
  } catch (error) {
    return null;
  }
}

function instagramThumbnailFromUrl(url, fallback) {
  const code = getInstagramCodeFromUrl(url);
  if (!code) return fallback || "";
  return `https://www.instagram.com/p/${code}/media/?size=l`;
}

function instagramEmbedFromUrl(url) {
  const code = getInstagramCodeFromUrl(url);
  if (!code) return url;
  return url.includes("/reel/")
    ? `https://www.instagram.com/reel/${code}/embed/`
    : `https://www.instagram.com/p/${code}/embed/`;
}

function MMMBelt({ collection, onOpen }) {
  const [hovered, setHovered] = useState(null);
  const picks = useMemo(() => {
    const pool = collection.urls || [];
    const randomized = shuffleWithSeed(pool, collection.seed || Date.now());
    return randomized.slice(0, Math.min(randomized.length, 10));
  }, [collection.urls, collection.seed]);

  const media = picks.map((url) => ({
    id: getInstagramCodeFromUrl(url) || url,
    url,
    thumbnail: instagramThumbnailFromUrl(url, collection.fallbackThumb),
    embedUrl: instagramEmbedFromUrl(url),
  }));
  const duplicated = media.length ? [...media, ...media] : [];

  const openAt = (index) => {
    if (!media.length) return;
    onOpen?.({ collection, media, initialIndex: index % media.length });
  };

  return (
    <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="text-lg font-semibold">{collection.title}</div>
          <p className="text-white/70 text-sm max-w-2xl">{collection.description}</p>
        </div>
        <div className="flex items-center gap-2 text-white/65 text-xs">
          {!media.length ? <span>Loading Instagram previews…</span> : null}
        </div>
      </div>
      <div className="relative overflow-hidden">
        {duplicated.length ? (
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          >
            {duplicated.map((item, idx) => {
              const baseIndex = idx % media.length;
              const isActive = hovered === baseIndex;
              const isDimmed = hovered !== null && !isActive;
              return (
                <button
                  key={`${collection.id}-${idx}`}
                  onMouseEnter={() => setHovered(baseIndex)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => openAt(baseIndex)}
                  className={cn(
                    "relative h-40 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/15 transition-all duration-300",
                    isActive ? "scale-110 z-20" : isDimmed ? "scale-90 opacity-60" : "scale-100"
                  )}
                  title="Open lightbox"
                >
                  <img
                    src={item.thumbnail || collection.fallbackThumb}
                    alt={`${collection.title} preview`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      if (collection.fallbackThumb && e.currentTarget.src !== collection.fallbackThumb) {
                        e.currentTarget.src = collection.fallbackThumb;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-3 text-xs font-medium text-white/85">Tap to expand</div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          <div className="h-40 grid place-items-center text-white/60 text-sm border border-dashed border-white/20 rounded-2xl">
            Pulling reel thumbnails…
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryLightbox({ collection, media, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (!media?.length) return null;
  const item = media[index % media.length];
  const goPrev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setIndex((i) => (i + 1) % media.length);

  return (
    <Modal open={true} onClose={onClose} title={collection?.title || "Gallery"}>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
        {item?.embedUrl ? (
          <iframe
            key={item.embedUrl}
            src={item.embedUrl}
            className="w-full h-full"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={collection?.title || "Instagram reel"}
          />
        ) : item?.thumbnail ? (
          <img
            key={item.thumbnail}
            src={item.thumbnail}
            alt={`${collection?.title || "Gallery"} frame`}
            className="w-full h-full object-contain bg-black"
          />
        ) : null}
        {media.length > 1 ? (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 border border-white/20 p-2 hover:bg-black/75"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 border border-white/20 p-2 hover:bg-black/75"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between text-white/70 text-sm">
        <span>{collection?.description}</span>
        <span>
          {index % media.length + 1} / {media.length}
        </span>
      </div>
      <div className="mt-2 text-right text-xs text-white/60">
        <a href={item?.url} target="_blank" rel="noreferrer" className="underline">Open on Instagram</a>
      </div>
    </Modal>
  );
}

function MMMGalleries() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="py-12" id="galleries">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold">MMM Galleries</h2>
          <span className="text-white/70 text-sm">Hover to magnify • tap to open lightbox</span>
        </div>
        <p className="text-white/75 max-w-3xl">
          Four belts of Instagram reels spanning epic edits, beauty work, BTS, and AI experiments. Hover to spotlight a frame; click to open the lightbox and keep watching without leaving the site.
        </p>
        <div className="space-y-5">
          {INSTAGRAM_VIDEO_COLLECTIONS.map((collection) => (
            <MMMBelt key={collection.id} collection={collection} onOpen={(payload) => setLightbox(payload)} />
          ))}
        </div>
      </div>
      {lightbox ? (
        <GalleryLightbox
          collection={lightbox.collection}
          media={lightbox.media}
          startIndex={lightbox.initialIndex || 0}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </section>
  );
}


// ========= Portfolio ========= //
function Portfolio() {
  const [modal, setModal] = useState(null);
  const embedSrc = useMemo(() => {
    if (!modal || modal.type !== "watch") return null;
    const id = getYouTubeId(modal?.p?.url || "");
    if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    if (!modal?.p?.url) return null;
    return modal.p.url.includes("shorts/") ? modal.p.url.replace("shorts/", "embed/") : modal.p.url;
  }, [modal]);
  return (
    <section className="py-12" id="featured">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-1">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured</h2>
          <span className="text-white/70 text-sm">Proof of craft, proof of results</span>
        </div>
        <p className="text-white/75 max-w-2xl mb-4">Every frame serves story and strategy. Click a tile to watch or skim the case notes.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <Card key={p.id}>
              <div
                className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/45 border border-white/10 group cursor-pointer relative"
                onClick={() => setModal({ type: "watch", p })}
                title="Watch now"
              >
                {youtubeThumb(p.url) ? (
                  <img
                    src={youtubeThumb(p.url)}
                    alt={p.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 [transform:scale(var(--zoom-base))] group-hover:[transform:scale(var(--zoom-hover))]"
                    style={{ "--zoom-base": p.thumbZoom?.base ?? 1.12, "--zoom-hover": p.thumbZoom?.hover ?? 1.22 }}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/60">Poster / Stills</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3 font-semibold">{p.title}</div>
              <div className="text-white/70 text-sm">{p.role} • {p.runtime}</div>
              <p className="mt-2 text-white/80">{p.summary}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setModal({ type: "watch", p })} icon={Play}>Watch</Button>
                <Button onClick={() => setModal({ type: "case", p })} className="bg-white/10" icon={ExternalLink}>Case Study</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {modal ? (
        <Modal open={true} onClose={() => setModal(null)} title={modal?.p?.title || ""}>
          {modal?.type === "watch" ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <iframe
                className="w-full h-full"
                src={embedSrc || modal?.p?.url}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/85">Role: {modal?.p?.role}. Outcome: crisp narrative, solid retention; clean masters.</p>
              <ul className="list-disc pl-6 text-white/80">
                <li>Concept → Production → Post overview</li>
                <li>Tools: Camera/Editor/Grading suite (replace with specifics)</li>
                <li>Deliverables: Final cut(s), verticals, captions, thumbnails</li>
              </ul>
              <Button href={modal?.p?.url} icon={ExternalLink} target="_blank" rel="noreferrer">Open on YouTube</Button>
            </div>
          )}
        </Modal>
      ) : null}
    </section>
  );
}

// ========= Blog ========= //
function Blog() {
  const POSTS = [
    { id: "s1", title: "Production Isn’t Magic—It’s Math", date: "2024-10-01", body: "How I scope shoots that hit the budget, land the story, and don’t burn the crew." },
    { id: "s2", title: "Directing with Restraint", date: "2024-10-08", body: "When less camera movement is more emotion—blocking that respects performance." },
    { id: "s3", title: "AI in the Edit Suite", date: "2024-10-15", body: "Using AI for assist, not autopilot: selects, transcripts, and alt‑cuts without losing taste." },
  ];
  return (
    <section className="py-12" id="blog">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Blog</h2>
        <p className="text-white/75 mt-2">Notes from set, suite, and spreadsheets—the unsexy decisions that make the final cut sing.</p>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {POSTS.map((p) => (
            <Card key={p.id}>
              <div className="text-sm text-white/60">{p.date}</div>
              <div className="font-semibold mt-1">{p.title}</div>
              <p className="mt-2 text-white/80">{p.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========= Biography ========= //
function Biography() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Biography</h2>
        <Card className="mt-4 space-y-3">
          <p className="text-white/85">I’m a director and worldbuilder focused on audience retention and emotional payoff. I grew up on DC’s mythic weight and the MCU’s long‑arc engineering, so my work blends spectacle, clarity, and continuity. I’m building the Loremaker Universe—Afro‑mythic superheroes, supernatural intrigue, and grounded human stakes.</p>
          <p className="text-white/80">My lane: commercials, short films, music videos, documentaries, and AI‑assisted storytelling pipelines. I write treatments that sell, run lean crews, and deliver clean masters for multi‑platform delivery. I’m as comfortable arguing for a lens choice as I am for a marketing hook.</p>
          <p className="text-white/80">Philosophy: style serves structure. If the audience doesn’t feel something, the frame’s a screensaver. I prioritize performance direction, visual clarity, and schedules that respect people’s time. Tools are welcome—taste is mandatory.</p>
          <p className="text-white/80">Highlights include <em>Heroes & Gods</em> (feature‑length anthology), <em>Blinded by Magic</em>, <em>Abranteers</em>, and the boxing pilot doc <em>SPAR</em>. Beyond set life, I design pipelines for brands to publish consistently without losing voice.</p>
        </Card>
      </div>
    </section>
  );
}

// ========= All Links Modal ========= //
function AllLinksModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="All my Links">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-3"><Youtube className="h-5 w-5" /><div>
            <div className="font-semibold">YouTube</div>
            <div className="text-white/60 text-xs">Trailers, reels, behind‑the‑scenes</div>
          </div></div>
          <div className="flex flex-col gap-2">
            <Button href={LINKS.personalYouTube} target="_blank" rel="noreferrer" icon={ExternalLink}>Personal Channel</Button>
            <Button href={LINKS.directorYouTube} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">Director Channel</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3"><Instagram className="h-5 w-5" /><div>
            <div className="font-semibold">Instagram</div>
            <div className="text-white/60 text-xs">Stills, reels, lore snippets</div>
          </div></div>
          <div className="grid grid-cols-2 gap-2">
            <Button href={LINKS.personalIG} target="_blank" rel="noreferrer" variant="ghost">Personal</Button>
            <Button href={LINKS.loremakerIG} target="_blank" rel="noreferrer" variant="ghost">Loremaker</Button>
            <Button href={LINKS.icuniIG} target="_blank" rel="noreferrer" variant="ghost">ICUNI</Button>
            <Button href={LINKS.mmmIG} target="_blank" rel="noreferrer" variant="ghost">MMM Media</Button>
            <Button href={LINKS.aiIG} target="_blank" rel="noreferrer" variant="ghost">AI Consultancy</Button>
          </div>
          <div className="mt-3 flex items-center gap-2"><Linkedin className="h-4 w-4" /><a className="underline" href={LINKS.personalLI} target="_blank" rel="noreferrer">LinkedIn</a></div>
          <div className="mt-1 flex items-center gap-2"><Linkedin className="h-4 w-4" /><a className="underline" href={LINKS.businessLI} target="_blank" rel="noreferrer">Business LinkedIn</a></div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3"><ExternalLink className="h-5 w-5" /><div>
            <div className="font-semibold">Websites</div>
            <div className="text-white/60 text-xs">Universes, consultancy, archive</div>
          </div></div>
          <div className="flex flex-col gap-2">
            <Button href={LINKS.loremakerSite} target="_blank" rel="noreferrer" icon={ExternalLink}>Loremaker Database</Button>
            <Button href={LINKS.icuniSite} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">AI Consultancy (ICUNI)</Button>
            <Button href={LINKS.oldBlog} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">Old Blog</Button>
          </div>
        </Card>
      </div>
    </Modal>
  );
}

// ========= App Shell ========= //
function LogoMark() {
  return (
    <div className="relative h-8 w-8 grid place-items-center">
      <svg viewBox="0 0 64 64" className="h-8 w-8">
        <defs>
          <linearGradient id="mmg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopOpacity="0.85" stopColor="#ffffff" />
            <stop offset="100%" stopOpacity="0.15" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="8" transform="rotate(45 32 32)" fill="url(#mmg)" opacity="0.12" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <text x="32" y="38" textAnchor="middle" fontSize="20" fill="#ffffff" opacity="0.9" style={{ fontWeight: 800, letterSpacing: 1 }}>MM</text>
      </svg>
    </div>
  );
}

const SECTION_LINKS = [
  { id: "featured", label: "Featured" },
  { id: "value-calculator", label: "Client Value Calculator" },
  { id: "galleries", label: "Galleries" },
  { id: "contact", label: "Contact Form" },
  { id: "blog", label: "Blog" },
];

const MENU = [
  { key: "home", label: "Home" },
  { key: "bio", label: "Biography" },
  { key: "ai", label: "AI" }, // external link
  { key: "loremaker", label: "Loremaker" }, // external link
  { key: "blog", label: "Blog" },
];

function FloatingButtons({ onOpenContact }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <ChatbotWidget />
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenContact}
          className="rounded-full p-3 bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          title="Quick contact"
          aria-label="Contact"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full p-3 bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function SectionNav({ variant = "floating", className = "" }) {
  const onNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const containerClasses = cn(
    "flex flex-wrap items-center gap-2 px-4 py-3",
    variant === "floating"
      ? "rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
  );
  const buttonClasses =
    variant === "floating"
      ? "px-3 py-1.5 text-sm rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
      : "px-3 py-1.5 text-sm rounded-full border border-white/15 bg-white/10 hover:bg-white/15 transition-colors";

  return (
    <div className={cn(containerClasses, className)}>
      {SECTION_LINKS.map((link) => (
        <button
          key={link.id}
          type="button"
          onClick={() => onNavigate(link.id)}
          className={buttonClasses}
          title={`Jump to ${link.label}`}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}

function runSelfTests() {
  try {
    console.group("Self‑tests");
    console.assert(typeof clamp === "function", "clamp helper exists");
    // getYouTubeId
    console.assert(getYouTubeId("https://www.youtube.com/watch?v=abc123") === "abc123", "watch?v= failed");
    console.assert(getYouTubeId("https://youtu.be/xyz789") === "xyz789", "youtu.be failed");
    console.assert(getYouTubeId("https://www.youtube.com/shorts/QQ11WW22") === "QQ11WW22", "shorts failed");
    console.assert(getYouTubeId("https://www.youtube.com/embed/IDID") === "IDID", "embed failed");

    // calendar calc
    const phases = [
      { key: "a", label: "A", startDays: 0, weeks: 1 },
      { key: "b", label: "B", startDays: 7, weeks: 1 },
    ];
    const cal = buildCalendarStateOverlapping(phases, "2025-01-01");
    console.assert(cal.start === "2025-01-01", "cal start");
    console.assert(cal.end >= "2025-01-15", "cal end range");

    // extra test: ensure pct math stays consistent
    console.assert(typeof youtubeThumb(PROJECTS[0].url) === "string", "thumb returns string");
    console.assert(Array.isArray(HERO_SLIDES) && HERO_SLIDES.length >= 4, "hero slides configured");
    console.assert(typeof ChatbotWidget === "function", "chatbot widget present");
    console.assert(typeof WorkWithMe === "function", "work with me component present");
    console.assert(Array.isArray(INSTAGRAM_VIDEO_COLLECTIONS) && INSTAGRAM_VIDEO_COLLECTIONS.length === 4, "MMM collections configured");

    console.groupEnd();
  } catch (e) {
    console.warn("Self‑tests error:", e);
  }
}

export default function AppShell() {
  const [route, setRoute] = useState("home");
  const [linksOpen, setLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);
  const [currentService, setCurrentService] = useState(SERVICES[0].name);

  const prefillSubtype = (name) => window.dispatchEvent(new CustomEvent("prefill-subtype", { detail: { subtype: name } }));

  const goContactInline = (serviceName) => {
    if (serviceName) prefillSubtype(serviceName);
    setRoute("home");
    setTimeout(() => { document.getElementById("contact-inline")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 0);
  };

  useEffect(() => {
    runSelfTests();
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.015)_0,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_8px)]" />
        <DiamondsCanvas />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/45 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="font-semibold tracking-tight">Menelek Makonnen</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-white/80">
            {MENU.map((m) => (
              m.key === "ai" ? (
                <a key={m.key} href={LINKS.icuniSite} className="hover:text-white" rel="noreferrer">{m.label}</a>
              ) : m.key === "loremaker" ? (
                <a key={m.key} href={LINKS.loremakerSite} className="hover:text-white">{m.label}</a>
              ) : (
                <a key={m.key} href="#" onClick={(e) => { e.preventDefault(); setRoute(m.key); }} className={cn("hover:text-white", route === m.key && "text-white")}>{m.label}</a>
              )
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button onClick={() => setLinksOpen(true)} className="hidden sm:inline-flex">All my Links</Button>
            <a href={SOCIALS.email} className="text-white/80 hover:text-white hidden sm:inline-flex items-center gap-2"><Mail className="h-4 w-4" />Email</a>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main>
        {route === "home" && (
          <>
            <Hero onOpenLinksModal={() => setLinksOpen(true)} />
            <div className="max-w-7xl mx-auto px-6 -mt-6">
              <SectionNav />
            </div>
            <Portfolio />
            <WorkWithMe
              currentService={currentService}
              onSetService={(n) => setCurrentService(n)}
              onBook={(svc) => goContactInline(svc)}
              onCalendarChange={setCalendarState}
            />
            <MMMGalleries />
            <section className="py-6" id="contact">
              <div className="max-w-7xl mx-auto px-6">
                <ContactInline calendarState={calendarState} />
              </div>
            </section>
            <Blog />
          </>
        )}
        {route === "bio" && <Biography />}
        {route === "blog" && <Blog />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 bg-black/35 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold">Menelek Makonnen</div>
            <div className="text-white/70 text-sm mt-1">Filmmaker • Worldbuilder</div>
            <div className="mt-3 flex items-center gap-4 text-white/80">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Instagram className="h-4 w-4" />Instagram</a>
              <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Youtube className="h-4 w-4" />YouTube</a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn</a>
            </div>
          </div>
          <div className="md:col-span-2 text-white/70 text-sm">
            © {new Date().getFullYear()} Loremaker • ICUNI. All rights reserved.
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <SectionNav variant="footer" />
        </div>
      </footer>

      {/* Floating Buttons */}
      <FloatingButtons onOpenContact={() => setContactOpen(true)} />

      {/* Modals */}
      <AllLinksModal open={linksOpen} onClose={() => setLinksOpen(false)} />

      {/* Quick Contact bubble modal */}
      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title="Quick Contact">
        <div className="grid gap-3">
          <p className="text-white/75 text-sm">Leave a fast brief. I’ll reply within 24–48h.</p>
          <a className="underline" href={SOCIALS.email}>Or email me directly</a>
          <textarea rows={4} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" placeholder="What are we making? Scope, goals, timeline…" />
          <div className="flex gap-2">
            <Button onClick={() => { alert("Saved locally. I’ll be in touch."); setContactOpen(false); }} icon={ShieldCheck}>Send</Button>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>Cancel</Button>
          </div>
          <div className="text-xs text-white/60">This is a no‑backend demo. Your note stays on your device.</div>
        </div>
      </Modal>
    </div>
  );
}
