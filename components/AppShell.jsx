import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  useId,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pause,
  Minimize2,
  Maximize2,
  Menu,
  Gem,
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
  personalYouTube: "https://www.youtube.com/@menelekmakonnen",
  directorYouTube: "https://www.youtube.com/@director_menelek",
  personalIG: "https://www.instagram.com/menelek.makonnen/",
  loremakerIG: "https://www.instagram.com/lore.maker_",
  icuniIG: "https://www.instagram.com/icuni_",
  mmmIG: "https://www.instagram.com/mm.m.media/",
  aiIG: "https://www.instagram.com/mr.mikaelgabriel/",
  personalLI: "https://www.linkedin.com/in/menelekmakonnen/",
  businessLI: "https://www.linkedin.com/in/mikaelgabriel/",
  loremakerSite: "https://loremaker.cloud",
  starterclassSite: "https://starterclass.icuni.org",
  oldBlog: "https://wordpress.com/mikaelgabriel",
};

const N8N_BASE_URL = "https://mmmai.app.n8n.cloud";
const N8N_ENDPOINTS = {
  contact: ["/webhook/contact", "/webhook-test/contact"],
};

const VERONICA_WEBHOOK = {
  production: "https://ainerd.app.n8n.cloud/webhook/veronica-chat",
  test: "https://ainerd.app.n8n.cloud/webhook-test/veronica-chat",
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

const MAX_REELS_PER_BELT = 4;

const ExperienceContext = createContext({ liteMode: true, toggleLiteMode: () => {} });
const useExperience = () => useContext(ExperienceContext);

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");

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

function Button({
  as: Cmp = "button",
  children,
  icon: Icon,
  href,
  onClick,
  className = "",
  target,
  rel,
  variant = "default",
  title,
  ...rest
}) {
  const { liteMode } = useExperience();
  const palettes = {
    default: "bg-white/10 hover:bg-white/15",
    ghost: "bg-white/5 hover:bg-white/10",
    accent: "bg-gradient-to-tr from-amber-400/20 to-fuchsia-400/20 hover:from-amber-400/25 hover:to-fuchsia-400/25",
  };
  const base = cn(
    "px-4 py-2.5 rounded-xl border border-white/15 text-white",
    "shadow-[0_10px_30px_rgba(0,0,0,0.25)] active:translate-y-px backdrop-blur transition-all",
    palettes[variant],
    className
  );
  const computedComponent = href ? "a" : Cmp;
  const MotionCmp = useMemo(() => motion(computedComponent), [computedComponent]);
  const inner = (
    <span className="inline-flex items-center gap-2">
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </span>
  );
  const motionProps = {};
  if (computedComponent === "button" && rest?.type === undefined) motionProps.type = "button";

  const componentProps = {
    onClick,
    className: base,
    title,
    ...motionProps,
    ...rest,
  };

  if (liteMode) {
    componentProps.initial = false;
    componentProps.whileHover = { scale: 1.01 };
    componentProps.whileTap = { scale: 0.99 };
    componentProps.transition = { duration: 0.18 };
  } else {
    componentProps.initial = { opacity: 0, y: 16 };
    componentProps.whileInView = { opacity: 1, y: 0 };
    componentProps.whileHover = { scale: 1.03, y: -2 };
    componentProps.whileTap = { scale: 0.97 };
    componentProps.viewport = { amount: 0.6, once: false };
    componentProps.transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] };
  }

  if (href) componentProps.href = href;
  if (target) componentProps.target = target;
  if (rel) componentProps.rel = rel;

  return <MotionCmp {...componentProps}>{inner}</MotionCmp>;
}

function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_12px_50px_rgba(0,0,0,0.35)] p-5 transition-transform hover:-translate-y-[2px]",
        className
      )}
      {...rest}
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
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            className={cn(
              "relative z-10 mx-auto mt-[8vh] w-[92vw] max-w-5xl",
              "rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 text-white"
            )}
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

function RevealOnScroll({ as: Component = "section", className = "", children, delay = 0, persist = false, ...rest }) {
  const { liteMode } = useExperience();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px", amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView) {
      setHasAnimated(true);
    }
  }, [inView]);

  const shouldAnimate = !liteMode;
  const targetVisible = shouldAnimate ? (persist ? inView || hasAnimated : inView || hasAnimated) : true;

  return (
    <Component ref={ref} className={className} {...rest}>
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 80, scale: 0.96 } : false}
        animate={targetVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 80, scale: 0.96 }}
        transition={shouldAnimate ? { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } : { duration: 0.25, delay: 0 }}
      >
        {children}
      </motion.div>
    </Component>
  );
}

// ========= BACKGROUND ========= //
function DiamondsCanvas({ className }) {
  const { liteMode } = useExperience();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const ripplesRef = useRef([]);

  useEffect(() => {
    if (liteMode) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const scale = () => {
      const dpr = window.devicePixelRatio || 1;
      const { offsetWidth, offsetHeight } = canvas;
      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripplesRef.current.push({ x, y, t: 0 });
    };

    scale();

    const cell = 14;
    const rot = Math.PI / 4;
    const baseAlpha = 0.06;
    const auraR = 90;
    const size = 3;
    const baseGlow = 0.1;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#03050a");
      g.addColorStop(1, "#070a12");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ripplesRef.current = ripplesRef.current.map((r) => ({ ...r, t: r.t + 1 })).filter((r) => r.t < 300);

      const { x: mx, y: my } = mouseRef.current;

      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell / 2;
          const cy = y + cell / 2;

          const dxh = cx - mx;
          const dyh = cy - my;
          const distHover = Math.hypot(dxh, dyh);
          const hoverK = Math.max(0, 1 - distHover / auraR);

          let clickGlow = 0;
          for (const r of ripplesRef.current) {
            const k = r.t / 300;
            const radius = 14 + k * 340; // expands
            const thickness = 16;
            const dxc = cx - r.x;
            const dyc = cy - r.y;
            const d = Math.hypot(dxc, dyc);
            const ring = Math.max(0, 1 - Math.abs(d - radius) / thickness);
            clickGlow = Math.max(clickGlow, ring * (1 - k));
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);

          const a = Math.min(0.75, baseGlow + hoverK * 0.5 + clickGlow * 0.85);
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
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, [liteMode]);

  if (liteMode) {
    return (
      <div
        className={cn(
          "absolute inset-0 -z-10 h-full w-full",
          "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]",
          className
        )}
        aria-hidden="true"
      />
    );
  }

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
  { id: "im-alright", title: "I'm Alright (2024)", role: "Directed by Menelek", runtime: "8 min", summary: "Addiction & depression inside a lockdown flat.", url: "https://www.youtube.com/watch?v=A8cGpNe2JAE" },
  { id: "blinded-by-magic", title: "Blinded by Magic (2022)", role: "Directed by Menelek", runtime: "12 min", summary: "A possessed camera blinds its user while granting powers.", url: "https://www.youtube.com/watch?v=ivsCBuD1JYQ" },
  { id: "heroes-gods", title: "Heroes & Gods (2024)", role: "Directed by Menelek", runtime: "120 min", summary: "Anthology stitched into a feature — heroes vs vengeful goddess & twin.", url: "https://www.youtube.com/watch?v=jtiOv0OvD-0" },
  { id: "spar-bts", title: "SPAR (Doc, 2024)", role: "Directed by Menelek", runtime: "14 min", summary: "BTS doc for a boxing pilot in London — Left Hook Gym.", url: "https://www.youtube.com/watch?v=4q6X6prhVOE" },
  { id: "soldier-mv", title: "Soldier (Music Video)", role: "Directed by Menelek", runtime: "3 min", summary: "Concept-to-delivery music video including cover art.", url: "https://www.youtube.com/watch?v=BHPaJieCAXY" },
  { id: "abranteers", title: "Abranteers (Proof, 2023)", role: "Directed by Menelek", runtime: "9 min", summary: "Anti-magic veteran + rookie vs a dangerous magic user.", url: "https://www.youtube.com/shorts/CPPkq5zsXgE" },
];

const NOVEL = {
  id: "ochiyamie",
  title: "The Last Ochiyamie",
  subtitle: "A Legacy Novel",
  role: "Author",
  runtime: "Novel",
  summary: "An Afro-fantasy epic following the last warrior of a fallen kingdom.",
  url: "https://www.amazon.com/Ochiyamie-Legacy-Mikael-MM-Gabriel-ebook/dp/B0CD331HNX",
  thumb: "https://m.media-amazon.com/images/I/71xJ8z0ZXML._SL1000_.jpg"
};

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

function Hero({ onOpenLinksModal }) {
  const { liteMode, toggleLiteMode } = useExperience();
  const slides = useMemo(
    () => [
      {
        id: NOVEL.id,
        title: NOVEL.title,
        caption: NOVEL.summary,
        credit: `${NOVEL.role} • ${NOVEL.runtime}`,
        url: NOVEL.url,
        thumb: NOVEL.thumb,
        isNovel: true,
      },
      ...PROJECTS.slice(0, 3).map((project) => ({
        id: project.id,
        title: project.title,
        caption: project.summary,
        credit: `${project.role} • ${project.runtime}`,
        url: project.url,
        thumb: project.thumb || youtubeThumb(project.url),
        isNovel: false,
      })),
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!slides.length || isPaused) return undefined;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 8000); // Auto-change every 8 seconds
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  useEffect(() => {
    setLoading(true);
  }, [index]);

  // Don't pause based on lite mode anymore - always auto-play
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const goPrev = useCallback(() => {
    setIndex((value) => (value - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => {
    setIndex((value) => (value + 1) % slides.length);
  }, [slides.length]);

  const slide = slides[index];

  const openSlide = useCallback(() => {
    if (slide?.url) {
      window.open(slide.url, "_blank", "noopener,noreferrer");
    }
  }, [slide]);

  const showcaseLabel = "Showcase";

  return (
    <RevealOnScroll as="section" className="relative pt-24 pb-14">
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
                Storyteller.
              </motion.span>
            </span>
            <span className="group inline-block">
              <motion.span whileHover={{ textShadow: "0 0 18px rgba(255,255,255,0.55)", scale: 1.03 }} className="transition-all">
                AI Innovator.
              </motion.span>
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="accent" onClick={() => document.getElementById("featured-projects")?.scrollIntoView({ behavior: "smooth" })}>
              View My Work
            </Button>
            <Button onClick={onOpenLinksModal} variant="ghost">
              All Links
            </Button>
          </div>
        </div>
        <Card
          className="relative overflow-hidden !bg-white/[0.03] !border-white/12 !shadow-[0_12px_36px_rgba(10,10,30,0.28)]"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-white/70">
            <span>{showcaseLabel}</span>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{loading ? "Loading…" : `${index + 1}/${slides.length || 1}`}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  className="rounded-full bg-white/10 border border-white/20 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
                  aria-label="Previous showcase"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goNext}
                  className="rounded-full bg-white/10 border border-white/20 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
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
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                {slide?.thumb ? (
                  <img
                    src={slide.thumb}
                    alt={slide?.title || "Project preview"}
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center bg-black/40 text-white/70 text-sm">Loading showcase…</div>
                )}
                <button
                  onClick={openSlide}
                  className="absolute inset-0 grid place-items-center text-white/80 hover:text-white"
                  aria-label={slide?.isNovel ? "Read novel" : "Play project"}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2">
                    {slide?.isNovel ? (
                      <>
                        <ExternalLink className="h-4 w-4" /> Read
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Watch
                      </>
                    )}
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
    </RevealOnScroll>
  );
}

function SectionNav() {
  const items = [
    { id: "featured-projects", label: "Films" },
    { id: "galleries", label: "Galleries" },
    { id: "ai-showcase", label: "AI Showcase" },
  ];

  return (
    <RevealOnScroll
      as="nav"
      className="sticky top-20 z-30 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full max-w-3xl mx-auto px-4 py-2 flex flex-wrap justify-center gap-2"
      delay={0.1}
      persist
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
          className="px-3 py-1.5 text-sm text-white/80 hover:text-white border border-white/10 rounded-full"
        >
          {item.label}
        </button>
      ))}
    </RevealOnScroll>
  );
}

// ========= Work with Me ========= //
function WorkWithMe({ currentService, onSetService, onBook, onCalendarChange }) {
  const [randomKey, setRandomKey] = useState(0);
  return (
    <RevealOnScroll as="section" className="py-12" id="work" delay={0.2} persist>
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
    </RevealOnScroll>
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
  const vibrateOnce = useCallback(() => {
    if (typeof window === "undefined") return;
    const { navigator } = window;
    if (navigator?.vibrate) navigator.vibrate(18);
  }, []);

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
        const minWeeks = total <= 2 ? 1 / 7 : 0.5;
        const weeks = Math.max(minWeeks, Math.min(26, p.weeks));
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
        onClick={() =>
          setShowSchedule((value) => {
            const next = !value;
            if (!value && next) vibrateOnce();
            return next;
          })
        }
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
    const minWeeks = total <= 2 ? 1 / 7 : 0.5;
    return {
      ...p,
      startDays: Math.min(Math.max(0, p.startDays), maxStart),
      weeks: Math.max(minWeeks, Math.min(26, p.weeks)),
    };
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

  const cal = buildCalendarStateOverlapping(phases, startDate);

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

      {/* Start / End inline, separate from the lane grid */}
      <div className="text-[12px] text-white/60 mb-1 flex justify-between"><span>Start: {cal.start}</span><span>End: {cal.end}</span></div>

      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* X‑axis header aligned with the lanes */}
        <div className="mb-2 flex items-center gap-3">
          {/* left spacer equal to phase label column */}
          <div className="w-40 shrink-0" />
          <div ref={containerRef} className="relative h-6 flex-1 select-none">
            {/* grid columns per day */}
            <div
              className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]"
              style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }}
            />
            {/* labels aligned from 0 to totalDays */}
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

        {/* Y‑axis phases with draggable bars (overlap allowed after user edits) */}
        <div className="space-y-3" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          {phases.map((p, idx) => (
            <div key={p.key} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-[13px] text-white/80">{p.label}</div>
              <div className="relative h-9 flex-1">
                {/* grid background same as header for visual alignment */}
                <div
                  className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]"
                  style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }}
                />
                {/* bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-7 rounded-xl border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                  style={{ left: pct(p.startDays), width: pct(Math.ceil(p.weeks * 7)) }}
                >
                  {/* move handle (center) */}
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
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-white/65 text-xs">
          Default is <b>Finish‑to‑Start</b>. Drag edges to overlap phases. Bars snap by <b>day</b>. Days mode auto‑enables when total ≤ 2 weeks.
          {isTouch ? " Tip: use a desktop or trackpad to fine-tune overlaps on touch devices." : ""}
        </div>
      </div>
    </div>
  );
}

// ========= Portfolio ========= //
function Portfolio() {
  const [modal, setModal] = useState(null);
  return (
    <RevealOnScroll as="section" className="py-12" id="featured-projects" delay={0.15}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-1">
          <h2 className="text-2xl sm:text-3xl font-bold">Films</h2>
          <span className="text-white/70 text-sm">Proof of craft, proof of results</span>
        </div>
        <p className="text-white/75 max-w-2xl mb-4">Every frame serves story and strategy. Click a tile to watch or skim the case notes.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => {
            const thumbUrl = p.thumb || youtubeThumb(p.url);
            const isNovel = p.id === "ochiyamie";
            return (
              <Card key={p.id}>
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/45 border border-white/10 group cursor-pointer" onClick={() => setModal({ type: isNovel ? "case" : "watch", p })} title={isNovel ? "Learn more" : "Watch now"}>
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transform scale-[1.08] group-hover:scale-[1.2] transition-transform"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-white/60">Poster / Stills</div>
                  )}
                </div>
                <div className="mt-3 font-semibold">{p.title}</div>
                <div className="text-white/70 text-sm">{p.role} • {p.runtime}</div>
                <p className="mt-2 text-white/80">{p.summary}</p>
                <div className="mt-4 flex gap-2">
                  {isNovel ? (
                    <Button href={p.url} icon={ExternalLink} target="_blank" rel="noreferrer">View on Amazon</Button>
                  ) : (
                    <>
                      <Button onClick={() => setModal({ type: "watch", p })} icon={Play}>Watch</Button>
                      <Button onClick={() => setModal({ type: "case", p })} className="bg-white/10" icon={ExternalLink}>Case Study</Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
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
                loading="lazy"
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
    </RevealOnScroll>
  );
}

function instagramEmbedSrc(url) {
  if (!url) return "";
  if (url.includes("/embed")) return url;
  return `${url.endsWith("/") ? url : `${url}/`}embed/`;
}

function instagramThumbnail(url) {
  if (!url) return null;
  // Extract the post code from Instagram URL
  const match = url.match(/instagram\.com\/(p|reel)\/([^/?]+)/);
  if (!match) return null;
  const code = match[2];
  // Use Instagram's oEmbed API approach - more reliable
  // Note: This may require CORS proxy in production, but works for initial load
  return `https://instagram.com/p/${code}/media/?size=l`;
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
  const [scrollX, setScrollX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { liteMode } = useExperience();
  const containerRef = useRef(null);

  const reels = useMemo(() => Object.entries(MMM_REELS).flatMap(([label, urls]) => urls.map((url) => ({ label, url }))), []);

  const picks = useMemo(() => {
    if (!reels.length) return [];
    const limit = Math.min(reels.length, MAX_REELS_PER_BELT * 2);
    return randomSample(reels, limit);
  }, [reels, seed]);

  const beltItems = useMemo(() => (picks.length ? [...picks, ...picks] : []), [picks]);
  const animationDuration = Math.max(60, beltItems.length * 8);
  const paused = manualPause || Boolean(hovered) || isDragging;
  const marqueePaused = paused || liteMode;
  const isEffectivelyPaused = marqueePaused;

  const handleShuffle = () => {
    setManualPause(false);
    setHovered(null);
    setScrollX(0);
    setSeed((value) => value + 1);
  };

  return (
    <RevealOnScroll as="section" id="galleries" className="py-16" delay={0.25}>
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
              className={cn(
                "px-3 py-1.5 text-xs border border-white/20 rounded-full text-white/70",
                "hover:text-white hover:bg-white/10",
                liteMode && "opacity-60 cursor-not-allowed hover:bg-transparent hover:text-white/70",
              )}
              disabled={liteMode}
            >
              {isEffectivelyPaused ? (
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

        <div
          ref={containerRef}
          className="relative overflow-x-scroll overflow-y-hidden rounded-3xl border border-white/15 bg-white/5 p-4 scrollbar-hide"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            @keyframes mmm-marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          {beltItems.length ? (
            <motion.div
              className="flex gap-6 w-max items-center"
              style={{
                animation: isDragging ? 'none' : `mmm-marquee ${animationDuration}s linear infinite`,
                animationPlayState: marqueePaused ? "paused" : "running",
              }}
              drag="x"
              dragConstraints={containerRef}
              dragElastic={0.05}
              dragMomentum={true}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                setIsDragging(false);
              }}
              onMouseLeave={() => setHovered(null)}
            >
              {beltItems.map((item, index) => {
                const thumbUrl = instagramThumbnail(item.url);
                return (
                  <button
                    key={`${item.url}-${index}`}
                    type="button"
                    onClick={(e) => {
                      if (!isDragging) setModal({ label: item.label, url: item.url });
                    }}
                    className={cn(
                      "relative aspect-[9/16] w-48 rounded-3xl border border-white/10 overflow-hidden transition-transform duration-500 select-none",
                      hovered && hovered !== item.url ? "scale-90 opacity-60" : "scale-100",
                      hovered === item.url ? "scale-110 z-10 shadow-[0_20px_45px_rgba(0,0,0,0.5)]" : "",
                    )}
                    onMouseEnter={() => !isDragging && setHovered(item.url)}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={item.label}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        LABEL_GRADIENTS[item.label] || "from-slate-600/60 via-slate-900/70 to-black/80",
                      )}
                      style={{ zIndex: thumbUrl ? -1 : 0 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] text-white/80 border border-white/15 backdrop-blur-sm">
                        <Gem className="h-3.5 w-3.5" /> Tap to view
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-left text-xs text-white/85">
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-white/70">Instagram reel</div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
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
    </RevealOnScroll>
  );
});

function SocialProof() {
  const logos = ["Creatives", "Professionals", "Filmmakers"];
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
  const { liteMode } = useExperience();

  useEffect(() => {
    if (liteMode) {
      setQuoteIndex(0);
      return undefined;
    }
    const timer = setInterval(() => setQuoteIndex((value) => (value + 1) % quotes.length), 6000);
    return () => clearInterval(timer);
  }, [quotes.length, liteMode]);

  return (
    <RevealOnScroll as="section" className="py-10" delay={0.1}>
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
    </RevealOnScroll>
  );
}

// ========= Blog ========= //
function AIShowcase() {
  const AI_PROJECTS = [
    {
      id: "ai-films",
      title: "AI Films",
      description: "Using AI to assist my production process from ideation through image generation, image-to-video, and post-production—all with AI or heavily assisted by it.",
      gradient: "from-violet-500/60 via-fuchsia-500/50 to-pink-500/55",
      icon: "🎬",
    },
    {
      id: "starterclass",
      title: "AI Starterclass",
      description: "Interactive course teaching AI fundamentals with hands-on projects and real-world applications.",
      url: "https://starterclass.icuni.org/",
      gradient: "from-purple-500/60 via-blue-500/45 to-cyan-500/55",
      icon: "🎓",
    },
    {
      id: "vibe-coding",
      title: "Vibe Coding Sites",
      description: "Built this website, the Starterclass site, and Loremaker with AI-assisted workflows—combining aesthetic vision with intelligent automation.",
      gradient: "from-fuchsia-500/60 via-rose-500/50 to-amber-500/60",
      icon: "💻",
    },
    {
      id: "n8n-workflows",
      title: "N8N Workflows",
      description: "My AI chatbots have memorable personalities and bounce off each other while solving my problems like real people. Built with N8N automation.",
      gradient: "from-emerald-500/55 via-teal-500/45 to-blue-500/55",
      icon: "🤖",
    },
  ];

  return (
    <RevealOnScroll as="section" className="py-12" id="ai-showcase" delay={0.28}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold">AI Showcase</h2>
        <p className="text-white/75 mt-2">AI expertise meets creative vision—interactive tools, intelligent workflows, and beautiful code.</p>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {AI_PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`h-full bg-gradient-to-br ${project.gradient} !bg-opacity-10 border-2 hover:border-white/30 transition-all cursor-pointer`}>
                <div className="text-5xl mb-4">{project.icon}</div>
                <div className="font-bold text-xl mb-2">{project.title}</div>
                <p className="text-white/80 mb-4">{project.description}</p>
                {project.url && (
                  <Button href={project.url} target="_blank" rel="noreferrer" icon={ExternalLink} variant="accent" className="w-full justify-center">
                    Explore
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}

// ========= Biography ========= //
function Biography() {
  return (
    <RevealOnScroll as="section" className="py-12" delay={0.18}>
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Biography</h2>
        <Card className="mt-4 space-y-3">
          <p className="text-white/85">I’m a director and worldbuilder focused on audience retention and emotional payoff. I grew up on DC’s mythic weight and the MCU’s long‑arc engineering, so my work blends spectacle, clarity, and continuity. I’m building the Loremaker Universe—Afro‑mythic superheroes, supernatural intrigue, and grounded human stakes.</p>
          <p className="text-white/80">My lane: commercials, short films, music videos, documentaries, and AI‑assisted storytelling pipelines. I write treatments that sell, run lean crews, and deliver clean masters for multi‑platform delivery. I’m as comfortable arguing for a lens choice as I am for a marketing hook.</p>
          <p className="text-white/80">Philosophy: style serves structure. If the audience doesn’t feel something, the frame’s a screensaver. I prioritize performance direction, visual clarity, and schedules that respect people’s time. Tools are welcome—taste is mandatory.</p>
          <p className="text-white/80">Highlights include <em>Heroes & Gods</em> (feature‑length anthology), <em>Blinded by Magic</em>, <em>Abranteers</em>, and the boxing pilot doc <em>SPAR</em>. Beyond set life, I design pipelines for brands to publish consistently without losing voice.</p>
        </Card>
      </div>
    </RevealOnScroll>
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
            <Button href={LINKS.starterclassSite} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">AI Starterclass</Button>
            <Button href={LINKS.oldBlog} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">Old Blog</Button>
          </div>
        </Card>
      </div>
    </Modal>
  );
}

// ========= App Shell ========= //
function LogoMark() {
  const gradientId = useId();
  const bgId = `${gradientId}-bg`;
  const glowId = `${gradientId}-glow`;
  return (
    <motion.div
      className="relative h-9 w-9 grid place-items-center"
      initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg viewBox="0 0 64 64" className="h-9 w-9 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
          </linearGradient>
          <radialGradient id={glowId} cx="0.5" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <rect x="10" y="10" width="44" height="44" rx="12" fill="rgba(6,9,20,0.7)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <rect x="8" y="8" width="48" height="48" rx="16" transform="rotate(45 32 32)" fill={`url(#${bgId})`} opacity="0.22" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <circle cx="32" cy="28" r="18" fill={`url(#${glowId})`} opacity="0.6" />
        <text x="32" y="39" textAnchor="middle" fontSize="21" fill="#ffffff" style={{ fontWeight: 800, letterSpacing: 1.5 }}>
          MM
        </text>
      </svg>
    </motion.div>
  );
}

const MENU = [
  { key: "home", label: "Home" },
  { key: "ai-tools", label: "AI Tools" },
  { key: "bio", label: "Biography" },
  { key: "ai", label: "AI Starterclass" }, // external link
  { key: "loremaker", label: "Loremaker" }, // external link
];

function FloatingButtons({ onOpenContact }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full p-3 bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========= VERONICA CHATBOT ========= //
function VeronicaChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm Veronica, Menelek's AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Try production webhook first
      let response;
      try {
        response = await fetch(VERONICA_WEBHOOK.production, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content }),
        });
      } catch (err) {
        // Fallback to test webhook
        console.warn("Production webhook failed, trying test webhook:", err);
        response = await fetch(VERONICA_WEBHOOK.test, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.content }),
        });
      }

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.response || data.message || "I apologize, but I couldn't process that request. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment or contact Menelek directly.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[600px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(217,70,239,0.15) 50%, rgba(251,113,133,0.15) 100%)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="relative h-20 border-b border-white/10 flex items-center justify-between px-6"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(217,70,239,0.3) 50%, rgba(251,113,133,0.3) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400 flex items-center justify-center text-2xl">
              💎
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-black/50" />
          </div>
          <div>
            <div className="font-semibold text-white text-lg">Veronica</div>
            <div className="text-white/70 text-xs">AI Assistant</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5 text-white/80" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-[calc(100%-160px)] overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-xs mt-1 ${msg.role === "user" ? "text-white/70" : "text-white/50"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 h-20 border-t border-white/10 px-4 py-3 bg-black/40 backdrop-blur">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-violet-400/50 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send"}
          </button>
        </div>
      </div>
    </motion.div>
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

    // extra test: ensure pct math stays consistent
    console.assert(typeof youtubeThumb(PROJECTS[0].url) === "string", "thumb returns string");

    console.groupEnd();
  } catch (e) {
    console.warn("Self‑tests error:", e);
  }
}

export default function AppShell() {
  const [route, setRoute] = useState("home");
  const [liteMode, setLiteMode] = useState(true);
  const [linksOpen, setLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [veronicaOpen, setVeronicaOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);
  const [currentService, setCurrentService] = useState(SERVICES[0].name);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLiteMode = useCallback(() => setLiteMode((value) => !value), []);

  const prefillSubtype = (name) => window.dispatchEvent(new CustomEvent("prefill-subtype", { detail: { subtype: name } }));

  const goContactInline = (serviceName) => {
    if (serviceName) prefillSubtype(serviceName);
    setRoute("home");
    setMobileMenuOpen(false);
    setTimeout(() => { document.getElementById("contact-inline")?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 0);
  };

  const goRoute = useCallback(
    (key) => {
      setRoute(key);
      setMobileMenuOpen(false);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [],
  );

  const openLinksModal = useCallback(() => {
    setLinksOpen(true);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    runSelfTests();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileMenuOpen]);

  return (
    <ExperienceContext.Provider value={{ liteMode, toggleLiteMode }}>
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
            <span className="font-semibold tracking-tight text-xl">MM</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-white/80">
            {MENU.map((m) => (
              m.key === "ai" ? (
                <a key={m.key} href={LINKS.starterclassSite} className="hover:text-white" target="_blank" rel="noreferrer">
                  {m.label}
                </a>
              ) : m.key === "loremaker" ? (
                <a key={m.key} href={LINKS.loremakerSite} className="hover:text-white" target="_blank" rel="noreferrer">
                  {m.label}
                </a>
              ) : m.key === "ai-tools" ? (
                <a key={m.key} href="/calculator" className="hover:text-white">
                  {m.label}
                </a>
              ) : (
                <a
                  key={m.key}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goRoute(m.key);
                  }}
                  className={cn("hover:text-white", route === m.key && "text-white")}
                >
                  {m.label}
                </a>
              )
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button onClick={openLinksModal} className="hidden sm:inline-flex">
              All my Links
            </Button>
            <a href={SOCIALS.email} className="text-white/80 hover:text-white hidden sm:inline-flex items-center gap-2"><Mail className="h-4 w-4" />Email</a>
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center rounded-full border border-white/20 p-2 text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="md:hidden border-b border-white/10 bg-black/85 backdrop-blur px-4 py-6"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-4 text-white/80">
              {MENU.map((m) => (
                m.key === "ai" ? (
                  <a
                    key={m.key}
                    className="flex items-center justify-between text-base"
                    href={LINKS.starterclassSite}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {m.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : m.key === "loremaker" ? (
                  <a
                    key={m.key}
                    className="flex items-center justify-between text-base"
                    href={LINKS.loremakerSite}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {m.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : m.key === "ai-tools" ? (
                  <a
                    key={m.key}
                    className="flex items-center justify-between text-base rounded-xl border border-white/15 px-3 py-2 bg-white/5 hover:bg-white/10"
                    href="/calculator"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {m.label}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                ) : (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => goRoute(m.key)}
                    className={cn(
                      "flex justify-between items-center text-base rounded-xl border border-white/15 px-3 py-2",
                      route === m.key ? "bg-white/10 text-white" : "bg-white/5 hover:bg-white/10",
                    )}
                  >
                    {m.label}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )
              ))}
              <Button onClick={openLinksModal} variant="ghost" className="justify-between !px-3">
                All my Links
                <ExternalLink className="h-4 w-4" />
              </Button>
              <a className="inline-flex items-center gap-2 text-sm text-white/70 underline" href={SOCIALS.email} onClick={() => setMobileMenuOpen(false)}>
                <Mail className="h-4 w-4" /> Email me
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Pages */}
      <main>
        {route === "home" && (
          <>
            <Hero onOpenLinksModal={openLinksModal} />
            <SectionNav />
            <Portfolio />
            <MMMGalleries />
            <AIShowcase />
          </>
        )}
        {route === "bio" && <Biography />}
        {route === "blog" && <AIShowcase />}
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
            © 2025 Menelek Makonnen. All rights reserved.
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
          <p className="text-white/75 text-sm">Leave a fast brief. I'll reply within 24–48h.</p>
          <a className="underline" href={SOCIALS.email}>Or email me directly</a>
          <textarea rows={4} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" placeholder="What are we making? Scope, goals, timeline…" />
          <div className="flex gap-2">
            <Button onClick={() => { alert("Saved locally. I'll be in touch."); setContactOpen(false); }} icon={ShieldCheck}>Send</Button>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>Cancel</Button>
          </div>
          <div className="text-xs text-white/60">This is a no‑backend demo. Your note stays on your device.</div>
        </div>
      </Modal>

      {/* Veronica Chatbot */}
      <AnimatePresence>
        {veronicaOpen && <VeronicaChat open={veronicaOpen} onClose={() => setVeronicaOpen(false)} />}
      </AnimatePresence>

      {/* Veronica Floating Button */}
      <AnimatePresence>
        {!veronicaOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVeronicaOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-[0_10px_40px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_50px_rgba(139,92,246,0.7)] transition-shadow"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #fb7185 100%)",
            }}
            aria-label="Chat with Veronica"
          >
            <div className="flex items-center justify-center text-3xl">💎</div>
          </motion.button>
        )}
      </AnimatePresence>

      </div>
    </ExperienceContext.Provider>
  );
}
