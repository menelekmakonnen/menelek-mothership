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
  Expand,
  ChevronLeft,
  ChevronRight,
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

// Publish the Characters tab to the web and set the correct gid
const SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/export?format=csv&gid=0";

const CHATBOT_BASE_URL = "https://YOUR_N8N_INSTANCE.com"; // ⬅️ set
const CHATBOT_ENDPOINTS = { trackVisit: "/webhook/track-visit", chatbot: "/webhook/chatbot" };
const CHATBOT_NAME = "Zara";
const CHATBOT_TAGLINE = "Menelek's AI Assistant";
const GOOGLE_PHOTOS_PROXY_PREFIX = "https://r.jina.ai/https://";

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const shuffleArray = (arr) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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

    const cell = 9;
    const rot = Math.PI / 4;
    const baseAlpha = 0.018;
    const auraR = 90;
    const size = 2.0;

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

          const a = Math.min(0.6, hoverK * 0.5 + clickGlow * 0.85);
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
  },
  {
    id: "blinded-by-magic",
    title: "Blinded by Magic (2022)",
    role: "Writer–Director",
    runtime: "12 min",
    summary: "A possessed camera blinds its user while granting powers.",
    url: "https://www.youtube.com/watch?v=ivsCBuD1JYQ&pp=ygUYbWVuZWxlayBibGluZGVkIGJ5IG1hZ2lj",
    thumbZoom: { base: 1.26, hover: 1.4 },
  },
  {
    id: "heroes-gods",
    title: "Heroes & Gods (2024)",
    role: "Writer–Director, Editor",
    runtime: "120 min",
    summary: "Anthology stitched into a feature — heroes vs vengeful goddess & twin.",
    url: "https://www.youtube.com/watch?v=jtiOv0OvD-0&pp=ygUXbWVuZWxlayBoZXJvZXMgYW5kIGdvZHM%3D",
  },
  {
    id: "spar-bts",
    title: "SPAR (Doc, 2024)",
    role: "Director, Cinematographer, Editor",
    runtime: "14 min",
    summary: "BTS doc for a boxing pilot in London — Left Hook Gym.",
    url: "https://www.youtube.com/watch?v=4q6X6prhVOE",
    thumbZoom: { base: 1.28, hover: 1.45 },
  },
  {
    id: "soldier-mv",
    title: "Soldier (Music Video)",
    role: "Director, Editor",
    runtime: "3 min",
    summary: "Concept-to-delivery music video including cover art.",
    url: "https://www.youtube.com/watch?v=BHPaJieCAXY&pp=ygUMd29udSBzb2xkaWVy0gcJCfsJAYcqIYzv",
    thumbZoom: { base: 1.3, hover: 1.46 },
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
const HERO_SLIDES = [
  { id: "reel", kind: "video", title: "Showreel", src: "https://www.youtube.com/embed/A8cGpNe2JAE" },
  { id: "photo", kind: "image", title: "Best Photo", src: "https://i.imgur.com/1xqQwBn.jpg" },
  { id: "edit", kind: "image", title: "Epic Edit", src: "https://i.imgur.com/dg9lQbH.jpg" },
  { id: "universe", kind: "image", title: "Loremaker Universe", src: "https://i.imgur.com/2h2x3sC.jpg" },
];

function Hero({ onOpenLinksModal }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[idx];
  return (
    <section className="relative pt-24 pb-10">
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
        <Card>
          <div className="text-sm uppercase tracking-[0.25em] text-white/60 flex items-center justify-between">
            <span>Showcase</span>
            <div className="text-xs text-white/60">{idx + 1}/{HERO_SLIDES.length}</div>
          </div>
          <div className="mt-3 aspect-video w-full rounded-2xl overflow-hidden border border-white/10 relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
              >
                {slide.kind === "video" ? (
                  <iframe
                    className="w-full h-full"
                    src={slide.src}
                    title={slide.title}
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center scale-[1.12] group-hover:scale-[1.18] transition-transform duration-700"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ========= Work with Me ========= //
function WorkWithMe({ currentService, onSetService, onBook, onCalendarChange }) {
  const [randomKey, setRandomKey] = useState(0);
  return (
    <section className="py-12" id="work">
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", subtype: "", otherDetail: "", message: "", fitScore: "", recTier: "Starter", scope: "" });
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
  const submit = () => {
    if (!agree) return alert("Please agree to the Privacy Policy.");
    if (!form.name || !form.email) return alert("Name and Email are required.");
    const key = "mm_contact_submissions";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ ...form, service: "Director for Hire", calendar: calendarState, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
    setOk(true);
  };

  const clear = () => setForm({ name: "", email: "", phone: "", subtype: "", otherDetail: "", message: "", fitScore: "", recTier: "Starter", scope: "" });

  const choose = (s) => setForm((f) => ({ ...f, subtype: s }));
  const options = [...SERVICES.map((s) => s.name), "Other"];

  return (
    <Card id="contact-inline">
      <h3 className="text-xl font-semibold">Contact</h3>
      <div className="text-white/70 text-sm">Email: <a href={SOCIALS.email} className="underline">hello@menelekmakonnen.com</a></div>
      <p className="text-white/70 text-sm mt-1">Prefer speed? Tap the chat bubble at bottom‑right and leave a short brief.</p>
      {!ok ? (
        <div className="grid gap-3 mt-4">
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

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Fit Score %</label>
              <input value={form.fitScore} onChange={(e) => setForm({ ...form, fitScore: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Recommended Package</label>
              <select value={form.recTier} onChange={(e) => setForm({ ...form, recTier: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full text-white" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                {["Starter", "Signature", "Cinema+"].map((x) => (
                  <option key={x} className="text-black">{x}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Budget • Timeline</label>
              <input value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
          </div>

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
            <Button onClick={submit} icon={ShieldCheck}>Send Inquiry</Button>
            <Button href={SOCIALS.email} icon={Mail} variant="ghost">Email Instead</Button>
            <Button onClick={clear} variant="ghost">Clear Form</Button>
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
  const [budget, setBudget] = useState(2000);
  const [ambition, setAmbition] = useState(6);
  const [projectDate, setProjectDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [total, setTotal] = useState(6); // weeks

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
    if (tWeeks <= 1) {
      const out = [];
      let sd = 0;
      for (let i = 0; i < KEYS.length; i++) {
        out.push({ key: KEYS[i], label: LABELS[i], startDays: sd, weeks: 1 / 7 });
        sd += 1;
      }
      return out;
    }
    const parts = SPLIT.map((r) => Math.max(0.5, Math.round(tWeeks * r * 2) / 2));
    const out = [];
    let sd = 0;
    for (let i = 0; i < parts.length; i++) {
      out.push({ key: KEYS[i], label: LABELS[i], startDays: sd, weeks: parts[i] });
      sd += Math.ceil(parts[i] * 7);
    }
    return out;
  };

  const [phases, setPhases] = useState(() => makeFSForTotal(6));

  useEffect(() => {
    setPhases((prev) => {
      if (total <= 1) return makeFSForTotal(1);
      const maxDays = total * 7;
      return prev.map((p) => {
        const weeks = Math.max(0.5, Math.min(26, p.weeks));
        let startDays = Math.min(Math.max(0, p.startDays), Math.max(0, maxDays - Math.ceil(weeks * 7)));
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

  const phaseWeeksTotal = (arr) => arr.reduce((a, b) => a + (b.weeks || 0), 0);

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <div className="text-white/70 text-sm mb-1">Selected Service</div>
          <div className="px-3 py-2 rounded-xl border border-white/20 bg-white/10">{service}</div>
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Budget (£{budget.toLocaleString()})</div>
          <input aria-label="Budget" type="range" min={200} max={20000} step={50} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Ambition ({ambition})</div>
          <input aria-label="Ambition" type="range" min={1} max={10} value={ambition} onChange={(e) => setAmbition(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Proposed Project Start</div>
          <input aria-label="Project start" type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10" />
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between text-white/70 text-sm"><span>Fit Score</span><span>{descriptor}</span></div>
        <div className="rounded-2xl p-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/15">
          <svg viewBox="0 0 110 6" className="w-full block" aria-label={`Fit score ${score}%`}>
            <rect x="0" y="0" width="110" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
            <rect x="0" y="0" width={score} height="6" rx="3" fill={barColor} />
          </svg>
          <div className="text-white/75 text-sm mt-2">Recommended: <span className="font-semibold">{suggestedTier}</span> • Total Timeline: {phaseWeeksTotal(phases).toFixed(1)} {phaseWeeksTotal(phases) <= 2 ? 'weeks (days mode below)' : 'weeks'}</div>
        </div>
      </div>
      <TimelineGrid phases={phases} onChange={setPhases} total={total} onTotalChange={setTotal} startDate={projectDate} />
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
  const clampPhase = (p) => {
    const maxStart = Math.max(0, totalDays - Math.ceil(p.weeks * 7));
    return { ...p, startDays: Math.min(Math.max(0, p.startDays), maxStart), weeks: Math.max(0.5, Math.min(26, p.weeks)) };
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
          <input aria-label="Total duration weeks" type="range" min={1} max={26} step={1} value={total} onChange={(e) => onTotalChange(parseInt(e.target.value))} />
          <span className="text-white/70 text-xs">{total} wks</span>
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
          {phases.map((p, idx) => (
            <div key={p.key} className="flex items-center gap-3">
              <div className="w-44 shrink-0 text-[13px] text-white/80">{p.label}</div>
              <div className="relative h-10 flex-1">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]" style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 h-8 rounded-xl border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))] shadow-[0_8px_30px_rgba(0,0,0,0.4)]" style={{ left: pct(p.startDays), width: pct(Math.ceil(p.weeks * 7)) }}>
                  <div className="absolute inset-0 cursor-grab active:cursor-grabbing" onPointerDown={(e) => onPointerDown(e, idx, "move")} title="Drag to move" />
                  <div className="absolute left-0 top-0 h-full w-3 cursor-ew-resize" onPointerDown={(e) => onPointerDown(e, idx, "left")} title="Drag to adjust start"><div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/80" /></div>
                  <div className="absolute right-0 top-0 h-full w-3 cursor-ew-resize" onPointerDown={(e) => onPointerDown(e, idx, "right")} title="Drag to adjust end"><div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/80" /></div>
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="px-2 text-[11px] text-white/95 whitespace-nowrap overflow-hidden text-ellipsis">
                      {total <= 2 ? `${Math.ceil(p.weeks * 7)}d` : `${Math.round(p.weeks * 10) / 10}w`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-white/65 text-xs">Default is <b>Finish‑to‑Start</b>. Drag edges to overlap phases. Bars snap by <b>day</b>. Days mode auto‑enables when total ≤ 2 weeks.</div>
      </div>
    </div>
  );
}

// ========= CSV helper ========= //
function useCSV(url) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch(url, { mode: "cors" });
        const text = await res.text();
        if (abort) return;
        const { rows } = parseCSV(text);
        setRows(rows.filter((r) => Object.values(r).some((v) => (v || "").toString().trim())));
      } catch (e) {
        setRows([]);
      }
    })();
    return () => { abort = true; };
  }, [url]);
  return { rows };
}

const normalizePhotoUrl = (src) => {
  if (!src) return src;
  let out = src;
  out = out.replace(/=w\d+-h\d+(-no)?/g, "=w1600-h900-no");
  out = out.replace(/=s\d+-c/g, "=w1600-h900-no");
  if (!out.includes("=w") && !out.includes("=m") && !out.includes("=mp4")) {
    out = `${out}=w1600-h900-no`;
  }
  return out;
};

function proxyGooglePhotosUrl(url) {
  if (!url) return url;
  if (url.startsWith("https://r.jina.ai/")) return url;
  if (url.startsWith("https://")) return `${GOOGLE_PHOTOS_PROXY_PREFIX}${url.slice("https://".length)}`;
  return `${GOOGLE_PHOTOS_PROXY_PREFIX}${url}`;
}

function extractGooglePhotosMedia(html) {
  if (!html) return [];
  const matches = html.matchAll(/"(https:\/\/lh3\.googleusercontent\.com\/[^"\\]+)"/g);
  const seen = new Set();
  const media = [];
  for (const m of matches) {
    const raw = m[1];
    if (!raw) continue;
    if (/=s\d+-c/.test(raw) && !/=w\d+/.test(raw)) continue;
    if (!/=w\d+/.test(raw) && !/=m\d+/.test(raw) && !raw.includes("=mp4")) continue;
    const normalized = normalizePhotoUrl(raw);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    const type = /=m\d+/.test(raw) || raw.includes("=mp4") ? "video" : "image";
    media.push({ src: normalized, type });
  }
  return media;
}

function useGooglePhotosAlbum(shareUrl, limit = 24) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shareUrl) {
      setMedia([]);
      setLoading(false);
      setError(null);
      return;
    }
    let abort = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(proxyGooglePhotosUrl(shareUrl));
        const text = await res.text();
        if (abort) return;
        const parsed = shuffleArray(extractGooglePhotosMedia(text)).slice(0, limit);
        setMedia(parsed);
        setError(null);
      } catch (err) {
        if (!abort) {
          setMedia([]);
          setError(err);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    };
    run();
    return () => {
      abort = true;
    };
  }, [shareUrl, limit]);

  return { media, loading, error };
}

// ========= Chatbot ========= //
function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState(() => [
    { id: 0, sender: "bot", text: `Hi, I'm ${CHATBOT_NAME}. Share your project goal, timeline, or budget and I’ll guide you.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const listRef = useRef(null);

  useEffect(() => {
    if (!CHATBOT_BASE_URL || CHATBOT_BASE_URL.includes("YOUR_N8N_INSTANCE")) return;
    fetch(`${CHATBOT_BASE_URL}${CHATBOT_ENDPOINTS.trackVisit}`, { method: "POST", mode: "cors" }).catch(() => {});
  }, []);

  useEffect(() => {
    if (open && !minimized) setUnread(0);
  }, [open, minimized]);

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

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    try {
      let replyText = "Thanks for reaching out! I'll follow up with a deeper answer shortly.";
      if (CHATBOT_BASE_URL && !CHATBOT_BASE_URL.includes("YOUR_N8N_INSTANCE")) {
        const res = await fetch(`${CHATBOT_BASE_URL}${CHATBOT_ENDPOINTS.chatbot}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({ message: text }),
        });
        if (res.ok) {
          const data = await res.json();
          replyText = data?.reply || data?.message || replyText;
        }
      } else {
        replyText = "I'm running in demo mode. Drop your email or call sheet and I'll forward it to Menelek.";
      }
      setMessages((msgs) => [...msgs, { id: Date.now() + 1, sender: "bot", text: replyText }]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { id: Date.now() + 2, sender: "bot", text: "Connection hiccup. Email hello@menelekmakonnen.com and I'll jump in." }]);
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
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="w-[320px] bg-black/70 border border-white/15 rounded-3xl backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <div className="font-semibold text-sm">{CHATBOT_NAME}</div>
          <div className="text-xs text-white/70">{CHATBOT_TAGLINE}</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMinimize} className="rounded-full p-1.5 hover:bg-white/10" title={minimized ? "Maximize" : "Minimize"}>
            {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button onClick={() => { setOpen(false); setMinimized(false); }} className="rounded-full p-1.5 hover:bg-white/10" title="Close chat">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {minimized ? (
        <button onClick={() => setMinimized(false)} className="w-full px-4 py-6 text-sm text-white/75 hover:bg-white/5">Tap to resume conversation</button>
      ) : (
        <div className="flex flex-col h-[380px]">
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("max-w-[90%] rounded-2xl px-3 py-2 text-sm", msg.sender === "user" ? "ml-auto bg-white/20" : "bg-white/10 border border-white/15")}>{msg.text}</div>
            ))}
            {loading ? <div className="text-xs text-white/60">{CHATBOT_NAME} is typing…</div> : null}
          </div>
          <form onSubmit={onSubmit} className="p-3 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm"
                placeholder="Share your idea…"
              />
              <Button type="submit" variant="accent">Send</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function parseCSV(text) {
  const lines = [];
  let cur = [];
  let val = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { val += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else { val += c; }
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(val); val = ""; }
      else if (c === "\n" || c === "\r") {
        if (val !== "" || cur.length) {
          cur.push(val);
          lines.push(cur);
          cur = [];
          val = "";
        }
      } else val += c;
    }
  }
  if (val !== "" || cur.length) { cur.push(val); lines.push(cur); }
  if (!lines.length) return { headers: [], rows: [] };
  const headers = lines[0];
  const rows = lines.slice(1).map((arr) => Object.fromEntries(headers.map((h, i) => [h, arr[i] ?? ""])));
  return { headers, rows };
}

// ========= Featured Universe ========= //
function FeaturedUniverse() {
  const { rows } = useCSV(SHEETS_CSV_URL);

  const picks = useMemo(() => {
    if (!rows?.length) return [];
    const want = Math.min(6, Math.max(3, Math.floor(Math.random() * 4) + 3)); // 3–6
    const idx = new Set();
    while (idx.size < Math.min(want, rows.length)) idx.add(Math.floor(Math.random() * rows.length));
    return [...idx].map((i) => rows[i]);
  }, [rows]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured from the Loremaker Universe</h2>
          <span className="text-white/70 text-sm">A living, expanding canon</span>
        </div>
        <p className="text-white/75 max-w-2xl mb-4">A few signals from a much larger world. Power balances shift, alliances fracture, and ordinary people are forced to choose a side.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {picks.length ? (
            picks.map((r, i) => <CharacterCard key={`${r.Char_ID || r.id || r["Character"] || i}`} row={r} />)
          ) : (
            [0, 1, 2].map((i) => (
              <Card key={i}>
                <div className="animate-pulse h-40 rounded-xl bg-white/5 border border-white/10" />
                <div className="mt-3 h-5 w-2/3 bg-white/10 rounded" />
                <div className="mt-2 h-4 w-1/2 bg-white/10 rounded" />
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

const MMM_ALBUMS = [
  {
    id: "mmm-photos",
    title: "MMM Photos",
    shareUrl: "https://photos.app.goo.gl/syCYDJW3Ks3BrWGi6",
    description: "On-set stills, lookbook pulls, and documentary frames from recent commissions.",
  },
  {
    id: "mmm-epic-edits",
    title: "Epic Edits Gallery",
    shareUrl: "https://photos.app.goo.gl/syCYDJW3Ks3BrWGi6",
    description: "Cinematic key art, AI-assisted composites, and surreal lore beats.",
    seed: 9,
  },
  {
    id: "mmm-videos",
    title: "MMM Video Highlights",
    shareUrl: "https://photos.app.goo.gl/6mLydwc1VsX2zPa96",
    description: "Delivered spots, teasers, and BTS motion selects straight from the edit suite.",
    kind: "video",
  },
  {
    id: "mmm-ai-videos",
    title: "AI Video Lab",
    shareUrl: "https://photos.app.goo.gl/kticmQ8LupL1LmZi7",
    description: "Experimental AI motion tests, previs experiments, and stylised loops.",
    kind: "video",
    seed: 5,
  },
];

function MMMAlbumCard({ album, onOpen }) {
  const { media, loading, error } = useGooglePhotosAlbum(album.shareUrl, 30);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (media.length && typeof album.seed === "number") {
      setIndex(album.seed % media.length);
    }
  }, [album.seed, media.length]);

  useEffect(() => {
    if (!media.length) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % media.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [media.length]);

  const slide = media.length ? media[index % media.length] : null;
  const openLightbox = () => {
    if (!media.length) return;
    onOpen?.({ album, media, initialIndex: index % media.length });
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative aspect-[4/3] bg-black/45 border-b border-white/10 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Syncing album…</span>
          </div>
        ) : slide ? (
          slide.type === "video" ? (
            <video
              key={`${album.id}-${slide.src}`}
              src={slide.src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              key={`${album.id}-${slide.src}`}
              src={slide.src}
              alt={`${album.title} still`}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="text-white/60 text-sm px-6 text-center">
            {error ? "Album unavailable right now." : "No media available yet."}
          </div>
        )}
        <button
          onClick={openLightbox}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 border border-white/20 backdrop-blur px-3 py-1.5 text-xs font-medium uppercase tracking-wide hover:bg-black/75 disabled:opacity-60"
          disabled={!media.length}
          title="Open lightbox"
        >
          <Expand className="h-4 w-4" /> View
        </button>
      </div>
      <div className="p-5 space-y-2">
        <div className="font-semibold text-lg">{album.title}</div>
        <p className="text-white/70 text-sm">{album.description}</p>
        <a
          href={album.shareUrl}
          className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink className="h-4 w-4" /> Open in Google Photos
        </a>
      </div>
    </Card>
  );
}

function GalleryLightbox({ album, media, startIndex = 0, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  if (!media?.length) return null;
  const item = media[index % media.length];
  const goPrev = () => setIndex((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setIndex((i) => (i + 1) % media.length);

  return (
    <Modal open={true} onClose={onClose} title={album?.title || "Gallery"}>
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
        {item?.type === "video" ? (
          <video
            key={item.src}
            src={item.src}
            className="w-full h-full object-contain bg-black"
            controls
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            key={item?.src}
            src={item?.src}
            alt={`${album?.title || "Gallery"} frame`}
            className="w-full h-full object-contain bg-black"
          />
        )}
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
        <span>{album?.description}</span>
        <span>
          {index % media.length + 1} / {media.length}
        </span>
      </div>
    </Modal>
  );
}

function MMMGalleries() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">MMM Galleries</h2>
          <span className="text-white/70 text-sm">Google Photos albums • tap to open</span>
        </div>
        <p className="text-white/75 max-w-2xl mb-4">
          Curated pulls from MMM Media productions — stills, edits, and AI experiments that stay in slow-motion rotation. Tap a tile for an expanded lightbox and swipe through the full album.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MMM_ALBUMS.map((album) => (
            <MMMAlbumCard key={album.id} album={album} onOpen={(payload) => setLightbox(payload)} />
          ))}
        </div>
      </div>
      {lightbox ? (
        <GalleryLightbox
          album={lightbox.album}
          media={lightbox.media}
          startIndex={lightbox.initialIndex || 0}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </section>
  );
}


function CharacterCard({ row }) {
  const name = row["Character"] || row["Name"] || row["Title"] || "Unnamed";
  const alias = row["Alias"] || row["AKA"] || "";
  const alignment = row["Alignment"] || row["Faction"] || "";
  const location = row["Location"] || row["Base"] || "";
  const short = row["Short Description"] || row["Summary"] || row["Bio"] || "";
  const img = (row["Cover Image"] || row["Image"] || "").replace(/open\?id=/, "uc?export=view&id=");
  const long = row["Long Description"] || row["Bio"] || "";
  const powers = row["Powers"] || row["Abilities"] || "";
  const role = row["Role"] || row["Type"] || "";
  const status = row["Status"] || "";
  return (
    <Card>
      <div className="aspect-[16/10] rounded-xl bg-black/45 border border-white/10 overflow-hidden grid place-items-center group">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover object-center scale-[1.12] group-hover:scale-[1.18] transition-transform duration-700" />
        ) : (
          <div className="text-white/50 text-sm">Art / Poster</div>
        )}
      </div>
      <div className="mt-3 font-semibold">{name}{alias ? <span className="text-white/60 font-normal"> — {alias}</span> : null}</div>
      <div className="text-white/70 text-sm flex flex-wrap gap-1 items-center">
        {alignment ? <span>{alignment}</span> : null}
        {location ? <span>• {location}</span> : null}
        {role ? <span>• {role}</span> : null}
        {status ? <span>• {status}</span> : null}
      </div>
      {short ? <p className="mt-2 text-white/80 text-sm">{short}</p> : null}
      {(powers || long) ? (
        <details className="mt-2 text-white/75 text-sm">
          <summary className="cursor-pointer hover:underline">Character breakdown</summary>
          {powers ? <p className="mt-1"><span className="text-white/60">Abilities:</span> {powers}</p> : null}
          {long ? <p className="mt-1">{long}</p> : null}
        </details>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Button href={LINKS.loremakerSite} className="bg-white/10" icon={ExternalLink}>Read more</Button>
      </div>
    </Card>
  );
}

// ========= Portfolio ========= //
function Portfolio() {
  const [modal, setModal] = useState(null);
  return (
    <section className="py-12" id="featured-projects">
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
                src={modal?.p?.url?.replace("watch?v=", "embed/").replace("shorts/", "embed/")}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
    <section className="py-12">
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

function runSelfTests() {
  try {
    console.group("Self‑tests");
    console.assert(typeof clamp === "function", "clamp helper exists");
    // getYouTubeId
    console.assert(getYouTubeId("https://www.youtube.com/watch?v=abc123") === "abc123", "watch?v= failed");
    console.assert(getYouTubeId("https://youtu.be/xyz789") === "xyz789", "youtu.be failed");
    console.assert(getYouTubeId("https://www.youtube.com/shorts/QQ11WW22") === "QQ11WW22", "shorts failed");
    console.assert(getYouTubeId("https://www.youtube.com/embed/IDID") === "IDID", "embed failed");

    // parseCSV quoted commas
    const sample = 'Name,Desc\n"Alpha, Beta","Line one, line two"\nGamma,Plain';
    const parsed = parseCSV(sample);
    console.assert(parsed.rows.length === 2, "CSV rows length");
    console.assert(parsed.rows[0].Name === "Alpha, Beta", "CSV quoted field parse");
    console.assert(parsed.rows[0].Desc.includes("line two"), "CSV multi");

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
    console.assert(Array.isArray(MMM_ALBUMS) && MMM_ALBUMS.length === 4, "MMM albums configured");

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
            <Portfolio />
            <MMMGalleries />
            <FeaturedUniverse />
            <WorkWithMe currentService={currentService} onSetService={(n) => setCurrentService(n)} onBook={(svc) => goContactInline(svc)} onCalendarChange={setCalendarState} />
            <section className="py-6"><div className="max-w-7xl mx-auto px-6"><ContactInline calendarState={calendarState} /></div></section>
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
