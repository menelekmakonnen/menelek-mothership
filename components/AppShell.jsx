import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Phone, Mail, ExternalLink, CheckCircle2, Youtube, Instagram, Linkedin, ShieldCheck, Sparkles, X, Camera, Shuffle, Bug } from "lucide-react";

/**
 * Menelek Makonnen — Mothership (v6.1)
 * Fix: Define <Blog /> to resolve ReferenceError. Add Dev self-tests.
 * Context kept from v6:
 * - Darker background; ultra‑tiny dull diamonds that brighten only on hover
 * - Hero shimmer + subtle word effects
 * - Home layout: Left = Director‑for‑Hire + Client Value Calculator; Right = Contact
 * - Service modal shows service tiers; only CTA = Book → scroll to contact (prefilled)
 * - Contact includes Other + 3 auto‑filled fit fields (Fit Score, Recommended Tier, Scope)
 * - Calculator nuanced per service; randomizer; broadcasts prefill
 * - Featured section + Loremaker featured below it
 */

// ========= FACTUAL LINKS ========= //
const SOCIALS = {
  instagram: "https://instagram.com/menelek.makonnen",
  youtube: "https://youtube.com/@director_menelek",
  linkedin: "https://linkedin.com/in/menelekmakonnen",
  email: "mailto:admin@menelekmakonnen.com",,
};

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");

function Button({ as: Cmp = "button", children, icon: Icon, href, onClick, className = "" }) {
  const base = cn(
    "px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white",
    "shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:bg-white/15 active:translate-y-px",
    "backdrop-blur transition-all hover:shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
    className
  );
  const inner = (
    <span className="inline-flex items-center gap-2">
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </span>
  );
  if (href) return (<a href={href} onClick={onClick} className={base}>{inner}</a>);
  return (<Cmp onClick={onClick} className={base}>{inner}</Cmp>);
}

function Card({ className = "", children }) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
      "shadow-[0_12px_50px_rgba(0,0,0,0.35)] p-5 transition-transform hover:-translate-y-[2px]",
      className)}>
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
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
              <h3 className="text-xl sm:text-2xl font-semibold flex items-center gap-2"><Sparkles className="h-5 w-5"/>{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-white/10"><X className="h-5 w-5"/></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ========= BACKGROUND: Darker Navy + Ultra‑Tiny Diamonds (hover only) ========= //
function DiamondsCanvas({ className }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

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

    const onResize = () => scale();
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    scale();

    const cell = 18;        // tighter grid
    const rot = Math.PI/4;  // diamonds
    const baseAlpha = 0.03; // very dull by default
    const auraR = 56;       // smaller hover radius
    const size = 2.2;       // ultra‑tiny diamonds

    const draw = () => {
      const w = canvas.offsetWidth; const h = canvas.offsetHeight;
      // much darker navy gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#04070f");
      g.addColorStop(1, "#090f1b");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;

      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell/2; const cy = y + cell/2;
          const dx = cx - mx; const dy = cy - my;
          const dist = Math.hypot(dx, dy);

          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
          if (dist < auraR) {
            // brighten near cursor with a very soft halo
            const k = 1 - dist / auraR; // 0..1
            const a = Math.min(0.22, 0.08 + k * 0.3); // lower max brightness
            const grad = ctx.createRadialGradient(0, 0, 0.2, 0, 0, 5.5);
            grad.addColorStop(0, `rgba(255,255,255,${a})`);
            grad.addColorStop(1, `rgba(255,255,255,0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(-size/2, -size/2, size, size);
          } else {
            ctx.fillStyle = `rgba(255,255,255,${baseAlpha})`;
            ctx.fillRect(-size/2, -size/2, size, size);
          }
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", () => (mouseRef.current = { x: -9999, y: -9999 }));
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); canvas.removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10 h-full w-full", className)} />;
}

// ========= DATA ========= //
const SERVICES = [
  { id: "feature", name: "Feature Film" },
  { id: "short", name: "Short Film" },
  { id: "ai-film", name: "AI Film" },
  { id: "music-video", name: "Music Video" },
  { id: "doc", name: "Documentary" },
  { id: "bts", name: "BTS" },
  { id: "event", name: "Event Coverage" },
  { id: "ai-ad", name: "AI Advert" },
];
const SERVICES_BY_ID = Object.fromEntries(SERVICES.map(s => [s.id, s.name]));

// Tier names updated
const SERVICE_PRICING = {
  "feature": { title: "Feature Film — Director for Hire", tiers: [
    { t: "Starter", p: "from £8k (pilot seq)", d:["Treatment & lookbook","Up to 3 days direction","Edit supervision"] },
    { t: "Signature", p: "from £25k", d:["Full treatment + shot plan","Principal direction","Edit + grade supervision"] },
    { t: "Cinema+", p: "custom", d:["Story consulting","Director + 1st AD","Festival deliverables pack"] },
  ]},
  "short": { title: "Short Film — Director for Hire", tiers: [
    { t: "Starter", p: "from £2.5k", d:["Treatment","1‑day direction","Assembly"] },
    { t: "Signature", p: "from £6k", d:["Shot plan","2‑day direction","Edit & sound polish"] },
    { t: "Cinema+", p: "from £12k", d:["Casting assist","3‑day direction","Grade + mix supervision"] },
  ]},
  "ai-film": { title: "AI Film — Director for Hire", tiers: [
    { t: "Starter", p: "from £2k", d:["Script → boards","Image gen pilot","Edit skeleton"] },
    { t: "Signature", p: "from £5k", d:["Scene previz","Clip gen (select models)","Edit + grade direction"] },
    { t: "Cinema+", p: "custom", d:["Full short (2–6 min)","VO + mix","Deliverables + socials"] },
  ]},
  "music-video": { title: "Music Video — Director for Hire", tiers: [
    { t: "Starter", p: "from £1.8k", d:["Concept","1‑day direction","Performance cut"] },
    { t: "Signature", p: "from £4k", d:["Treatment","2‑day direction","Color pass + captions"] },
    { t: "Cinema+", p: "from £8k", d:["Art direction","Stunt/FX planning","Multiple masters incl. verticals"] },
  ]},
  "doc": { title: "Documentary — Director for Hire", tiers: [
    { t: "Starter", p: "from £2k", d:["Interview plan","1‑day direction","Radio cut"] },
    { t: "Signature", p: "from £5k", d:["2‑day direction","B‑roll plan","Edit polish"] },
    { t: "Cinema+", p: "custom", d:["Multi‑week arc","Score supervision","Distribution masters"] },
  ]},
  "bts": { title: "BTS — Director for Hire", tiers: [
    { t: "Starter", p: "from £900", d:["Half‑day coverage","Select stills","1x reel"] },
    { t: "Signature", p: "from £1.8k", d:["Full‑day","2x reels","Mini‑featurette"] },
    { t: "Cinema+", p: "from £3k", d:["Multi‑day","EPK pack","Gallery stills set"] },
  ]},
  "event": { title: "Event Coverage — Director for Hire", tiers: [
    { t: "Starter", p: "from £700", d:["Half‑day","Highlights cut","10x photos"] },
    { t: "Signature", p: "from £1.4k", d:["Full‑day","Recap (60–90s)","Photo set"] },
    { t: "Cinema+", p: "custom", d:["Multi‑cam","Speaker clips","Captioned verticals"] },
  ]},
  "ai-ad": { title: "AI Advert — Director for Hire", tiers: [
    { t: "Starter", p: "from £1.2k", d:["Concept & script","Img/clip test","Rough cut"] },
    { t: "Signature", p: "from £3k", d:["Shotlist + boards","Clip gen","Edit + grade"] },
    { t: "Cinema+", p: "custom", d:["Multi‑variant campaign","VO + mix","Deliverables kit (9:16/1:1/16:9)"] },
  ]},
};

const PROJECTS = [
  { id: "im-alright", title: "I'm Alright (2024)", role: "Writer–Director", runtime: "8 min", summary: "Addiction & depression inside a lockdown flat.", url: "https://www.youtube.com/watch?v=A8cGpNe2JAE" },
  { id: "blinded-by-magic", title: "Blinded by Magic (2022)", role: "Writer–Director", runtime: "12 min", summary: "A possessed camera blinds its user while granting powers.", url: "https://www.youtube.com/watch?v=ivsCBuD1JYQ" },
  { id: "heroes-gods", title: "Heroes & Gods (2024)", role: "Writer–Director, Editor", runtime: "120 min", summary: "Anthology stitched into a feature — heroes vs vengeful goddess & twin.", url: "https://www.youtube.com/watch?v=jtiOv0OvD-0" },
  { id: "spar-bts", title: "SPAR (Doc, 2024)", role: "Director, Cinematographer, Editor", runtime: "14 min", summary: "BTS doc for a boxing pilot in London — Left Hook Gym.", url: "https://www.youtube.com/watch?v=4q6X6prhVOE" },
  { id: "soldier-mv", title: "Soldier (Music Video)", role: "Director, Editor", runtime: "3 min", summary: "Concept-to-delivery music video including cover art.", url: "https://youtu.be/BHPaJieCAXY" },
  { id: "abranteers", title: "Abranteers (Proof, 2023)", role: "Writer–Director", runtime: "9 min", summary: "Anti-magic veteran + rookie vs a dangerous magic user.", url: "https://www.youtube.com/shorts/CPPkq5zsXgE" },
];

const FEATURED_CHARACTERS = [
  { id: "mystic-man", name: "Mystic Man", faction: "Earthguard", strength: 9 },
  { id: "nighteagle", name: "Nighteagle", faction: "Skywatch", strength: 7 },
];

// ========= HERO (Showreel + shimmer title + word‑level effects) ========= //
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

function Hero({ onWatch, onScrollToWork }) {
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
              <motion.span whileHover={{ rotate: -1.2, scale: 1.02 }} className="inline-flex items-center gap-1 transition-all">Filmmaker<Camera className="h-4 w-4 opacity-0 group-hover:opacity-80 transition"/>.</motion.span>
            </span>
            <span className="group inline-block">
              <motion.span whileHover={{ textShadow: "0 0 12px rgba(255,255,255,0.45)" }} className="transition-all">Storyteller.</motion.span>
            </span>
          </div>
          <p className="mt-5 max-w-xl text-white/75">Cinematic direction + AI‑assisted worldbuilding for commercials, shorts, and IP. Creator of the Loremaker Universe.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onWatch} icon={Play}>Watch Showreel</Button>
            <Button onClick={onScrollToWork} icon={Phone} className="bg-white/10">Work with Me</Button>
          </div>
          <div className="mt-6 flex items-center gap-4 text-white/70">
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Instagram className="h-5 w-5"/>Instagram</a>
            <a href={SOCIALS.youtube} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Youtube className="h-5 w-5"/>YouTube</a>
            <a href={SOCIALS.linkedin} target="_blank" rel="noreferrer" className="hover:text-white inline-flex items-center gap-2"><Linkedin className="h-5 w-5"/>LinkedIn</a>
          </div>
        </div>
        <Card>
          <div className="text-sm uppercase tracking-[0.25em] text-white/60">Showreel</div>
          <div className="mt-3 aspect-video w-full rounded-2xl bg-black/50 border border-white/10 grid place-items-center">
            <div className="text-center p-6">
              <div className="text-white/80">Drop in your YouTube/Vimeo embed here.</div>
              <div className="text-white/50 text-sm mt-2">(Button below opens a working overlay.)</div>
              <div className="mt-4"><Button onClick={onWatch} icon={Play}>Play Reel</Button></div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ========= Work with Me (Left = Services + Calculator, Right = Contact) ========= //
function WorkWithMe({ onOpenService, onPrefill, onBookFromCalc }) {
  return (
    <section className="py-12" id="work">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Card>
            <div className="flex items-end justify-between mb-1">
              <h2 className="text-2xl sm:text-3xl font-bold">Director for Hire</h2>
            </div>
            <p className="text-white/75">Pick a service. The bubble shows tiers; the only action is to book, which returns here and pre‑fills the form.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <Button key={s.id} onClick={() => { onOpenService(s.id); onPrefill(s.name); }}>{s.name}</Button>
              ))}
            </div>
          </Card>
          <ValueCalculator onBook={onBookFromCalc} />
        </div>
        <ContactInline />
      </div>
    </section>
  );
}

// ========= Contact (Inline on Home, with extra auto‑filled fields) ========= //
function ContactInline() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subtype: "", otherDetail: "", message: "", fitScore: "", recTier: "", scope: "" });
  useEffect(() => {
    const handlerSubtype = (e) => { if (e.detail && e.detail.subtype !== undefined) setForm(f => ({ ...f, subtype: e.detail.subtype })); };
    const handlerFit = (e) => {
      if (!e.detail) return;
      const { service, fit, suggestedTier, budget, timeline } = e.detail;
      setForm(f => ({
        ...f,
        subtype: service || f.subtype,
        fitScore: `${fit}%`,
        recTier: suggestedTier,
        scope: `~£${budget.toLocaleString()} • ${timeline}w`,
      }));
    };
    window.addEventListener('prefill-subtype', handlerSubtype);
    window.addEventListener('prefill-fit', handlerFit);
    return () => { window.removeEventListener('prefill-subtype', handlerSubtype); window.removeEventListener('prefill-fit', handlerFit); };
  }, []);

  const [agree, setAgree] = useState(false);
  const [ok, setOk] = useState(false);
  const submit = () => {
    if (!agree) return alert("Please agree to the Privacy Policy.");
    if (!form.name || !form.email) return alert("Name and Email are required.");
    const key = "mm_contact_submissions";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({ ...form, service: "Director for Hire", ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
    setOk(true);
  };

  const choose = (s) => setForm(f => ({ ...f, subtype: s }));
  const options = [...SERVICES.map(s=>s.name), "Other"];

  return (
    <Card id="contact-inline">
      <h3 className="text-xl font-semibold">Contact</h3>
      <div className="text-white/70 text-sm">Email: <a href={SOCIALS.email} className="underline">hello@menelekmakonnen.com</a></div>
      {!ok ? (
        <div className="grid gap-3 mt-4">
          <div className="flex flex-wrap gap-2">
            {options.map(o => (
              <button key={o} onClick={()=>choose(o)} className={cn("px-3 py-1.5 rounded-full border", form.subtype===o ? "bg-white/20 border-white/30" : "border-white/15 hover:bg-white/10")}>{o}</button>
            ))}
          </div>
          {form.subtype === "Other" ? (
            <input value={form.otherDetail} onChange={(e)=>setForm({...form, otherDetail:e.target.value})} placeholder="Tell me what you need" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
          ) : null}

          {/* Auto‑filled fit fields */}
          <div className="grid sm:grid-cols-3 gap-3">
            <input value={form.fitScore} onChange={(e)=>setForm({...form, fitScore:e.target.value})} placeholder="Fit Score %" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
            <input value={form.recTier} onChange={(e)=>setForm({...form, recTier:e.target.value})} placeholder="Recommended Package" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
            <input value={form.scope} onChange={(e)=>setForm({...form, scope:e.target.value})} placeholder="Budget • Timeline" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name *" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
            <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email *" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
            <input value={form.subtype} onChange={(e)=>setForm({...form, subtype:e.target.value})} placeholder="Service subtype (auto‑filled)" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
          </div>
          <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} rows={4} placeholder="Project brief / goals" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20"/>
          <label className="flex items-center gap-2 text-white/70">
            <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)}/> I agree to the <a href="#" onClick={(e)=>{e.preventDefault(); alert('Privacy policy modal placeholder.');}} className="underline">Privacy Policy</a>.
          </label>
          <div className="flex gap-2">
            <Button onClick={submit} icon={ShieldCheck}>Send Inquiry</Button>
            <Button href={SOCIALS.email} icon={Mail} className="bg-white/10">Email Instead</Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto"/>
          <div className="mt-2">Thanks — I’ll reply within 24–48h.</div>
        </div>
      )}
    </Card>
  );
}

// ========= Client Value Calculator (nuanced per service) ========= //
function ValueCalculator({ onBook }) {
  const [service, setService] = useState(SERVICES[0].name);
  const [budget, setBudget] = useState(5000);
  const [timeline, setTimeline] = useState(6); // weeks
  const [ambition, setAmbition] = useState(6); // 1..10

  const cfg = {
    "Feature Film": { base: 25000, weeks: 12, wb: 1.2, wt: 1.0, wa: 1.0 },
    "Short Film": { base: 6000, weeks: 4, wb: 1.1, wt: 1.2, wa: 1.0 },
    "AI Film": { base: 4000, weeks: 3, wb: 1.0, wt: 1.0, wa: 1.2 },
    "Music Video": { base: 3000, weeks: 2, wb: 1.0, wt: 0.8, wa: 1.2 },
    "Documentary": { base: 3000, weeks: 3, wb: 1.0, wt: 1.1, wa: 1.0 },
    "BTS": { base: 900, weeks: 1, wb: 0.9, wt: 0.8, wa: 0.8 },
    "Event Coverage": { base: 1200, weeks: 1, wb: 0.9, wt: 0.8, wa: 0.8 },
    "AI Advert": { base: 2500, weeks: 2, wb: 1.0, wt: 1.0, wa: 1.1 },
  }[service] || { base: 3000, weeks: 3, wb: 1, wt: 1, wa: 1 };

  // score
  const coverage = budget / cfg.base; // >1 is good
  let score = 30;
  score += Math.max(0, Math.min(45, (coverage - 1) * 45 * cfg.wb));
  const timeFactor = timeline / cfg.weeks; // >=1 is good
  score += Math.max(-20, Math.min(20, (timeFactor - 1) * 20 * cfg.wt));
  score += (ambition - 5) * 2 * cfg.wa;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const suggestedTier = coverage < 0.85 ? "Starter" : coverage < 1.3 ? "Signature" : "Cinema+";
  const descriptor = score>=80?"Strong fit":score>=60?"Good fit":score>=40?"Borderline":"Not ideal";

  useEffect(() => {
    // Broadcast fit to contact form
    window.dispatchEvent(new CustomEvent('prefill-fit', { detail: { service, fit: score, suggestedTier, budget, timeline } }));
  }, [service, score, suggestedTier, budget, timeline]);

  const randomize = () => {
    const rand = (min, max, step=1) => Math.round((Math.random()*(max-min)+min)/step)*step;
    const s = SERVICES[rand(0, SERVICES.length-1)].name;
    setService(s);
    setBudget(rand(1000, 60000, 100));
    setTimeline(rand(1, 24, 1));
    setAmbition(rand(1, 10, 1));
  };

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-xl font-semibold">Client Value Calculator</h3>
        <div className="flex gap-2">
          <Button onClick={randomize} icon={Shuffle}>Randomize</Button>
          <Button onClick={()=>onBook(service)} icon={Phone} className="bg-white/10">Book this Scope</Button>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mt-4">
        <div>
          <div className="text-white/70 text-sm mb-1">Service</div>
          <select value={service} onChange={(e)=>setService(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20">
            {SERVICES.map(s => <option key={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Budget (£{budget.toLocaleString()})</div>
          <input type="range" min={1000} max={60000} step={100} value={budget} onChange={(e)=>setBudget(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Timeline (weeks: {timeline})</div>
          <input type="range" min={1} max={24} value={timeline} onChange={(e)=>setTimeline(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="text-white/70 text-sm mb-1">Ambition ({ambition})</div>
          <input type="range" min={1} max={10} value={ambition} onChange={(e)=>setAmbition(parseInt(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Simple SVG horizontal bar graph */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-white/70 text-sm">
          <span>Fit Score</span>
          <span>{descriptor}</span>
        </div>
        <svg viewBox="0 0 110 12" className="w-full mt-2">
          <rect x="0" y="0" width="110" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
          <rect x="0" y="0" width={score} height="12" rx="6" fill="rgba(80,220,160,0.85)" />
          <text x="55" y="9" textAnchor="middle" fontSize="6" fill="white">{score}%</text>
        </svg>
        <div className="text-white/75 text-sm mt-2">Recommended: <span className="font-semibold">{suggestedTier}</span></div>
      </div>
    </Card>
  );
}

// ========= Featured from Loremaker (Home) ========= //
function FeaturedUniverse() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured from the Loremaker Universe</h2>
          <Button onClick={()=>window.dispatchEvent(new CustomEvent('route', { detail: 'loremaker' }))} className="text-sm">Explore Universe</Button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURED_CHARACTERS.map(c => (
            <Card key={c.id}>
              <div className="text-sm text-white/60">{c.faction}</div>
              <div className="font-semibold">{c.name}</div>
              <div className="mt-2 text-white/80 text-sm">Strength</div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                <div className="h-full bg-emerald-400" style={{ width: `${c.strength*10}%` }} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========= Portfolio (Featured) ========= //
function Portfolio() {
  const [modal, setModal] = useState(null);
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Featured</h2>
          <span className="text-white/70 text-sm">{PROJECTS.length} projects</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p) => (
            <Card key={p.id}>
              <div className="aspect-[16/10] rounded-xl bg-black/45 border border-white/10 grid place-items-center text-white/60">Poster / Stills</div>
              <div className="mt-3 font-semibold">{p.title}</div>
              <div className="text-white/70 text-sm">{p.role} • {p.runtime}</div>
              <p className="mt-2 text-white/80">{p.summary}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => setModal({type:'watch', p})} icon={Play}>Watch</Button>
                <Button onClick={() => setModal({type:'case', p})} className="bg-white/10" icon={ExternalLink}>Case Study</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {modal ? (
        <Modal open={true} onClose={() => setModal(null)} title={modal?.p?.title || ''}>
          {modal?.type === 'watch' ? (
            <div className="aspect-video w-full rounded-2xl bg-black/60 border border-white/10 grid place-items-center">
              <div className="text-center p-6">
                <div className="text-white/85">Replace with your embed (YouTube/Vimeo). This overlay closes on outside click.</div>
                <Button href={modal?.p?.url} icon={ExternalLink} className="mt-4">Open on YouTube</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/85">Role: {modal?.p?.role}. Outcome: crisp narrative, solid retention; clean masters.</p>
              <ul className="list-disc pl-6 text-white/80">
                <li>Concept → Production → Post overview</li>
                <li>Tools: Camera/Editor/Grading suite (replace with specifics)</li>
                <li>Deliverables: Final cut(s), verticals, captions, thumbnails</li>
              </ul>
            </div>
          )}
        </Modal>
      ) : null}
    </section>
  );
}

// ========= Blog (static list; no quick-post UI) ========= //
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
          {POSTS.map((p)=> (
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

// ========= Other Pages ========= //
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

function MmmMedia() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold">MMM Media — Edits, Music Videos, Photography</h2>
        <p className="text-white/75 mt-2">Demo cards; replace with your sets and videos.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {["Music Video: Soldier","Photo Set: Blue Neon","Fast Edit: Club Recap"].map((t) => (
            <Card key={t}>
              <div className="aspect-video rounded-xl bg-black/40 grid place-items-center text-white/60">Gallery / Thumb</div>
              <div className="mt-3 font-semibold">{t}</div>
              <div className="mt-2 flex gap-2">
                <Button onClick={() => alert('Open gallery modal / embed.')} icon={ExternalLink}>Open</Button>
                <Button onClick={() => alert('Replace with your YouTube/Vimeo URL.')} className="bg-white/10">Watch</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIPage() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold">AI — Consultancy & Experiments</h2>
        <p className="text-white/75 mt-2">Deep dives on AI pipelines for film and content, experiments, and YouTube videos. Not a separate paid service; the only purchasable offer is Director for Hire.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {["AI Previz Workflow","N8N Ops for Auto‑Blog","Prompt → Pitch Deck"].map((t) => (
            <Card key={t}>
              <div className="font-semibold">{t}</div>
              <p className="text-white/75 mt-1">Short write‑up and demo links. Replace with your real posts.</p>
              <div className="mt-3 flex gap-2">
                <Button onClick={() => alert('Open experiment modal.')} icon={ExternalLink}>View</Button>
                <Button href={SOCIALS.youtube} icon={Youtube} className="bg-white/10">Playlist</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LoremakerPage() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Loremaker — Interlinked Universe</h2>
          <span className="text-white/70 text-sm">Featured</span>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURED_CHARACTERS.map((c) => (
            <Card key={c.id}>
              <div className="text-sm text-white/60">{c.faction}</div>
              <div className="font-semibold">{c.name}</div>
              <div className="mt-2 text-white/80 text-sm">Strength</div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-1">
                <div className="h-full bg-emerald-400" style={{ width: `${c.strength * 10}%` }} />
              </div>
            </Card>
          ))}
        </div>
        <p className="text-white/75 mt-8">Interactive character/faction database. Production will sync from Google Sheets/Drive via N8N.</p>
      </div>
    </section>
  );
}

function ContactsPage() {
  const [fun, setFun] = useState("");
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", reason: "Director for Hire", other: "", message: "" });
  const submit = () => { if (!form.name || !form.email) return alert("Name and Email are required."); setOk(true); };
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold">Contact</h2>
          <div className="mt-2 text-white/80">Email: <a href={SOCIALS.email} className="underline">hello@menelekmakonnen.com</a></div>
          <Card className="mt-4">
            {!ok ? (
              <div className="grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name *" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20" />
                  <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email *" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <select value={form.reason} onChange={(e)=>setForm({...form, reason:e.target.value})} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20">
                    <option>Director for Hire</option>
                    <option>General</option>
                    <option>Collaboration</option>
                    <option>Other</option>
                  </select>
                  {form.reason === 'Other' ? (
                    <input value={form.other} onChange={(e)=>setForm({...form, other:e.target.value})} placeholder="Tell me more" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20" />
                  ) : (
                    <input disabled className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40" value="Select reason"/>
                  )}
                </div>
                <textarea value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} rows={5} placeholder="Message" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20" />
                <div className="flex gap-2"><Button onClick={submit} icon={ShieldCheck}>Send</Button><Button href={SOCIALS.email} icon={Mail} className="bg-white/10">Email Instead</Button></div>
              </div>
            ) : (
              <div className="text-center py-6"><CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto"/><div className="mt-2">Got it — I’ll reply soon.</div></div>
            )}
          </Card>
          <Card className="mt-4">
            <div className="font-semibold">Fun bit</div>
            <p className="text-white/75 text-sm">Type <code>ACTION!</code> to light up the stage.</p>
            <input value={fun} onChange={(e)=>setFun(e.target.value)} placeholder="Type here" className="mt-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20" />
            <div className="mt-3 h-10 rounded-lg border border-white/15 bg-black/40 grid place-items-center">
              {fun.trim().toUpperCase()==="ACTION!" ? <span className="text-emerald-400">🎬 Lights on. Let’s shoot.</span> : <span className="text-white/50">Waiting…</span>}
            </div>
          </Card>
        </div>
        <div>
          <h3 className="text-xl font-semibold">London</h3>
          <Card className="mt-3">
            <div className="aspect-[4/3] w-full rounded-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent)] border border-white/10 relative overflow-hidden">
              {/* simple pin map placeholder */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-white/70">Map placeholder</div>
                  <div className="text-white/50 text-sm">51.5074° N, 0.1278° W</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ========= Dev Self-Tests ========= //
function DevTests() {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const r = [];
    try {
      r.push({ name: "Blog component exists", pass: typeof Blog === 'function' });
    } catch (e) {
      r.push({ name: "Blog component exists", pass: false, err: e.message });
    }
    try {
      const missing = SERVICES.filter(s => !SERVICE_PRICING[s.id]);
      r.push({ name: "Pricing exists for all services", pass: missing.length === 0, missing: missing.map(m=>m.id) });
    } catch (e) {
      r.push({ name: "Pricing exists for all services", pass: false, err: e.message });
    }
    try {
      // Ensure custom event won't throw even if no listeners
      window.dispatchEvent(new CustomEvent('prefill-fit', { detail: { service: 'Short Film', fit: 75, suggestedTier: 'Signature', budget: 6000, timeline: 4 } }));
      r.push({ name: "prefill-fit dispatch ok", pass: true });
    } catch (e) {
      r.push({ name: "prefill-fit dispatch ok", pass: false, err: e.message });
    }
    setResults(r);
  }, []);
  return <div className="sr-only" aria-hidden>{JSON.stringify(results)}</div>;
}

// ========= App Shell ========= //
const MENU = [
  { key: 'home', label: 'Home' },
  { key: 'bio', label: 'Biography' },
  { key: 'mmm', label: 'Mmm Media' },
  { key: 'ai', label: 'AI' },
  { key: 'loremaker', label: 'Loremaker' },
  { key: 'blog', label: 'Blog' },
  { key: 'contacts', label: 'Contacts' },
];

export default function AppShell() {
  const [route, setRoute] = useState('home');
  const [serviceModal, setServiceModal] = useState(null); // id string
  const [reelOpen, setReelOpen] = useState(false);

  useEffect(()=>{
    const nav = (e) => setRoute(e.detail);
    window.addEventListener('route', nav);
    return () => window.removeEventListener('route', nav);
  },[]);

  const openService = (id) => setServiceModal(id);
  const prefillSubtype = (name) => window.dispatchEvent(new CustomEvent('prefill-subtype', { detail: { subtype: name }}));

  const goContactInline = (serviceName) => {
    if (serviceName) prefillSubtype(serviceName);
    setRoute('home');
    setTimeout(()=>{
      document.getElementById('contact-inline')?.scrollIntoView({behavior:'smooth', block:'start'});
    }, 0);
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <DiamondsCanvas />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/45 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/10 grid place-items-center border border-white/20"><Sparkles className="h-4 w-4"/></div>
            <span className="font-semibold tracking-tight">Menelek Makonnen</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-white/80">
            {MENU.map((m)=> (
              <a key={m.key} href="#" onClick={(e)=>{e.preventDefault(); setRoute(m.key);}} className={cn("hover:text-white", route===m.key && "text-white")}>
                {m.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button onClick={()=>setRoute('contacts')} icon={Phone} className="hidden sm:inline-flex">Contact</Button>
            <a href={SOCIALS.email} className="text-white/80 hover:text-white hidden sm:inline-flex items-center gap-2"><Mail className="h-4 w-4"/>Email</a>
          </div>
        </div>
      </header>

      {/* Pages */}
      <main>
        {route==='home' && <>
          <Hero onWatch={()=>setReelOpen(true)} onScrollToWork={()=>document.getElementById('work')?.scrollIntoView({behavior:'smooth'})} />
          <WorkWithMe onOpenService={openService} onPrefill={prefillSubtype} onBookFromCalc={(svc)=>goContactInline(svc)} />
          <Portfolio />
          <FeaturedUniverse />
          <DevTests />
        </>}
        {route==='bio' && <Biography />}
        {route==='mmm' && <MmmMedia />}
        {route==='ai' && <AIPage />}
        {route==='loremaker' && <LoremakerPage />}
        {route==='blog' && <Blog />}
        {route==='contacts' && <ContactsPage />}
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
                <li key={m.key}><a href="#" onClick={(e)=>{e.preventDefault(); setRoute(m.key);}} className="hover:text-white">{m.label}</a></li>
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

      {/* Showreel Modal */}
      <Modal open={reelOpen} onClose={()=>setReelOpen(false)} title="Director Showreel">
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/70 grid place-items-center">
          {/* Replace with <iframe src="..." /> for real embed */}
          <div className="text-center p-6">
            <div className="text-white/85">Drop your YouTube/Vimeo embed here.</div>
            <div className="text-white/50 text-sm mt-2">Overlay closes on outside click.</div>
          </div>
        </div>
      </Modal>

      {/* Service Modal (tiers + book only) */}
      <Modal open={!!serviceModal} onClose={()=>setServiceModal(null)} title={SERVICE_PRICING[serviceModal]?.title || "Service"}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            {(SERVICE_PRICING[serviceModal]?.tiers || []).map((tier, i) => (
              <Card key={i}>
                <div className="font-semibold">{tier.t}</div>
                <div className="text-white/70 text-sm">{tier.p}</div>
                <ul className="mt-2 list-disc pl-5 text-white/80 text-sm">
                  {tier.d.map((x, idx)=> <li key={idx}>{x}</li>)}
                </ul>
              </Card>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={()=>{ const name = SERVICES_BY_ID[serviceModal]; setServiceModal(null); goContactInline(name); }} icon={Phone}>Book this service</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
