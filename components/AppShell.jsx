import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Loader2,
  Mail,
  MessageSquare,
  Minimize2,
  Play,
  ShieldCheck,
  Sparkles,
  X,
  Shuffle,
  Calendar as CalendarIcon,
  Info,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Minimize2,
  Maximize2,
} from "lucide-react";

/**
 * Menelek Makonnen — Mothership (v11.2 — Canvas build)
 *
 * Fix: Resolved SyntaxError by repairing a corrupted section where getYouTubeId
 *      was overwritten with useCSV internals. Restored missing helpers
 *      (youtubeThumb, IG constants) and ensured all JSX blocks close.
 *      Also keeps previous feature work: axis alignment, single‑color CVC bar,
 *      hero showcase upgrades, and click‑to‑watch tiles.
*/

// ========= FACTUAL LINKS ========= //
const SOCIALS = {
  instagram: "https://instagram.com/menelek.makonnen",
  youtube: "https://youtube.com/@director_menelek",
  linkedin: "https://linkedin.com/in/menelekmakonnen",
  email: "mailto:admin@menelekmakonnen.com",
};

const LINKS = {
  loremakerSite: "https://menelekmakonnen.com/loremaker",
  icuniSite: "https://icuni.co.uk",
};

const N8N_BASE_URL = "https://mmmai.app.n8n.cloud";
const N8N_ENDPOINTS = {
  contact: ["/webhook/contact", "/webhook-test/contact"],
};

const MMM_REELS = {
  "Epic Edits": [
    "https://www.instagram.com/p/DMKpVGwoOC2/",
    "https://www.instagram.com/p/C7TX-jlqQFB/",
    "https://www.instagram.com/reel/C8rQp-kq5PG/",
    "https://www.instagram.com/reel/C8kNL16KIZc/",
    "https://www.instagram.com/reel/C8z0DAtKq8B/",
    "https://www.instagram.com/reel/DFPiXCOo220/",
    "https://www.instagram.com/reel/CIDASf-n6mv/",
  ],
  "Beauty & Travel": [
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
  BTS: [
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
  "AI & Learning": [
    "https://www.instagram.com/reel/DK1bY8couuK/",
    "https://www.instagram.com/reel/DK4gIZtNB-U/",
    "https://www.instagram.com/reel/DIvxSY9tQio/",
    "https://www.instagram.com/reel/DLAbo5mtbC2/",
    "https://www.instagram.com/reel/C5oZNM5KF77/",
    "https://www.instagram.com/reel/C5fciTUqXBR/",
    "https://www.instagram.com/reel/C5c74nYKdI2/",
    "https://www.instagram.com/reel/DMzghyEtXu1/",
  ],
};

const MAX_REELS_PER_BELT = 6;

const cn = (...classes) => classes.filter(Boolean).join(" ");

const randomSample = (list, limit) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(limit, copy.length));
};

async function postJSONWithFallback(paths, payload) {
  for (const path of paths) {
    try {
      const response = await fetch(`${N8N_BASE_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) continue;
      try {
        return await response.json();
      } catch (error) {
        return {};
      }
    } catch (error) {
      console.warn("Request failed", path, error);
    }
  }
  throw new Error("All endpoints failed");
}

const uniqueId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

function Button({ as: Cmp = "button", children, icon: Icon, href, onClick, className = "", target, rel, variant = "default", title }) {
  const palettes = {
    default: "bg-white/10 hover:bg-white/15",
    accent: "bg-gradient-to-tr from-cyan-300/30 via-fuchsia-500/30 to-amber-300/30 hover:from-cyan-300/40 hover:to-amber-300/40",
    ghost: "bg-white/5 hover:bg-white/10",
  }[variant];

  const base = cn(
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/15 text-white",
    "shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all",
    palette,
    className,
  );

  const contents = (
    <span className="inline-flex items-center gap-2">
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </span>
  );

  if (href) {
    return (
      <a href={href} className={base} onClick={onClick} {...rest}>
        {contents}
      </a>
    );
  }

  return (
    <button type={type} className={base} onClick={onClick} {...rest}>
      {contents}
    </button>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(111,66,193,0.18),transparent_60%),radial-gradient(1200px_600px_at_110%_120%,rgba(0,180,255,0.18),transparent_60%)]",
        "backdrop-blur-xl p-6 shadow-[0_15px_70px_rgba(0,0,0,0.45)] transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DiamondsCanvas({ className }) {
  const canvasRef = useRef(null);
  const rafRef = useRef();
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      console.debug("Diamonds canvas", canvas.offsetWidth, canvas.offsetHeight);
    };

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    const cell = 10;
    const rot = Math.PI / 4;
    const baseAlpha = 0.08;
    const auraR = 110;
    const size = 3.5;
    const baseGlow = 0.12;

    const draw = () => {
      const { width, height } = canvas;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#04060f");
      gradient.addColorStop(1, "#0b1224");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      const cell = 10;
      const size = 3.5;
      const baseAlpha = 0.08;
      const auraRadius = 110;

      ripplesRef.current = ripplesRef.current.map((ripple) => ({ ...ripple, t: ripple.t + 1 })).filter((ripple) => ripple.t < 240);
      const { x: mx, y: my } = mouseRef.current;

      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell / 2;
          const cy = y + cell / 2;
          const dx = cx - mx;
          const dy = cy - my;
          const hoverStrength = Math.max(0, 1 - Math.hypot(dx, dy) / auraRadius);

          let clickGlow = 0;
          for (const ripple of ripplesRef.current) {
            const progress = ripple.t / 240;
            const radius = 12 + progress * 320;
            const thickness = 18;
            const distance = Math.hypot(cx - ripple.x, cy - ripple.y);
            const ring = Math.max(0, 1 - Math.abs(distance - radius) / thickness);
            clickGlow = Math.max(clickGlow, ring * (1 - progress));
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);

          const a = Math.min(0.75, baseGlow + hoverK * 0.5 + clickGlow * 0.85);
          if (a > 0) {
            const grad = ctx.createRadialGradient(0, 0, 0.2, 0, 0, 10);
            grad.addColorStop(0, `rgba(255,255,255,${a})`);
            grad.addColorStop(1, `rgba(255,255,255,0)`);
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = radial;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.globalCompositeOperation = "source-over";
          }
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10 h-full w-full", className)} />;
}

function Hero({ onOpenLinks }) {
  const slides = useMemo(() =>
    PROJECTS.map((project) => ({
      id: project.id,
      title: project.title,
      caption: project.summary,
      credit: project.role,
      url: project.url,
      thumb: youtubeThumb(project.url),
    }))
  , []);

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goPrev = () => setIndex((value) => (value - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((value) => (value + 1) % slides.length);

// ========= HERO ========= //
function ShimmerTitle({ children }) {
  return (
    <motion.h1
      className="text-4xl sm:text-6xl font-extrabold leading-[1.05] select-none"
      style={{
        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.45), rgba(255,255,255,0.95))",
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        backgroundPosition: "0% 50%",
      }}
      whileHover={{ backgroundPosition: "100% 50%" }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.h1>
  );
}

function Hero({ onWatch, onOpenLinksModal }) {
  const slides = useMemo(
    () =>
      PROJECTS.slice(0, 4).map((project) => ({
        id: project.id,
        title: project.title,
        caption: project.summary,
        credit: `${project.role} • ${project.runtime}`,
        url: project.url,
        thumb: youtubeThumb(project.url),
      })),
    [],
  );

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setLoading(true);
  }, [index]);

  const goPrev = () => setIndex((value) => (value - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((value) => (value + 1) % slides.length);

  const slide = slides[index];

  const openSlide = () => {
    if (slide?.url) window.open(slide.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative pt-24 pb-14">
      <DiamondsCanvas className="opacity-90" />
      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <ShimmerTitle>Menelek Makonnen</ShimmerTitle>
          <div className="mt-2 text-xl text-white/85 select-none">
            <span className="group inline-block mr-2">
              <motion.span whileHover={{ letterSpacing: 2, scale: 1.02 }} className="transition-all">
                Worldbuilder.
              </motion.span>
              <span className="block h-[2px] w-0 bg-white/30 group-hover:w-full transition-all" />
            </span>
            <span className="group inline-block mr-2">
              <motion.span whileHover={{ rotate: -1.2, scale: 1.02 }} className="inline-flex items-center gap-1 transition-all">
                Filmmaker.
              </motion.span>
            </span>
            <span className="group inline-block">
              <motion.span whileHover={{ textShadow: "0 0 12px rgba(255,255,255,0.45)" }} className="transition-all">
                Storyteller.
              </motion.span>
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="accent" onClick={() => document.getElementById("featured-projects")?.scrollIntoView({ behavior: "smooth" })}>
              View My Work
            </Button>
            <Button onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>Get a Free Quote</Button>
            <Button onClick={onWatch} icon={Play} variant="ghost">
              Watch Reel
            </Button>
            <Button onClick={onOpenLinksModal} variant="ghost">
              All Links
            </Button>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Showcase</span>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{loading ? "Loading…" : `${index + 1}/${slides.length || 1}`}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  className="rounded-full bg-black/40 border border-white/25 p-1.5 hover:bg-black/60"
                  aria-label="Previous showcase"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goNext}
                  className="rounded-full bg-black/40 border border-white/25 p-1.5 hover:bg-black/60"
                  aria-label="Next showcase"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide?.id || index}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="relative h-full w-full"
              >
                {slide?.thumb ? (
                  <img
                    src={slide.thumb}
                    alt={slide?.title || "Project preview"}
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-black/40 text-white/70 text-sm">Loading showcase…</div>
                )}
                <button
                  onClick={openSlide}
                  className="absolute inset-0 grid place-items-center text-white/80 hover:text-white"
                  aria-label="Play project"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2">
                    <Play className="h-4 w-4" /> Watch
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-lg font-semibold">{slide?.title}</div>
            <p className="text-white/70 text-sm">{slide?.caption}</p>
            <div className="text-white/50 text-xs">{slide?.credit}</div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function SectionNav() {
  const items = [
    { id: "featured-projects", label: "Featured" },
    { id: "work", label: "Value Calculator" },
    { id: "galleries", label: "Galleries" },
    { id: "contact", label: "Contact" },
    { id: "blog", label: "Blog" },
  ];

  return (
    <nav className="sticky top-20 z-30 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full max-w-3xl mx-auto px-4 py-2 flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
          className="px-3 py-1.5 text-sm text-white/80 hover:text-white border border-white/10 rounded-full"
        >
          {item.label}
        </button>
      ))}
    </nav>
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
          <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide?.id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="relative h-full w-full"
              >
                {slide?.thumb ? (
                  <img
                    src={slide.thumb}
                    alt={slide?.title || "Project preview"}
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-black/40">Loading showcase…</div>
                )}
                <button
                  onClick={openVideo}
                  className="absolute inset-0 grid place-items-center text-white/80 hover:text-white"
                  aria-label="Play video"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-4 py-2">
                    <Play className="h-4 w-4" /> Watch
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 space-y-1">
            <div className="text-lg font-semibold">{slide?.title}</div>
            <p className="text-white/70 text-sm">{slide?.caption}</p>
            <div className="text-white/50 text-xs">{slide?.credit}</div>
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
    const handlerSubtype = (event) => {
      if (event.detail && event.detail.subtype !== undefined) {
        setForm((state) => ({ ...state, subtype: event.detail.subtype }));
      }
    };
    const handlerFit = (event) => {
      if (!event.detail) return;
      const { service, fit, budget, timeline } = event.detail;
      setForm((state) => ({
        ...state,
        subtype: service || state.subtype,
        fitScore: `${fit}%`,
        scope: `~£${budget.toLocaleString()} • ${timeline}w`,
      }));
    };
    window.addEventListener("prefill-subtype", handlerSubtype);
    window.addEventListener("prefill-fit", handlerFit);
    return () => {
      window.removeEventListener("prefill-subtype", handlerSubtype);
      window.removeEventListener("prefill-fit", handlerFit);
    };
  }, []);

  const [agree, setAgree] = useState(false);
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const submit = async () => {
    if (!agree) {
      setStatus({ type: "error", message: "Please agree to the Privacy Policy." });
      return;
    }
    if (!form.name || !form.email || !form.subtype || !form.message) {
      setStatus({ type: "error", message: "Name, email, service, and a short message are required." });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      await postJSONWithFallback(N8N_ENDPOINTS.contact, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.subtype == "Other" ? form.otherDetail || "Other" : form.subtype,
        otherDetail: form.otherDetail,
        message: form.message,
        fitScore: form.subtype == "Other" ? undefined : form.fitScore,
        recommendedTier: form.subtype == "Other" ? undefined : form.recTier,
        scope: form.subtype == "Other" ? undefined : form.scope,
        calendar: calendarState,
        source: "contact-inline",
      });
      setOk(true);
    } catch (error) {
      setStatus({ type: "error", message: "Could not send right now. Please try email instead." });
    } finally {
      setSending(false);
    }
  };

  const clear = () =>
    setForm({ name: "", email: "", phone: "", subtype: "", otherDetail: "", message: "", fitScore: "", recTier: "Starter", scope: "" });

  const choose = (subtype) => setForm((state) => ({ ...state, subtype }));
  const options = [...SERVICES.map((s) => s.name), "Other"];

  return (
    <Card id="contact-inline">
      <h3 className="text-xl font-semibold">Contact</h3>
      <div className="text-white/70 text-sm">
        Email: <a href={SOCIALS.email} className="underline">hello@menelekmakonnen.com</a>
      </div>
      <p className="text-white/70 text-sm mt-1">Prefer speed? Tap the quick note button bottom‑right and leave a short brief.</p>
      {!ok ? (
        <div className="grid gap-3 mt-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Select a service</label>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className={cn(
                    "px-3 py-1.5 rounded-full border",
                    form.subtype === option ? "bg-white/20 border-white/30" : "border-white/15 hover:bg-white/10",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {form.subtype === "Other" ? (
            <div>
              <label className="text-white/70 text-sm mb-1 block">Other service</label>
              <input
                value={form.otherDetail}
                onChange={(event) => setForm({ ...form, otherDetail: event.target.value })}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
              />
            </div>
          ) : null}

          {form.subtype !== "Other" ? (
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Fit Score %</label>
                <input
                  value={form.fitScore}
                  onChange={(event) => setForm({ ...form, fitScore: event.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
                />
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Recommended Package</label>
                <select
                  value={form.recTier}
                  onChange={(event) => setForm({ ...form, recTier: event.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full text-white"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  {["Starter", "Signature", "Cinema+"].map((option) => (
                    <option key={option} className="text-black">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-1 block">Budget • Timeline</label>
                <input
                  value={form.scope}
                  onChange={(event) => setForm({ ...form, scope: event.target.value })}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
                />
              </div>
            </div>
          ) : null}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Name *</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Phone</label>
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Service subtype (auto‑filled)</label>
              <input
                value={form.subtype}
                onChange={(event) => setForm({ ...form, subtype: event.target.value })}
                className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-white/70 text-sm mb-1 block">Project brief / goals *</label>
            <textarea
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              rows={4}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full"
            />
          </div>
          <label className="flex items-center gap-2 text-white/70">
            <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} /> I agree to the
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                alert("Privacy policy modal placeholder.");
              }}
              className="underline"
            >
              Privacy Policy
            </a>
            .
          </label>
          {status ? (
            <div
              className={cn(
                "rounded-xl px-3 py-2 text-sm",
                status.type === "error" ? "bg-rose-500/20 text-rose-200" : "bg-emerald-500/20 text-emerald-200",
              )}
            >
              {status.message}
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button onClick={submit} icon={sending ? Loader2 : ShieldCheck} className="disabled:opacity-70" disabled={sending}>
              {sending ? "Sending..." : "Send Inquiry"}
            </Button>
            <Button href={SOCIALS.email} icon={Mail} variant="ghost">
              Email Instead
            </Button>
            <Button onClick={clear} variant="ghost">
              Clear Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <div className="mt-2">Thanks — I’ll reply within 24–48h.</div>
        </div>
      )}
    </Card>
  );
}
// ========= Calculator (CVC) ========= //
function ValueCalculator({ service: serviceProp, onBook, onCalendarChange, randomizeKey }) {
  const [service, setService] = useState(serviceProp || SERVICES[0].name);
  useEffect(() => { if (serviceProp) setService(serviceProp); }, [serviceProp]);

  const [budget, setBudget] = useState(5000);
  const [ambition, setAmbition] = useState(7);
  const [projectDate, setProjectDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showSchedule, setShowSchedule] = useState(false);

  // total duration is the single source of truth
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
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const norm = (x, [min, max]) => clamp((x - min) / Math.max(1, max - min), 0, 1);

  const durationScoreFor = (svc, tot) => {
    const ideal = RULES[svc].durationIdeal;
    return norm(1 - Math.abs(tot - ideal) / ideal, [0, 1]);
  };

  const scoreFor = (svc, bgt, amb, tot) => {
    const rcfg = RULES[svc];
    const budgetScore = norm(bgt, rcfg.budgetRange);
    const ambitionScore = norm(amb, rcfg.ambitionIdeal);
    const durationScore = durationScoreFor(svc, tot);
    const raw = rcfg.weights.budget * budgetScore + rcfg.weights.ambition * ambitionScore + rcfg.weights.duration * durationScore;
    return Math.round(clamp(raw, 0, 1) * 100);
  };

  const budgetScore = norm(budget, cfg.budgetRange);
  const ambitionScore = norm(ambition, cfg.ambitionIdeal);
  const durationScore = durationScoreFor(service, total);
  const raw = cfg.weights.budget * budgetScore + cfg.weights.ambition * ambitionScore + cfg.weights.duration * durationScore;
  const score = Math.round(clamp(raw, 0, 1) * 100);

  // single color mapped to score: 0 (red) → 120 (green)
  const barColor = `hsl(${Math.round((score / 100) * 120)}, 85%, 55%)`;

  const coverage = budget / cfg.base;
  const suggestedTier = coverage < 0.85 ? "Starter" : coverage < 1.3 ? "Signature" : "Cinema+";
  const descriptor = score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : score >= 40 ? "Borderline" : "Not ideal";

  const SPLIT = [0.22, 0.33, 0.22, 0.23];
  const KEYS = ["development", "pre", "production", "post"];
  const LABELS = ["Development", "Pre‑Production", "Production", "Post‑Production"];

  const makeFSForTotal = (tWeeks) => {
    if (tWeeks <= 2) {
      const totalDays = Math.max(7, Math.round(tWeeks * 7));
      const raw = SPLIT.map((ratio) => Math.max(1, Math.round(totalDays * ratio)));
      const adjust = [...raw];
      let diff = adjust.reduce((sum, days) => sum + days, 0) - totalDays;
      while (diff !== 0) {
        for (let i = adjust.length - 1; i >= 0 && diff !== 0; i--) {
          if (diff > 0 && adjust[i] > 1) {
            adjust[i] -= 1;
            diff -= 1;
          } else if (diff < 0) {
            adjust[i] += 1;
            diff += 1;
          }
        }
      }
      const out = [];
      let startDays = 0;
      for (let i = 0; i < adjust.length; i++) {
        const days = adjust[i];
        out.push({ key: KEYS[i], label: LABELS[i], startDays, weeks: days / 7 });
        startDays += days;
      }
      return out;
    }

    const parts = SPLIT.map((ratio) => Math.max(0.5, Math.round(tWeeks * ratio * 2) / 2));
    const out = [];
    let startDays = 0;
    for (let i = 0; i < parts.length; i++) {
      const weeks = parts[i];
      out.push({ key: KEYS[i], label: LABELS[i], startDays, weeks });
      startDays += Math.ceil(weeks * 7);
    }
    return out;
  };

  const [phases, setPhases] = useState(() => makeFSForTotal(6));

  // When total changes, keep FS by default but respect user drags by clamping only
  useEffect(() => {
    setPhases((prev) => {
      if (total <= 2) return makeFSForTotal(total);
      const maxDays = total * 7;
      return prev.map((p) => {
        const weeks = Math.max(0.5, Math.min(26, p.weeks));
        let startDays = Math.min(Math.max(0, p.startDays), Math.max(0, maxDays - Math.ceil(weeks * 7)));
        return { ...p, weeks, startDays };
      });
    });
  }, [total]);

  // push calendar state up + prefill events
  useEffect(() => {
    onCalendarChange?.(buildCalendarStateOverlapping(phases, projectDate));
    window.dispatchEvent(new CustomEvent("prefill-fit", { detail: { service, fit: score, suggestedTier, budget, timeline: total } }));
    window.dispatchEvent(new CustomEvent("prefill-subtype", { detail: { subtype: service } }));
  }, [phases, projectDate, service, score, suggestedTier, budget, total]);

  // High‑fit randomizer
  useEffect(() => {
    if (randomizeKey === undefined) return;
    let best = { s: service, b: budget, a: ambition, t: total, score: -1 };
    for (let i = 0; i < 60; i++) {
      const svc = SERVICES[Math.floor(Math.random() * SERVICES.length)].name;
      const rcfg = RULES[svc];
      const bgt = Math.round((Math.random() * (rcfg.budgetRange[1] - rcfg.budgetRange[0]) + rcfg.budgetRange[0]) / 50) * 50;
      const amb = Math.floor(Math.random() * 5) + 6; // 6–10 bias
      const tot = Math.floor(Math.random() * 26) + 1; // 1–26 weeks
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

  const timelineSpanWeeks = (arr) => {
    if (!arr.length) return 0;
    const endDay = Math.max(...arr.map((p) => p.startDays + Math.ceil(p.weeks * 7)));
    return endDay / 7;
  };
  const totalSpanWeeks = timelineSpanWeeks(phases);
  const totalSpanLabel = totalSpanWeeks <= 2 ? `${Math.round(totalSpanWeeks * 7)} days` : `${totalSpanWeeks.toFixed(1)} weeks`;

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <div className="text-white/70 text-sm mb-1">Selected Service</div>
          <div className="px-3 py-2 rounded-xl border border-white/20 bg-white/10">{service}</div>
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-2">
            <span>Budget (£{budget.toLocaleString()})</span>
            <span title="Total resources you’re ready to invest across prep, shoot, and post.">
              <Info className="h-4 w-4 text-white/40" />
            </span>
          </div>
          <input
            aria-label="Budget"
            type="range"
            min={200}
            max={20000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-2">
            <span>Ambition ({ambition})</span>
            <span title="How cinematic the execution should feel—higher numbers mean more craft.">
              <Info className="h-4 w-4 text-white/40" />
            </span>
          </div>
          <input
            aria-label="Ambition"
            type="range"
            min={1}
            max={10}
            value={ambition}
            onChange={(e) => setAmbition(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1 flex items-center gap-2">
            <span>Proposed Project Start</span>
            <span title="When you’d like pre-production to begin.">
              <Info className="h-4 w-4 text-white/40" />
            </span>
          </div>
          <input
            aria-label="Project start"
            type="date"
            value={projectDate}
            onChange={(e) => setProjectDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10"
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-white/70 text-sm"><span>Fit Score</span><span>{descriptor}</span></div>
        <div className="rounded-2xl p-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/15">
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full" style={{ width: `${score}%`, background: barColor }} aria-label={`Fit score ${score}%`} />
          </div>
          <div className="text-white/75 text-sm mt-2">
            Recommended: <span className="font-semibold">{suggestedTier}</span> • Total Timeline: {totalSpanLabel}
          </div>
        </div>
      </div>
    );
  }, [showSchedule, timeline]);

      {!showSchedule ? (
        <div className="mt-4 text-white/65 text-sm">
          This scope assumes {LABELS.length} phases running sequentially. Open the scheduler to overlap or stretch milestones.
        </div>
      ) : (
        <TimelineGrid
          phases={phases}
          onChange={setPhases}
          total={total}
          onTotalChange={setTotal}
          startDate={projectDate}
        />
      )}

      <button
        type="button"
        onClick={() => setShowSchedule((value) => !value)}
        className="mt-3 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
      >
        {showSchedule ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        {showSchedule ? "Hide schedule" : "Customize schedule"}
      </button>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => onBook?.(service)} icon={Phone} variant="ghost">Book this Scope</Button>
      </div>
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

  // drag state: which phase, mode ("move" | "left" | "right")
  const dragRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const update = () => setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const clampPhase = (p) => {
    const maxStart = Math.max(0, totalDays - Math.ceil(p.weeks * 7));
    return { ...p, startDays: Math.min(Math.max(0, p.startDays), maxStart), weeks: Math.max(0.5, Math.min(26, p.weeks)) };
  };

  const pct = (days) => `${(days / totalDays) * 100}%`;

  const onPointerDown = (e, idx, mode) => {
    if (isTouch) return;
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
      next[d.idx].startDays = newStart; next[d.idx].weeks = newWeeks;
    }
    if (d.mode === "right") {
      const newWeeks = d.startWeeks + deltaDays / 7;
      next[d.idx].weeks = newWeeks;
    }
    onChange(next.map(clampPhase));
  };
  const onPointerUp = () => { dragRef.current = null; };

              <label className="block">
                <span className="flex items-center justify-between text-white/70 text-sm">
                  Budget (£{budget.toLocaleString()})
                  <Info className="h-4 w-4" title="Approximate production spend you have in mind." />
                </span>
                <input
                  type="range"
                  min={1000}
                  max={40000}
                  step={250}
                  value={budget}
                  onChange={(event) => setBudget(Number(event.target.value))}
                  className="w-full"
                />
              </label>

  // Axis mode: days for ≤2 weeks, week numbers otherwise
  const showDays = total <= 2;

  return (
    <div className="mt-6">
      {/* Separate header with Start/End line */}
      <div className="flex items-center justify-between text-white/80 text-sm mb-2">
        <div className="inline-flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Interactive Schedule</div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">Total duration</span>
          <input
            type="range"
            min={1}
            max={26}
            step={1}
            value={total}
            onChange={(e) => onTotalChange(parseInt(e.target.value, 10))}
          />
          <span className="text-white/70 text-xs">{total <= 2 ? `${total * 7} days` : `${total} wks`}</span>
        </div>
      </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-white/70 text-sm">
                  <span>Fit Score</span>
                  <span>{fitScore}% match</span>
                </div>
                <div className="mt-2 h-4 rounded-full bg-white/10">
                  <div
                    className={cn("absolute inset-0", !isTouch && "cursor-grab active:cursor-grabbing")}
                    onPointerDown={(e) => onPointerDown(e, idx, "move")}
                    title={isTouch ? "Schedule editing is desktop only" : "Drag to move"}
                  />
                  {/* left resize */}
                  <div
                    className={cn("absolute left-0 top-0 h-full w-3", !isTouch && "cursor-ew-resize")}
                    onPointerDown={(e) => onPointerDown(e, idx, "left")}
                    title={isTouch ? "Adjust on desktop for precision" : "Drag to adjust start"}
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/75" />
                  </div>
                  {/* right resize */}
                  <div
                    className={cn("absolute right-0 top-0 h-full w-3", !isTouch && "cursor-ew-resize")}
                    onPointerDown={(e) => onPointerDown(e, idx, "right")}
                    title={isTouch ? "Adjust on desktop for precision" : "Drag to adjust end"}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/75" />
                  </div>

                  {/* duration label */}
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="px-2 text-[11px] text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">
                      {total <= 2 ? `${Math.max(1, Math.round(p.weeks * 7))}d` : `${Math.round(p.weeks * 10) / 10}w`}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-white/70 text-sm">Recommended package: <span className="font-semibold">{suggestedTier}</span></div>
              </div>

        <div className="mt-2 text-white/65 text-xs">
          Default is <b>Finish‑to‑Start</b>. Drag edges to overlap phases. Bars snap by <b>day</b>. Days mode auto‑enables when total ≤ 2 weeks.
          {isTouch ? " Tip: use a desktop or trackpad to fine-tune overlaps on touch devices." : ""}
        </div>
      </div>
    </div>
  );
}

  return (
    <section id="contact" className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <Card>
          <h2 className="text-3xl font-bold">Start a Project</h2>
          <p className="mt-2 text-white/70">
            Ready for cinematic storytelling? Share a few details and I'll reply personally with next steps.
          </p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-white/70">
                Name *
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-white/70">
                Email *
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-white"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm text-white/70">
              Service Type
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              >
                {SERVICES.map((item) => (
                  <option key={item} value={item} className="text-black">
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-white/70">
              Message *
              <textarea
                value={message}
                rows={4}
                onChange={(event) => setMessage(event.target.value)}
                className="rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-white"
              />
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <Button type="submit" icon={sending ? Loader2 : ShieldCheck} disabled={sending}>
                {sending ? "Sending..." : "Send message"}
              </Button>
              <Button type="button" variant="ghost" icon={Mail} href="mailto:admin@menelekmakonnen.com">
                Email instead
              </Button>
            </div>
            {status ? (
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm",
                  status.type === "success" ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200",
                )}
              >
                {status.message}
              </div>
            ) : null}
          </form>
        </Card>
      </div>
    </section>
  );
}

function instagramEmbedSrc(url) {
  if (!url) return "";
  if (url.includes("/embed")) return url;
  return `${url.endsWith("/") ? url : `${url}/`}embed/`;
}


const LABEL_GRADIENTS = {
  "Epic Edits": "from-fuchsia-500/60 via-indigo-500/50 to-sky-500/60",
  "Beauty & Travel": "from-amber-400/60 via-rose-500/45 to-violet-500/55",
  BTS: "from-emerald-500/55 via-cyan-500/45 to-blue-600/55",
  "AI & Learning": "from-purple-500/60 via-blue-500/45 to-slate-900/80",
};

const MMMGalleries = memo(function MMMGalleries() {
  const [seed, setSeed] = useState(0);
  const [modal, setModal] = useState(null);
  const [manualPause, setManualPause] = useState(false);
  const [hovered, setHovered] = useState(null);

  const reels = useMemo(() => Object.entries(MMM_REELS).flatMap(([label, urls]) => urls.map((url) => ({ label, url }))), []);

  const picks = useMemo(() => {
    if (!reels.length) return [];
    const limit = Math.min(reels.length, MAX_REELS_PER_BELT * 2);
    return randomSample(reels, limit);
  }, [reels, seed]);

  const beltItems = useMemo(() => (picks.length ? [...picks, ...picks] : []), [picks]);
  const animationDuration = Math.max(60, beltItems.length * 8);
  const paused = manualPause || Boolean(hovered);

  const handleShuffle = () => {
    setManualPause(false);
    setHovered(null);
    setSeed((value) => value + 1);
  };

  return (
    <section id="galleries" className="py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">MMM Media Belt</h2>
            <p className="text-white/70">
              A single slow belt of reels spanning epic edits, beauty, BTS, travel, AI experiments, and learning drops.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={handleShuffle}
              className="px-3 py-1.5 text-xs border border-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              disabled={!reels.length}
            >
              Shuffle belt
            </button>
            <button
              type="button"
              onClick={() => setManualPause((value) => !value)}
              className="px-3 py-1.5 text-xs border border-white/20 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              {paused ? (
                <span className="inline-flex items-center gap-1"><Play className="h-3.5 w-3.5" /> Resume</span>
              ) : (
                <span className="inline-flex items-center gap-1"><Pause className="h-3.5 w-3.5" /> Pause</span>
              )}
            </button>
            <Button href={LINKS.mmmIG} target="_blank" rel="noreferrer" variant="ghost">
              @mm.m.media
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-4">
          <style>{`
            @keyframes mmm-marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          {beltItems.length ? (
            <div
              className="flex gap-6 w-max items-center"
              style={{
                animation: `mmm-marquee ${animationDuration}s linear infinite`,
                animationPlayState: paused ? "paused" : "running",
              }}
              onMouseLeave={() => setHovered(null)}
            >
              {beltItems.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  type="button"
                  onClick={() => setModal({ label: item.label, url: item.url })}
                  className={cn(
                    "relative aspect-[9/16] w-48 rounded-3xl border border-white/10 overflow-hidden transition-transform duration-500",
                    hovered && hovered !== item.url ? "scale-90 opacity-60" : "scale-100",
                    hovered === item.url ? "scale-110 z-10 shadow-[0_20px_45px_rgba(0,0,0,0.5)]" : "",
                  )}
                  onMouseEnter={() => setHovered(item.url)}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      LABEL_GRADIENTS[item.label] || "from-slate-600/60 via-slate-900/70 to-black/80",
                    )}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_55%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left text-xs text-white/85">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-white/70">Instagram reel preview</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm text-white/60">Unable to load Instagram previews right now.</div>
          )}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.label || "Reel"}>
        {modal ? (
          <div className="aspect-[9/16] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black">
            <iframe
              className="w-full h-full"
              src={instagramEmbedSrc(modal.url)}
              title={modal.label}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : null}
      </Modal>
    </section>
  );
});

function SocialProof() {
  const logos = ["Netflix", "BBC", "Spotify"];
  const quotes = [
    {
      quote: "Menelek understands the assignment faster than any director we've hired.",
      author: "Creative Director, Global Agency",
    },
    {
      quote: "The worlds he builds translate perfectly on screen and socials.",
      author: "Head of Content, Tech Startup",
    },
    {
      quote: "A rare blend of visionary storytelling and reliable delivery.",
      author: "Executive Producer, Streaming Network",
    },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setQuoteIndex((value) => (value + 1) % quotes.length), 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm uppercase tracking-[0.3em]">
          <span className="text-white/70">Trusted by</span>
          {logos.map((logo) => (
            <span key={logo} className="rounded-full border border-white/10 px-4 py-2">
              {logo}
            </span>
          ))}
        </div>
        <Card className="bg-white/5">
          <div className="text-lg text-white/90">“{quotes[quoteIndex].quote}”</div>
          <div className="mt-2 text-sm text-white/60">{quotes[quoteIndex].author}</div>
        </Card>
      </div>
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
    <section id="blog" className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Latest from the Blog</h2>
            <p className="text-white/70">Insights on storytelling craft, production process, and the evolving tech stack.</p>
          </div>
          <Button variant="ghost" href="https://menelekmakonnen.com/blog" target="_blank" rel="noopener noreferrer">
            View all
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <div className="text-lg font-semibold">{post.title}</div>
              <p className="mt-2 text-white/70 text-sm flex-1">{post.excerpt}</p>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-white/80 hover:text-white"
              >
                Read article <ExternalLink className="h-4 w-4" />
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterNav() {
  const items = [
    { id: "featured", label: "Featured" },
    { id: "calculator", label: "Value Calculator" },
    { id: "galleries", label: "Galleries" },
    { id: "contact", label: "Contact" },
    { id: "blog", label: "Blog" },
  ];

  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 py-1.5 text-sm text-white/70 hover:text-white border border-white/10 rounded-full"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="text-white/50 text-sm">
          © {new Date().getFullYear()} Menelek Makonnen. Crafted with intention in London.
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={cn(
        "fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm text-white/80 backdrop-blur",
        visible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp className="h-4 w-4" />
      Top
    </button>
  );
}

function ZaraChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: "welcome", from: "bot", text: "Hey there! I'm Zara. What brings you here today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimized]);

  useEffect(() => {
    postJSONWithFallback(CHATBOT_ENDPOINTS.track, {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: uniqueId(), from: "user", text }]);
    setLoading(true);
    try {
      const sessionId = (() => {
        if (typeof window === "undefined") return uniqueId();
        let existing = window.localStorage.getItem("zara-session");
        if (!existing) {
          existing = uniqueId();
          window.localStorage.setItem("zara-session", existing);
        }
        return existing;
      })();

      const response = await postJSONWithFallback(CHATBOT_ENDPOINTS.chatbot, {
        message: text,
        sessionId,
        timestamp: new Date().toISOString(),
      });
      const reply = response?.response || "I'm routing this to Menelek right now. Could you drop an email just in case?";
      setMessages((prev) => [...prev, { id: uniqueId(), from: "bot", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: uniqueId(),
          from: "bot",
          text: "I can't reach the studio right now, but email admin@menelekmakonnen.com and we'll reply asap.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Contact bubble */}
      <button
        onClick={onOpenContact}
        className="rounded-full p-3 bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
        title="Quick contact"
        aria-label="Contact"
      >
        <Mail className="h-5 w-5" />
      </button>
      {/* Back to top */}
    <div className="fixed right-5 bottom-20 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 w-80 overflow-hidden rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <div className="font-semibold text-white">Zara</div>
                <div className="text-xs text-white/60">Menelek's AI Assistant</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMinimized((value) => !value)} className="text-white/60 hover:text-white">
                  {minimized ? <MaximizeIcon /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {!minimized ? (
              <div className="flex h-96 flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                        message.from === "bot"
                          ? "bg-white/10 text-white/90"
                          : "ml-auto bg-gradient-to-tr from-cyan-500/60 to-fuchsia-500/60 text-white",
                      )}
                    >
                      {message.text}
                    </div>
                  ))}
                  {loading ? (
                    <div className="text-xs text-white/60">Zara is typing…</div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-2 border-t border-white/10 bg-black/60 px-4 py-3">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    className="flex-1 rounded-2xl border border-white/15 bg-black/60 px-3 py-2 text-sm text-white"
                    placeholder="Write a message..."
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          setOpen((value) => !value);
          setMinimized(false);
        }}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-sm text-white/80 backdrop-blur"
      >
        <MessageSquare className="h-4 w-4" />
        {open ? "Close" : "Chat with Zara"}
      </button>
    </div>
  );
}

function runSelfTests() {
  try {
    console.group("Self‑tests");
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

function LinksModal({ open, onClose }) {
  const links = [
    { label: "Instagram", href: SOCIALS.instagram },
    { label: "YouTube", href: SOCIALS.youtube },
    { label: "LinkedIn", href: SOCIALS.linkedin },
    { label: "Email", href: SOCIALS.email },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative z-10 mx-auto mt-24 max-w-md rounded-3xl border border-white/10 bg-black/70 p-6 text-white backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Connect with Menelek
              </h3>
              <button onClick={onClose} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AppShell({ children }) {
  const [linksOpen, setLinksOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#05070f] text-white">
      <DiamondsCanvas className="opacity-80" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-[0.3em] uppercase text-sm">Mothership</div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setLinksOpen(true)}>All Links</Button>
            <Button
              variant="accent"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start a Project
            </Button>
          </div>
        </div>
      </header>

      <main>
        {route === "home" && (
          <>
            <Hero onWatch={() => setReelOpen(true)} onOpenLinksModal={() => setLinksOpen(true)} />
            <SectionNav />
            <SocialProof />
            <Portfolio />
            <MMMGalleries />
            <WorkWithMe
              currentService={currentService}
              onSetService={(n) => setCurrentService(n)}
              onBook={(svc) => goContactInline(svc)}
              onCalendarChange={setCalendarState}
            />
            <section id="contact" className="py-6">
              <div className="max-w-7xl mx-auto px-6">
                <ContactInline calendarState={calendarState} />
              </div>
            </section>
            <Blog />
          </>
        )}
        {route === "bio" && <Biography />}
        {route === "blog" && <Blog />}
        <Hero onOpenLinks={() => setLinksOpen(true)} />
        <SectionNav />
        <SocialProof />
        <FeaturedPortfolio />
        <ValueCalculator />
        <MMMGalleries />
        <ContactForm />
        <BlogRoll />
        {children}
      </main>

      <FooterNav />
      <BackToTop />
      <ZaraChatbot />
      <LinksModal open={linksOpen} onClose={() => setLinksOpen(false)} />
    </div>
  );
}

function SocialProof() {
  const logos = ["Netflix", "BBC", "Spotify"];
  const quotes = [
    {
      quote: "Menelek understands the assignment faster than any director we've hired.",
      author: "Creative Director, Global Agency",
    },
    {
      quote: "The worlds he builds translate perfectly on screen and socials.",
      author: "Head of Content, Tech Startup",
    },
    {
      quote: "A rare blend of visionary storytelling and reliable delivery.",
      author: "Executive Producer, Streaming Network",
    },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setQuoteIndex((value) => (value + 1) % quotes.length), 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm uppercase tracking-[0.3em]">
          <span className="text-white/70">Trusted by</span>
          {logos.map((logo) => (
            <span key={logo} className="rounded-full border border-white/10 px-4 py-2">
              {logo}
            </span>
          ))}
        </div>
        <Card className="bg-white/5">
          <div className="text-lg text-white/90">“{quotes[quoteIndex].quote}”</div>
          <div className="mt-2 text-sm text-white/60">{quotes[quoteIndex].author}</div>
        </Card>
      </div>
    </section>
  );
}

export default AppShell;
