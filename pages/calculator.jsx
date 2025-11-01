import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  CalendarIcon as CalendarIconImport,
  Info,
  Loader2,
  Minimize2,
  Maximize2,
  Shuffle,
} from "lucide-react";

const CalendarIcon = CalendarIconImport;

// Create ExperienceContext for this page (defaulting to lite mode)
const ExperienceContext = createContext({ liteMode: true });
const useExperience = () => useContext(ExperienceContext);

// ========= CONSTANTS ========= //
const SOCIALS = {
  email: "mailto:admin@menelekmakonnen.com",
};

const N8N_BASE_URL = "https://mmmai.app.n8n.cloud";
const N8N_ENDPOINTS = {
  contact: ["/webhook/contact", "/webhook-test/contact"],
};

const SERVICES = [
  { id: "feature", name: "Feature Film" },
  { id: "short", name: "Short Film" },
  { id: "ai-film", name: "AI Film" },
  { id: "music-video", name: "Music Video" },
  { id: "doc", name: "Documentary" },
  { id: "bts", name: "BTS" },
  { id: "ai-ad", name: "AI Advert" },
];

// ========= UTIL ========= //
const cn = (...a) => a.filter(Boolean).join(" ");

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

// ========= COMPONENTS ========= //
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
  const MotionCmp = motion(computedComponent);
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
            Scope your idea in minutes. I'll show you fit, budget bands, and a realistic timeline. No fluff—just the plan.
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
          <div className="mt-2">Thanks — I'll reply within 24–48h.</div>
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
  }, [phases, projectDate, service, score, suggestedTier, budget, total, onCalendarChange]);

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
            <span title="Total resources you're ready to invest across prep, shoot, and post.">
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
            <span title="When you'd like pre-production to begin.">
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

// ========= MAIN PAGE ========= //
export default function CalculatorPage() {
  const [calendarState, setCalendarState] = useState(null);
  const [currentService, setCurrentService] = useState(SERVICES[0].name);

  const goContactInline = (svc) => {
    if (svc) setCurrentService(svc);
    document.getElementById("contact-inline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ExperienceContext.Provider value={{ liteMode: true }}>
      <div className="min-h-screen text-white relative overflow-x-hidden">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-gray-900 to-black" />

        <div className="pt-24">
          <WorkWithMe
            currentService={currentService}
            onSetService={(n) => setCurrentService(n)}
            onBook={(svc) => goContactInline(svc)}
            onCalendarChange={setCalendarState}
          />
          <RevealOnScroll as="section" id="contact" className="py-6" delay={0.24} persist>
            <div className="max-w-7xl mx-auto px-6">
              <ContactInline calendarState={calendarState} />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </ExperienceContext.Provider>
  );
}
