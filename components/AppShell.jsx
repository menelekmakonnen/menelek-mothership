import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Phone, Mail, ExternalLink, CheckCircle2, Youtube, Instagram, Linkedin, ShieldCheck, Sparkles, X, Shuffle, ChevronUp, Calendar as CalendarIcon, Info } from "lucide-react";

/**
 * Menelek Makonnen — Mothership (v9 — Canvas build)
 *
 * This pass addresses user requests:
 * - Services: Add **Randomizer (High‑Fit)** chip after AI Advert; remove bottom randomize button.
 * - Randomizer now only yields **high Fit** combos (>= 80) to encourage booking.
 * - Background diamonds: base much darker; only hover shows bright aura; click creates ripple ring.
 * - Interactive schedule: grid with **Y‑axis phases** and **X‑axis days (M T W T F S S)**; bars per phase are draggable & resizable, can **overlap**; width scales to **Total Duration** (1–26w).
 * - CVC Fit Score already accounts for Total.
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
  "https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/export?format=csv&gid=0"; // Characters gid if different, change it

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");

function Button({ as: Cmp = "button", children, icon: Icon, href, onClick, className = "", target, rel, variant = "default" }) {
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
  const inner = (
    <span className="inline-flex items-center gap-2">
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </span>
  );
  if (href)
    return (
      <a href={href} onClick={onClick} className={base} target={target} rel={rel}>
        {inner}
      </a>
    );
  return (
    <Cmp onClick={onClick} className={base}>
      {inner}
    </Cmp>
  );
}

function Card({ className = "", children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_12px_50px_rgba(0,0,0,0.35)] p-5 transition-transform hover:-translate-y-[2px]",
        className
      )}
    >
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
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

    // much darker baseline, tighter grid; bright only on hover/click
    const cell = 10; // density
    const rot = Math.PI / 4;
    const baseAlpha = 0.02; // darker default
    const auraR = 70; // hover radius
    const size = 2.1;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#03050a");
      g.addColorStop(1, "#070a12");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // advance ripples
      ripplesRef.current = ripplesRef.current.map(r => ({ ...r, t: r.t + 1 })).filter(r => r.t < 280);

      const { x: mx, y: my } = mouseRef.current;

      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell / 2;
          const cy = y + cell / 2;

          // hover aura
          const dxh = cx - mx;
          const dyh = cy - my;
          const distHover = Math.hypot(dxh, dyh);
          const hoverK = Math.max(0, 1 - distHover / auraR);

          // click ripple ring
          let clickGlow = 0;
          for (const r of ripplesRef.current) {
            const k = r.t / 280;
            const radius = 12 + k * 320; // expands
            const thickness = 12;
            const dxc = cx - r.x;
            const dyc = cy - r.y;
            const d = Math.hypot(dxc, dyc);
            const ring = Math.max(0, 1 - Math.abs(d - radius) / thickness);
            clickGlow = Math.max(clickGlow, ring * (1 - k));
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          // baseline core (very dark)
          ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);

          // additive glow only near hover/click
          const a = Math.min(0.5, hoverK * 0.45 + clickGlow * 0.75);
          if (a > 0) {
            const grad = ctx.createRadialGradient(0, 0, 0.2, 0, 0, 8);
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
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10 h-full w-full", className)} style={{ pointerEvents: 'auto' }} />;
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
  { id: "im-alright", title: "I'm Alright (2024)", role: "Writer–Director", runtime: "8 min", summary: "Addiction & depression inside a lockdown flat.", url: "https://www.youtube.com/watch?v=A8cGpNe2JAE&pp=ygUTbWVuZWxlayBJJ20gYWxyaWdodA%3D%3D" },
  { id: "blinded-by-magic", title: "Blinded by Magic (2022)", role: "Writer–Director", runtime: "12 min", summary: "A possessed camera blinds its user while granting powers.", url: "https://www.youtube.com/watch?v=ivsCBuD1JYQ&pp=ygUYbWVuZWxlayBibGluZGVkIGJ5IG1hZ2lj" },
  { id: "heroes-gods", title: "Heroes & Gods (2024)", role: "Writer–Director, Editor", runtime: "120 min", summary: "Anthology stitched into a feature — heroes vs vengeful goddess & twin.", url: "https://www.youtube.com/watch?v=jtiOv0OvD-0&pp=ygUXbWVuZWxlayBoZXJvZXMgYW5kIGdvZHM%3D" },
  { id: "spar-bts", title: "SPAR (Doc, 2024)", role: "Director, Cinematographer, Editor", runtime: "14 min", summary: "BTS doc for a boxing pilot in London — Left Hook Gym.", url: "https://www.youtube.com/watch?v=4q6X6prhVOE" },
  { id: "soldier-mv", title: "Soldier (Music Video)", role: "Director, Editor", runtime: "3 min", summary: "Concept-to-delivery music video including cover art.", url: "https://www.youtube.com/watch?v=BHPaJieCAXY&pp=ygUMd29udSBzb2xkaWVy0gcJCfsJAYcqIYzv" },
  { id: "abranteers", title: "Abranteers (Proof, 2023)", role: "Writer–Director", runtime: "9 min", summary: "Anti-magic veteran + rookie vs a dangerous magic user.", url: "https://www.youtube.com/shorts/CPPkq5zsXgE" },
];

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) return u.searchParams.get('v');
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/shorts/')[1].split('/')[0];
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1];
    }
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch (e) { }
  return null;
}

function youtubeThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
}

// Best‑effort Instagram thumb (may be blocked by CORS; fallback to gradient)
const IG_REEL_ID = "DI6NjVNN0tS";
const IG_THUMB_URL = `https://www.instagram.com/p/${IG_REEL_ID}/media/?size=l`;

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
  const [imgOk, setImgOk] = useState(true);
  return (
    <section className="relative pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <ShimmerTitle>Menelek Makonnen</ShimmerTitle>
          <div className="mt-2 text-xl text-white/80 select-none">
            <span className="group inline-block mr-2">
              <motion.span whileHover={{ letterSpacing: 2, scale: 1.02 }} className="transition-all">Worldbuilder.</motion.span>
              <span className="block h-[2px] w-0 bg-white/30 group-hover:w-full transition-all"></span>
            </span>
            <span className="group inline-block mr-2">
              <motion.span whileHover={{ rotate: -1.2, scale: 1.02 }} className="inline-flex items-center gap-1 transition-all">Filmmaker.</motion.span>
            </span>
            <span className="group inline-block">
              <motion.span whileHover={{ textShadow: "0 0 12px rgba(255,255,255,0.45)" }} className="transition-all">Storyteller.</motion.span>
            </span>
          </div>
          <p className="mt-5 max-w-xl text-white/75">Cinematic direction + AI‑assisted worldbuilding for commercials, shorts, and IP. Creator of the Loremaker Universe.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onWatch} icon={Play}>Watch Instagram Reel</Button>
            <Button href={LINKS.loremakerSite} icon={ExternalLink} variant="ghost">Loremaker Universe</Button>
            <Button href={LINKS.icuniSite} icon={ExternalLink} variant="ghost">AI Consultancy</Button>
            <Button onClick={onOpenLinksModal} variant="ghost">All my Links</Button>
          </div>
        </div>
        <Card>
          <div className="text-sm uppercase tracking-[0.25em] text-white/60">Showreel</div>
          <button onClick={onWatch} className="mt-3 aspect-video w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative group">
            {imgOk ? (
              <img src={IG_THUMB_URL} onError={()=>setImgOk(false)} alt="Instagram Reel thumbnail" className="w-full h-full object-cover"/>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
            )}
            <div className="absolute inset-0 grid place-items-center">
              <div className="rounded-full p-3 bg-black/50 border border-white/20 group-hover:scale-105 transition-transform"><Play className="h-6 w-6"/></div>
            </div>
          </button>
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
          <p className="text-white/75">Pick a service, scope it, and your selection flows into Contact with your fit, budget, and timeline pre‑filled.</p>

          {/* Service chips only (no modal, no tiers). Randomizer added at the end. */}
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => onSetService(s.name)} className={cn("px-3 py-1.5 rounded-full border", currentService===s.name?"bg-white/20 border-white/30":"border-white/15 hover:bg-white/10") }>
                <span className="inline-flex items-center gap-2">{s.name}
                  {(s.id === 'music-video' || s.id === 'ai-ad') && (
                    <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/10">from £200*</span>
                  )}
                </span>
              </button>
            ))}
            {/* Randomizer chip (high-fit only) */}
            <button
              onClick={() => setRandomKey((k)=>k+1)}
              className="px-3 py-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 inline-flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4"/> Randomize (High‑Fit)
            </button>
          </div>
          <div className="text-white/60 text-xs mt-3 inline-flex items-center gap-2">
            <Info className="h-4 w-4"/> <span>* Only for Music Video & AI Advert when <em>you provide all</em> assets & logistics.</span>
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
      {!ok ? (
        <div className="grid gap-3 mt-4">
          {/* Service chips */}
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

          {/* Auto‑filled fit fields */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-white/70 text-sm mb-1 block">Fit Score %</label>
              <input value={form.fitScore} onChange={(e) => setForm({ ...form, fitScore: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Recommended Package</label>
              <select value={form.recTier} onChange={(e) => setForm({ ...form, recTier: e.target.value })} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 w-full text-white" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                {['Starter','Signature','Cinema+'].map(x => <option key={x} className="text-black">{x}</option>)}
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
        <div className="text-center py-6"><CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto"/><div className="mt-2">Thanks — I’ll reply within 24–48h.</div></div>
      )}
    </Card>
  );
}

// ========= Calculator (CVC) ========= //
function ValueCalculator({ service: serviceProp, onBook, onCalendarChange, randomizeKey }) {
  const [service, setService] = useState(serviceProp || SERVICES[0].name);
  useEffect(()=>{ if (serviceProp) setService(serviceProp); }, [serviceProp]);

  const [budget, setBudget] = useState(2000);
  const [ambition, setAmbition] = useState(6);
  const [projectDate, setProjectDate] = useState(() => new Date().toISOString().slice(0,10));

  // total duration lives here and is the single source of truth
  const [total, setTotal] = useState(6); // weeks

  const RULES = {
    "Feature Film": { base: 40000, budgetRange: [15000, 250000], ambitionIdeal: [7, 10], durationIdeal: 16, weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "Short Film":   { base: 8000,  budgetRange: [1500, 30000],  ambitionIdeal: [6, 10], durationIdeal: 6,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "AI Film":      { base: 5000,  budgetRange: [1000, 20000],  ambitionIdeal: [6, 10], durationIdeal: 4,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "Music Video":  { base: 3500,  budgetRange: [200, 20000],   ambitionIdeal: [7, 10], durationIdeal: 3,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "Documentary":  { base: 4000,  budgetRange: [1500, 40000],  ambitionIdeal: [5, 9],  durationIdeal: 8,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "BTS":          { base: 900,   budgetRange: [300, 5000],    ambitionIdeal: [3, 7],  durationIdeal: 2,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
    "AI Advert":    { base: 3000,  budgetRange: [200, 20000],   ambitionIdeal: [6, 10], durationIdeal: 2,  weights: { budget: 0.35, ambition: 0.35, duration: 0.30 } },
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

  const coverage = budget / cfg.base;
  const suggestedTier = coverage < 0.85 ? "Starter" : coverage < 1.3 ? "Signature" : "Cinema+";
  const descriptor = score >= 80 ? "Strong fit" : score >= 60 ? "Good fit" : score >= 40 ? "Borderline" : "Not ideal";

  // default split (percentages) for initial layout
  const SPLIT = [0.2, 0.3, 0.2, 0.25, 0.05];
  const [phases, setPhases] = useState([
    { key: 'development', label: 'Development', startDays: 0, weeks: Math.max(0.5, Math.round(6 * SPLIT[0] * 2)/2) },
    { key: 'pre',         label: 'Pre‑Production', startDays: Math.round(6*SPLIT[0]*7), weeks: Math.max(0.5, Math.round(6 * SPLIT[1] * 2)/2) },
    { key: 'production',  label: 'Production', startDays: Math.round(6*(SPLIT[0]+SPLIT[1])*7), weeks: Math.max(0.5, Math.round(6 * SPLIT[2] * 2)/2) },
    { key: 'post',        label: 'Post‑Production', startDays: Math.round(6*(SPLIT[0]+SPLIT[1]+SPLIT[2])*7), weeks: Math.max(0.5, Math.round(6 * SPLIT[3] * 2)/2) },
    { key: 'distribution',label: 'Distribution', startDays: Math.round(6*(SPLIT[0]+SPLIT[1]+SPLIT[2]+SPLIT[3])*7), weeks: Math.max(0.5, Math.round(6 * SPLIT[4] * 2)/2) },
  ]);

  // keep phases within bounds when total changes
  useEffect(() => {
    const maxDays = total * 7;
    setPhases((prev) => prev.map(p => ({
      ...p,
      startDays: Math.min(p.startDays, Math.max(0, maxDays - Math.ceil(p.weeks*7))),
    })));
  }, [total]);

  // push calendar state up + prefill events
  useEffect(() => {
    onCalendarChange?.(buildCalendarStateOverlapping(phases, projectDate));
    window.dispatchEvent(new CustomEvent("prefill-fit", { detail: { service, fit: score, suggestedTier, budget, timeline: total } }));
    window.dispatchEvent(new CustomEvent('prefill-subtype', { detail: { subtype: service } }));
  }, [phases, projectDate, service, score, suggestedTier, budget, total]);

  // High‑fit randomizer trigger
  useEffect(() => {
    if (randomizeKey === undefined) return;
    // try up to N attempts to find a >=80 combo
    let best = { s: service, b: budget, a: ambition, t: total, score: -1 };
    for (let i = 0; i < 60; i++) {
      const svc = SERVICES[Math.floor(Math.random()*SERVICES.length)].name;
      const rcfg = RULES[svc];
      const bgt = Math.round((Math.random()*(rcfg.budgetRange[1]-rcfg.budgetRange[0])+rcfg.budgetRange[0]) / 50) * 50;
      const amb = Math.floor(Math.random()*5)+6; // 6–10 bias
      const tot = Math.floor(Math.random()*26)+1; // 1–26 weeks
      const sc = scoreFor(svc, bgt, amb, tot);
      if (sc > best.score) best = { s: svc, b: bgt, a: amb, t: tot, score: sc };
      if (sc >= 80) { best = { s: svc, b: bgt, a: amb, t: tot, score: sc }; break; }
    }
    setService(best.s);
    setBudget(best.b);
    setAmbition(best.a);
    setTotal(best.t);
    // seed phases sequentially for clarity
    const maxDays = best.t * 7;
    const seq = [
      { key: 'development', label: 'Development', startDays: 0, weeks: Math.max(0.5, Math.round(best.t * SPLIT[0] * 2)/2) },
      { key: 'pre',         label: 'Pre‑Production', startDays: Math.round(best.t*SPLIT[0]*7), weeks: Math.max(0.5, Math.round(best.t * SPLIT[1] * 2)/2) },
      { key: 'production',  label: 'Production', startDays: Math.round(best.t*(SPLIT[0]+SPLIT[1])*7), weeks: Math.max(0.5, Math.round(best.t * SPLIT[2] * 2)/2) },
      { key: 'post',        label: 'Post‑Production', startDays: Math.round(best.t*(SPLIT[0]+SPLIT[1]+SPLIT[2])*7), weeks: Math.max(0.5, Math.round(best.t * SPLIT[3] * 2)/2) },
      { key: 'distribution',label: 'Distribution', startDays: Math.round(best.t*(SPLIT[0]+SPLIT[1]+SPLIT[2]+SPLIT[3])*7), weeks: Math.max(0.5, Math.round(best.t * SPLIT[4] * 2)/2) },
    ].map(p=> ({...p, startDays: Math.min(p.startDays, Math.max(0, maxDays - Math.ceil(p.weeks*7))) }));
    setPhases(seq);
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
          <input type="range" min={200} max={20000} step={50} value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Ambition ({ambition})</div>
          <input type="range" min={1} max={10} value={ambition} onChange={(e) => setAmbition(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Proposed Project Start</div>
          <input type="date" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-white/20 bg-white/10" />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-white/70 text-sm"><span>Fit Score</span><span>{descriptor}</span></div>
        <div className="rounded-2xl p-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/15">
          <svg viewBox="0 0 110 6" className="w-full block">
            <defs>
              <linearGradient id="fitg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(80,220,160,0.6)"/>
                <stop offset="100%" stopColor="rgba(160,120,255,0.85)"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="110" height="6" rx="3" fill="rgba(255,255,255,0.12)" />
            <rect x="0" y="0" width={score} height="6" rx="3" fill="url(#fitg)" />
          </svg>
          <div className="text-white/75 text-sm mt-2">Recommended: <span className="font-semibold">{suggestedTier}</span> • Total Timeline: {phaseWeeksTotal(phases)} weeks</div>
        </div>
      </div>

      <TimelineGrid
        phases={phases}
        onChange={setPhases}
        total={total}
        onTotalChange={setTotal}
        startDate={projectDate}
      />

      <div className="mt-4 flex gap-2">
        <Button onClick={() => onBook?.(service)} icon={Phone} variant="ghost">Book this Scope</Button>
      </div>
    </div>
  );
}

// ========= Calendar helpers ========= //
function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

function buildCalendarStateOverlapping(phases, startDate) {
  // Each phase has startDays & weeks. Allow overlaps.
  return {
    start: startDate,
    phases: phases.map(p => ({
      key: p.key,
      label: p.label,
      start: addDays(startDate, p.startDays),
      end: addDays(startDate, p.startDays + Math.ceil(p.weeks*7)),
      weeks: p.weeks,
      startDays: p.startDays,
    })),
    end: phases.length ? addDays(startDate, Math.max(...phases.map(p => p.startDays + Math.ceil(p.weeks*7)))) : startDate,
  };
}

// ========= Timeline Grid (Y‑axis phases, X‑axis day initials, overlap allowed) ========= //
function TimelineGrid({ phases, onChange, total, onTotalChange, startDate }) {
  const containerRef = useRef(null);
  const totalDays = Math.max(7, total * 7);
  const dayLabels = ['M','T','W','T','F','S','S'];

  // drag state: which phase, mode ('move' | 'left' | 'right')
  const dragRef = useRef(null);

  const clampPhase = (p) => {
    const maxStart = Math.max(0, totalDays - Math.ceil(p.weeks * 7));
    return { ...p, startDays: Math.min(Math.max(0, p.startDays), maxStart), weeks: Math.max(0.5, Math.min(26, p.weeks)) };
  };

  const pct = (days) => `${(days / totalDays) * 100}%`;

  const onPointerDown = (e, idx, mode) => {
    const rect = containerRef.current.getBoundingClientRect();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { idx, mode, startX: e.clientX, rectW: rect.width, startStart: phases[idx].startDays, startWeeks: phases[idx].weeks };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current; if (!d) return;
    const dx = e.clientX - d.startX;
    const deltaDays = Math.round((dx / d.rectW) * totalDays);
    const next = phases.map(p => ({...p}));
    if (d.mode === 'move') next[d.idx].startDays = d.startStart + deltaDays;
    if (d.mode === 'left') {
      // adjust start left handle: move start & weeks simultaneously
      const newStart = d.startStart + deltaDays;
      const newWeeks = d.startWeeks - (deltaDays / 7);
      next[d.idx].startDays = newStart; next[d.idx].weeks = newWeeks;
    }
    if (d.mode === 'right') {
      // adjust only width
      const newWeeks = d.startWeeks + (deltaDays / 7);
      next[d.idx].weeks = newWeeks;
    }
    onChange(next.map(clampPhase));
  };
  const onPointerUp = () => { dragRef.current = null; };

  const cal = buildCalendarStateOverlapping(phases, startDate);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-white/80 text-sm mb-2">
        <div className="inline-flex items-center gap-2"><CalendarIcon className="h-4 w-4"/> Interactive Schedule</div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">Total duration</span>
          <input type="range" min={1} max={26} step={1} value={total} onChange={(e)=>onTotalChange(parseInt(e.target.value))} />
          <span className="text-white/70 text-xs">{total} wks</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* X‑axis: day initials across total weeks */}
        <div className="text-[11px] text-white/60 mb-2 flex justify-between">
          <div>Start: {cal.start}</div>
          <div className="flex-1 mx-3">
            <div ref={containerRef} className="relative h-5 w-full select-none">
              {/* grid columns per day */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]" style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }} />
              {/* week labels */}
              {[...Array(total).keys()].map((w) => (
                <div key={w} className="absolute top-0 text-center" style={{ left: pct(w*7), width: pct(7) }}>
                  {dayLabels.map((d,i)=> <span key={i} className="inline-block w-[calc(100%/7)]">{d}</span>)}
                </div>
              ))}
            </div>
          </div>
          <div>End: {cal.end}</div>
        </div>

        {/* Y‑axis phases with draggable bars (overlap allowed) */}
        <div className="space-y-3" onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
          {phases.map((p, idx) => (
            <div key={p.key} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-[13px] text-white/80">{p.label}</div>
              <div className="relative h-8 flex-1">
                {/* grid background */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)]" style={{ backgroundSize: `calc(100% / ${totalDays}) 100%` }} />
                {/* bar */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-6 rounded-xl border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                  style={{ left: pct(p.startDays), width: pct(Math.ceil(p.weeks*7)) }}
                >
                  {/* move handle (center) */}
                  <div
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    onPointerDown={(e)=>onPointerDown(e, idx, 'move')}
                    title="Drag to move"
                  />
                  {/* left resize */}
                  <div
                    className="absolute left-0 top-0 h-full w-3 cursor-ew-resize"
                    onPointerDown={(e)=>onPointerDown(e, idx, 'left')}
                    title="Drag to adjust start"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/75" />
                  </div>
                  {/* right resize */}
                  <div
                    className="absolute right-0 top-0 h-full w-3 cursor-ew-resize"
                    onPointerDown={(e)=>onPointerDown(e, idx, 'right')}
                    title="Drag to adjust end"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[2px] bg-white/75" />
                  </div>

                  {/* label */}
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="px-2 text-[11px] text-white/90 whitespace-nowrap overflow-hidden text-ellipsis">{Math.round(p.weeks*10)/10}w</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 text-white/65 text-xs">Bars may overlap. Drag edges to resize in day precision (snaps by day); use the Total slider to expand/contract the full calendar.</div>
      </div>
    </div>
  );
}

// ========= CSV helper ========= //
function useCSV(url) {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const res = await fetch(url, { mode: "cors" });
        const text = await res.text();
        if (abort) return;
        const { headers, rows } = parseCSV(text);
        setHeaders(headers);
        setRows(rows);
      } catch (e) {
        setHeaders([]);
        setRows([]);
      }
    })();
    return () => { abort = true; };
  }, [url]);
  return { headers, rows };
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
      else if (c === "\n" || c === "\r") { if (val !== "" || cur.length) { cur.push(val); lines.push(cur); cur = []; val = ""; } }
      else val += c;
    }
  }
  if (val !== "" || cur.length) { cur.push(val); lines.push(cur); }
  if (!lines.length) return { headers: [], rows: [] };
  const headers = lines[0];
  const rows = lines.slice(1).map((arr) => Object.fromEntries(headers.map((h, i) => [h, arr[i] ?? ""])));
  return { headers, rows };
}

// ========= Featured Universe (Home) ========= //
function FeaturedUniverse() {
  const { rows } = useCSV(SHEETS_CSV_URL);

  const picks = useMemo(() => {
    if (!rows?.length) return [];
    const idx = new Set();
    while (idx.size < Math.min(3, rows.length)) idx.add(Math.floor(Math.random() * rows.length));
    return [...idx].map(i => rows[i]);
  }, [rows]);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured from the Loremaker Universe</h2>
          <Button href={LINKS.loremakerSite} className="text-sm" icon={ExternalLink}>Explore Universe</Button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {picks.length ? picks.map((r, i) => (
            <CharacterCard key={`${r.Char_ID || r.id || i}`} row={r} />
          )) : (
            [0,1,2].map((i)=> (
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

function CharacterCard({ row }) {
  const name = row["Character"] || row["Name"] || row["Title"] || "Unnamed";
  const alias = row["Alias"] || row["AKA"] || "";
  const alignment = row["Alignment"] || row["Faction"] || "";
  const location = row["Location"] || "";
  const short = row["Short Description"] || row["Summary"] || "";
  const img = row["Cover Image"] || row["Image"] || "";
  return (
    <Card>
      <div className="aspect-[16/10] rounded-xl bg-black/45 border border-white/10 overflow-hidden grid place-items-center">
        {img ? (
          <img src={img} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white/50 text-sm">Art / Poster</div>
        )}
      </div>
      <div className="mt-3 font-semibold">{name}{alias ? <span className="text-white/60 font-normal"> — {alias}</span> : null}</div>
      <div className="text-white/70 text-sm">{alignment}{location ? ` • ${location}` : ""}</div>
      {short ? <p className="mt-2 text-white/80 text-sm">{short}</p> : null}
      <div className="mt-4 flex gap-2">
        <Button href={LINKS.loremakerSite} className="bg-white/10" icon={ExternalLink}>Read more</Button>
      </div>
    </Card>
  );
}

// ========= Portfolio (Featured 6 Projects) ========= //
function Portfolio() {
  const [modal, setModal] = useState(null);
  return (
    <section className="py-12" id="featured-projects">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured</h2>
          <span className="text-white/70 text-sm">{PROJECTS.length} projects</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <Card key={p.id}>
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/45 border border-white/10">
                {youtubeThumb(p.url) ? (
                  <img src={youtubeThumb(p.url)} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-white/60">Poster / Stills</div>
                )}
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
    { id: "s1", title: "Making My First Short Film (1/3)", date: "2024-10-01", body: "Preproduction mistakes I won't repeat: coverage, casting, and schedule realism." },
    { id: "s2", title: "Making My First Short Film (2/3)", date: "2024-10-08", body: "Production: blocking, directing performance, and morale under pressure." },
    { id: "s3", title: "Making My First Short Film (3/3)", date: "2024-10-15", body: "Post: structural edit, sound, color, delivery, and festival plans." },
  ];
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Blog</h2>
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
          <p className="text-white/85">Filmmaker and worldbuilder based in the UK. Grew up on DC’s mythic weight and MCU connectivity, with grounded realism. Creator of the Loremaker Universe.</p>
          <p className="text-white/80">Influences: Edgar Wright (direction & editing), James Gunn (ensemble heart), Kevin Feige (long-arc production), George Lucas (mass relevance). Stylistic compass balances spectacle with emotion.</p>
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
          <div className="flex items-center gap-3 mb-3"><Youtube className="h-5 w-5"/><div>
            <div className="font-semibold">YouTube</div>
            <div className="text-white/60 text-xs">Trailers, reels, behind‑the‑scenes</div>
          </div></div>
          <div className="flex flex-col gap-2">
            <Button href={LINKS.personalYouTube} target="_blank" rel="noreferrer" icon={ExternalLink}>Personal Channel</Button>
            <Button href={LINKS.directorYouTube} target="_blank" rel="noreferrer" icon={ExternalLink} variant="ghost">Director Channel</Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3"><Instagram className="h-5 w-5"/><div>
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
          <div className="mt-3 flex items-center gap-2"><Linkedin className="h-4 w-4"/><a className="underline" href={LINKS.personalLI} target="_blank" rel="noreferrer">LinkedIn</a></div>
          <div className="mt-1 flex items-center gap-2"><Linkedin className="h-4 w-4"/><a className="underline" href={LINKS.businessLI} target="_blank" rel="noreferrer">Business LinkedIn</a></div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-3"><ExternalLink className="h-5 w-5"/><div>
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
            <stop offset="0%" stopOpacity="0.85" stopColor="#ffffff"/>
            <stop offset="100%" stopOpacity="0.15" stopColor="#ffffff"/>
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="8" transform="rotate(45 32 32)" fill="url(#mmg)" opacity="0.12" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <text x="32" y="38" textAnchor="middle" fontSize="20" fill="#ffffff" opacity="0.9" style={{ fontWeight: 800, letterSpacing: 1 }}>MM</text>
      </svg>
    </div>
  );
}

const MENU = [
  { key: 'home', label: 'Home' },
  { key: 'bio', label: 'Biography' },
  { key: 'ai', label: 'AI' }, // external link
  { key: 'loremaker', label: 'Loremaker' }, // external link
  { key: 'blog', label: 'Blog' },
];

export default function AppShell() {
  const [route, setRoute] = useState('home');
  const [reelOpen, setReelOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);
  const [calendarState, setCalendarState] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [currentService, setCurrentService] = useState(SERVICES[0].name);

  const prefillSubtype = (name) => window.dispatchEvent(new CustomEvent('prefill-subtype', { detail: { subtype: name }}));

  const goContactInline = (serviceName) => {
    if (serviceName) prefillSubtype(serviceName);
    setRoute('home');
    setTimeout(()=>{ document.getElementById('contact-inline')?.scrollIntoView({behavior:'smooth', block:'start'}); }, 0);
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(-45deg,rgba(255,255,255,0.015)_0,rgba(255,255,255,0.015)_1px,transparent_1px,transparent_8px)]"/>
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
            {MENU.map((m)=> (
              m.key === 'ai' ? (
                <a key={m.key} href={LINKS.icuniSite} className="hover:text-white" rel="noreferrer">{m.label}</a>
              ) : m.key === 'loremaker' ? (
                <a key={m.key} href={LINKS.loremakerSite} className="hover:text-white">{m.label}</a>
              ) : (
                <a key={m.key} href="#" onClick={(e)=>{e.preventDefault(); setRoute(m.key);}} className={cn("hover:text-white", route===m.key && "text-white")}>{m.label}</a>
              )
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button onClick={()=>setLinksOpen(true)} className="hidden sm:inline-flex">All my Links</Button>
            <a href={SOCIALS.email} className="text-white/80 hover:text-white hidden sm:inline-flex items-center gap-2"><Mail className="h-4 w-4"/>Email</a>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main>
        {route==='home' && (
          <>
            <Hero onWatch={()=>setReelOpen(true)} onOpenLinksModal={()=>setLinksOpen(true)} />
            <Portfolio />
            <FeaturedUniverse />
            <WorkWithMe currentService={currentService} onSetService={(n)=>setCurrentService(n)} onBook={(svc)=>goContactInline(svc)} onCalendarChange={setCalendarState} />
            <section className="py-6"><div className="max-w-7xl mx-auto px-6"><ContactInline calendarState={calendarState} /></div></section>
            <Blog />
            <DevTests />
          </>
        )}
        {route==='bio' && <Biography />}
        {route==='blog' && <Blog />}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 bg-black/35 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold">Menelek Makonnen</div>
            <div className="text-white/70 text-sm mt-1">Filmmaker • Worldbuilder</div>
            <div className="mt-3 flex items-center gap-4 text-white/80">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Instagram className="h-4 w-4"/>Instagram</a>
              <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Youtube className="h-4 w-4"/>YouTube</a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Linkedin className="h-4 w-4"/>LinkedIn</a>
            </div>
          </div>
          <div>
            <div className="font-semibold">Navigation</div>
            <ul className="mt-2 space-y-2 text-white/80">
              {MENU.map((m)=> (
                m.key === 'ai' ? (
                  <li key={m.key}><a href={LINKS.icuniSite} className="hover:text-white">{m.label}</a></li>
                ) : m.key === 'loremaker' ? (
                  <li key={m.key}><a href={LINKS.loremakerSite} className="hover:text-white">{m.label}</a></li>
                ) : (
                  <li key={m.key}><a href="#" onClick={(e)=>{e.preventDefault(); setRoute(m.key);}} className="hover:text-white">{m.label}</a></li>
                )
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold">Legal</div>
            <ul className="mt-2 space-y-2 text-white/80">
              <li><a href="#" onClick={(e)=>{e.preventDefault(); alert('Privacy Policy modal placeholder.')}} className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" onClick={(e)=>{e.preventDefault(); alert('Terms modal placeholder.')}} className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-white/60 text-sm py-4">© {new Date().getFullYear()} Menelek Makonnen. All rights reserved.</div>
      </footer>

      {/* Floating Back‑to‑Top Button */}
      <button
        onClick={()=>window.scrollTo({top:0, behavior:'smooth'})}
        className={cn("fixed right-5 bottom-5 z-40 transition-all", showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none")}
        aria-label="Back to top"
      >
        <div className="h-12 w-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur grid place-items-center shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
          <ChevronUp className="h-6 w-6" />
        </div>
      </button>

      {/* Showreel Modal — Instagram Reel */}
      <Modal open={reelOpen} onClose={()=>setReelOpen(false)} title="Director Showreel (Instagram)">
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
          <iframe
            className="w-full h-full"
            src={`https://www.instagram.com/p/${IG_REEL_ID}/embed`}
            title="Instagram Reel"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        </div>
      </Modal>

      {/* All Links Modal */}
      <AllLinksModal open={linksOpen} onClose={()=>setLinksOpen(false)} />

      <DevTests />
    </div>
  );
}

// ========= Dev Self-Tests ========= //
function DevTests() {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const r = [];
    try { r.push({ name: "Blog component exists", pass: typeof Blog === 'function' }); } catch (e) { r.push({ name: "Blog component exists", pass: false, err: e?.message }); }
    try {
      const labels = SERVICES.map(s=>s.name);
      r.push({ name: "Services include AI Advert & Music Video", pass: labels.includes('AI Advert') && labels.includes('Music Video') });
    } catch (e) { r.push({ name: "Services assertions", pass: false, err: e?.message }); }
    try { r.push({ name: "Loremaker URL set", pass: LINKS.loremakerSite?.includes('menelekmakonnen.com/loremaker') }); } catch (e) { r.push({ name: "Link assertions", pass: false, err: e?.message }); }
    try { r.push({ name: "Sheet URL present", pass: typeof SHEETS_CSV_URL === 'string' && SHEETS_CSV_URL.length > 0 }); } catch (e) { r.push({ name: "Sheet url", pass: false, err: e?.message }); }
    try {
      const id1 = getYouTubeId('https://www.youtube.com/watch?v=abcdEFGhijk');
      const id2 = getYouTubeId('https://youtu.be/abcdEFGhijk');
      const id3 = getYouTubeId('https://www.youtube.com/shorts/abcdEFGhijk');
      const ok1 = (id1==='abcdEFGhijk' && id2==='abcdEFGhijk' && id3==='abcdEFGhijk');
      const ok2 = youtubeThumb('https://youtu.be/abcdEFGhijk').includes('i.ytimg.com/vi/abcdEFGhijk');
      r.push({ name: "YouTube utils", pass: ok1 && ok2 });
    } catch (e) { r.push({ name: "YouTube utils", pass: false, err: e?.message }); }
    // Calendar tests
    try {
      const phases = [
        { key:'development', startDays:0, weeks: 1 },
        { key:'pre', startDays:3, weeks: 1 },
      ];
      const cal = buildCalendarStateOverlapping(phases, '2025-01-01');
      r.push({ name: "Calendar overlapping builds", pass: cal.phases.length>=2 && cal.start==='2025-01-01' && !!cal.end });
    } catch (e) { r.push({ name: "Calendar build", pass: false, err: e?.message }); }
    setResults(r);
  }, []);
  return (
    <div className="sr-only" aria-hidden="true">{JSON.stringify(results)}</div>
  );
}
