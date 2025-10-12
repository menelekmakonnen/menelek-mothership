import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  RefreshCcw,
  X,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  MapPin,
  Layers3,
  Atom,
  Clock,
  Crown,
  Swords,
} from "lucide-react";

/**
 * LOREMAKER — Ultra build (plain JSX, no TS)
 * - Filters are a slide‑in drawer (hidden by default). No dropdowns anywhere.
 * - Bright text everywhere except Arena (high contrast as requested).
 * - Manual Hero slider (fixed height, keyboard arrows enabled). No auto-slide.
 * - Hover-only "Simulate" button near insignia on cards; tactile pulse on click.
 * - Syncs live from Google Sheets via GViz. Gallery/cover Drive links normalized.
 * - No external UI imports (shadcn). Minimal in-file UI components to avoid module errors.
 */

/** -------------------- Tiny UI kit (no external imports) -------------------- */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Button({ variant = "default", className = "", children, as: Tag = "button", ...props }) {
  const base =
    "inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-extrabold transition active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-offset-0";
  const styles = {
    default: "bg-white text-black hover:bg-white/90",
    secondary: "bg-black/70 text-white hover:bg-black",
    outline: "border border-white/30 text-white hover:bg-white/10",
    ghost: "text-white/90 hover:bg-white/10",
    destructive: "bg-red-600 text-white hover:bg-red-500",
  }[variant];
  return (
    <Tag className={[base, styles, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Tag>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
function Card({ className = "", children }) {
  return <div className={cx("rounded-2xl border border-white/10 bg-white/5 backdrop-blur", className)}>{children}</div>;
}
function CardHeader({ className = "", children }) {
  return <div className={cx("p-4", className)}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={cx("p-4", className)}>{children}</div>;
}
function CardFooter({ className = "", children }) {
  return <div className={cx("p-4 pt-0", className)}>{children}</div>;
}
function CardTitle({ className = "", children }) {
  return <div className={cx("text-lg font-extrabold", className)}>{children}</div>;
}
function CardDescription({ className = "", children }) {
  return <div className={cx("text-sm text-white/80", className)}>{children}</div>;
}
function Input({ className = "", ...props }) {
  return (
    <input
      className={cx(
        "w-full rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 px-3 py-2 focus:outline-none focus:ring-2",
        className
      )}
      {...props}
    />
  );
}
function Badge({ className = "", children }) {
  return <span className={cx("px-2 py-1 rounded-full text-xs font-extrabold", className)}>{children}</span>;
}
function Switch({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "w-12 h-6 rounded-full relative transition border",
        checked ? "bg-amber-300 border-amber-300" : "bg-white/10 border-white/30"
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  );
}

/** -------------------- Config -------------------- */
const SHEET_ID = "1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM"; // replace if needed
const SHEET_NAME = "Characters";
const GVIZ_URL = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

const COL_ALIAS = {
  id: ["id", "char_id", "character id", "code"],
  name: ["character", "character name", "name"],
  alias: ["alias", "aliases", "also known as"],
  gender: ["gender", "sex"],
  alignment: ["alignment"],
  location: ["location", "base of operations", "locations"],
  status: ["status"],
  era: ["era", "origin/era", "time"],
  firstAppearance: ["first appearance", "debut", "firstappearance"],
  powers: ["powers", "abilities", "power"],
  faction: ["faction", "team", "faction/team"],
  tag: ["tag", "tags"],
  shortDesc: ["short description", "shortdesc", "blurb"],
  longDesc: ["long description", "longdesc", "bio"],
  stories: ["stories", "story", "appears in"],
  cover: ["cover image", "cover", "cover url"],
};
const GALLERY_ALIASES = Array.from({ length: 15 }, (_, i) => i + 1).map((n) => [
  `gallery image ${n}`,
  `gallery ${n}`,
  `img ${n}`,
  `image ${n}`,
]);

// Global cache for Alliances suggestions
let __ALL_CHARS = [];

/** -------------------- Utils -------------------- */
const toSlug = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
function normalizeDriveUrl(url) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname.includes("drive.google.com")) {
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = (m && m[1]) || u.searchParams.get("id");
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return url;
  } catch {
    return url;
  }
}
function splitList(raw) {
  if (!raw) return [];
  return raw
    .replace(/\band\b/gi, ",")
    .replace(/[|;]/g, ",")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function parseLocations(raw) {
  const items = splitList(raw);
  const out = [];
  for (const item of items) {
    const parts = item.split(/\s*,\s*/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) out.push(...parts);
    else out.push(item);
  }
  return Array.from(new Set(out));
}
function parsePowers(raw) {
  if (!raw) return [];
  const items = splitList(raw);
  return items.map((item) => {
    let name = item;
    let level = 0;
    const colon = item.match(/^(.*?)[=:]\s*(\d{1,2})(?:\s*\/\s*10)?$/);
    if (colon) {
      name = colon[1].trim();
      level = Math.min(10, parseInt(colon[2]));
    } else if (/\(/.test(item) && item.match(/\((\d{1,2})\)/)) {
      const m = item.match(/^(.*?)\((\d{1,2})\)$/);
      name = (m?.[1] || item).trim();
      level = Math.min(10, parseInt(m?.[2] || "0"));
    } else {
      const trail = item.match(/^(.*?)(\d{1,2})$/);
      if (trail) {
        name = trail[1].trim();
        level = Math.min(10, parseInt(trail[2]));
      } else {
        name = item.trim();
        level = 0;
      }
    }
    return { name, level: isFinite(level) ? level : 0 };
  });
}
function headerMap(headers) {
  const map = {};
  const lower = headers.map((h) => (h || "").toLowerCase().trim());
  function findIndex(aliases) {
    for (const a of aliases) {
      const idx = lower.indexOf(a);
      if (idx !== -1) return idx;
    }
    return -1;
  }
  for (const key of Object.keys(COL_ALIAS)) {
    const idx = findIndex(COL_ALIAS[key]);
    if (idx !== -1) map[key] = idx;
  }
  GALLERY_ALIASES.forEach((aliases, n) => {
    const idx = findIndex(aliases);
    if (idx !== -1) map[`gallery_${n + 1}`] = idx;
  });
  return map;
}
function parseGViz(text) {
  const m = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
  if (!m) throw new Error("GViz format not recognized");
  return JSON.parse(m[1]);
}
function rowToCharacter(row, map) {
  const get = (k) => {
    const idx = map[k];
    if (idx == null) return undefined;
    const cell = row[idx];
    if (!cell) return undefined;
    const v = cell.v ?? cell.f ?? cell;
    return typeof v === "string" ? v : String(v ?? "");
  };
  const name = (get("name") || "").trim();
  if (!name) return null;
  const char = {
    id: get("id") || toSlug(name),
    name,
    alias: splitList(get("alias")),
    gender: get("gender"),
    alignment: get("alignment"),
    locations: parseLocations(get("location")),
    status: get("status"),
    era: get("era"),
    firstAppearance: get("firstAppearance"),
    powers: parsePowers(get("powers")),
    faction: splitList(get("faction")),
    tags: splitList(get("tag")),
    shortDesc: get("shortDesc"),
    longDesc: get("longDesc"),
    stories: splitList(get("stories")),
    cover: normalizeDriveUrl(get("cover")),
    gallery: [],
  };
  for (let i = 1; i <= 15; i++) {
    const url = get(`gallery_${i}`);
    if (url) char.gallery.push(normalizeDriveUrl(url));
  }
  return char;
}

/** Daily seeding helpers */
const todayKey = () => new Date().toISOString().slice(0, 10);
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dailyInt = (seed, min = 1, max = 10) => {
  const r = seededRandom(seed + todayKey())();
  return Math.floor(r * (max - min + 1)) + min;
};
function fillDailyPowers(c) {
  const powers = (c.powers || []).map((p) => ({ ...p, level: p.level > 0 ? p.level : dailyInt(`${c.name}|${p.name}`, 4, 9) }));
  return { ...c, powers };
}

/** -------------------- Data hook -------------------- */
const SAMPLE = [
  {
    id: "mystic-man",
    name: "Mystic Man",
    alias: ["Arcanist"],
    gender: "Male",
    alignment: "Hero",
    locations: ["Accra", "London"],
    status: "Active",
    era: "Modern",
    firstAppearance: "2019",
    powers: [
      { name: "Spellcraft", level: 9 },
      { name: "Teleportation", level: 7 },
    ],
    faction: ["Earthguard"],
    tags: ["Leader"],
    shortDesc: "A strategist mage who wages wars with runes.",
    longDesc: "Master tactician of the Loremaker universe.",
    stories: ["Heroes & Gods"],
    cover:
      "https://images.unsplash.com/photo-1544450770-94d251f81d7b?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
  {
    id: "lithespeed",
    name: "Lithespeed",
    alias: ["Quicksable"],
    gender: "Female",
    alignment: "Hero",
    locations: ["Tema"],
    status: "Active",
    era: "Modern",
    firstAppearance: "2020",
    powers: [
      { name: "Superspeed", level: 8 },
      { name: "Reflexes", level: 7 },
    ],
    faction: ["Earthguard"],
    tags: ["Legend"],
    shortDesc: "Speedster with dancer's finesse.",
    longDesc: "She can paint circles around thunder.",
    stories: ["Heroes & Gods"],
    cover:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
  {
    id: "nighteagle",
    name: "Nighteagle",
    alias: ["Watcher"],
    gender: "Male",
    alignment: "Vigilante",
    locations: ["Kumasi"],
    status: "Unknown",
    era: "Modern",
    firstAppearance: "2018",
    powers: [
      { name: "Stealth", level: 8 },
      { name: "Gadgets", level: 7 },
    ],
    faction: ["Janitors"],
    tags: ["Mythic"],
    shortDesc: "Silent guardian with metal wings.",
    longDesc: "Haunts rooftops and rumor mills alike.",
    stories: ["Vigilantes: Dawn of the"],
    cover:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
];

function useCharacters() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const pull = async (sheetName) => {
        const res = await fetch(GVIZ_URL(sheetName));
        const txt = await res.text();
        return parseGViz(txt);
      };
      let obj;
      try {
        obj = await pull(SHEET_NAME);
      } catch {
        obj = await pull("Sheet1");
      }
      let rows = obj.table.rows || [];
      const labels = obj.table.cols.map((c) => (c?.label || c?.id || "").trim());
      let map = headerMap(labels);
      if (map.name == null && rows.length) {
        const first = (rows[0]?.c || []).map((cell) => String(cell?.v ?? cell?.f ?? "").trim());
        const alt = headerMap(first);
        if (alt.name != null) {
          map = alt;
          rows = rows.slice(1);
        }
      }
      const parsed = [];
      for (const r of rows) {
        const c = rowToCharacter(r.c || [], map);
        if (c) parsed.push(fillDailyPowers(c));
      }
      setRaw(parsed);
      __ALL_CHARS = parsed;
    } catch (e) {
      console.error("Sheet load failed, using SAMPLE:", e?.message || e);
      const parsed = SAMPLE.map(fillDailyPowers);
      setRaw(parsed);
      __ALL_CHARS = parsed;
      setError("Loaded fallback sample data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSheet();
  }, []);
  return { data: raw, loading, error, refetch: fetchSheet };
}

/** -------------------- Aesthetics -------------------- */
function Aurora({ className }) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  const left = useTransform(sx, (v) => `${v}%`);
  const top = useTransform(sy, (v) => `${v}%`);
  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width) * 100);
        y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className={"absolute inset-0 -z-10 overflow-hidden " + (className || "")}
    >
      <motion.div style={{ left, top }} className="absolute h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-700/40 via-fuchsia-500/40 to-amber-400/40" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
    </motion.div>
  );
}

// Upright heater shield insignia (interactive)
function Insignia({ label, size = 48, variant = "character", expandableName }) {
  const initials =
    label
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "LM";
  const hue = Math.abs([...label].reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
  const g1 = `hsl(${hue},85%,65%)`;
  const g2 = `hsl(${(hue + 50) % 360},85%,60%)`;
  const topWidth = variant === "site" ? 40 : variant === "faction" ? 36 : 32;
  return (
    <div className="group inline-flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
        <defs>
          <linearGradient id={`g-${hue}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={g1} />
            <stop offset="100%" stopColor={g2} />
          </linearGradient>
        </defs>
        <path
          d={`M32 6 C32 6 ${32 - topWidth / 2} 10 ${32 - topWidth / 2} 10 L ${32 + topWidth / 2} 10 C ${32 + topWidth / 2} 10 32 6 32 6 L 54 16 L 54 35 C 54 46 45 55 32 58 C 19 55 10 46 10 35 L 10 16 Z`}
          fill={`url(#g-${hue})`}
          stroke="rgba(255,255,255,.6)"
          strokeWidth="1.2"
        />
        <text x="32" y="38" textAnchor="middle" fontFamily="ui-sans-serif,system-ui" fontWeight="900" fontSize="20" fill="#fff" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.6))" }}>
          {initials}
        </text>
      </svg>
      {expandableName && (
        <div className="px-2 py-1 rounded-full bg-white text-black text-xs font-extrabold opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow">{expandableName}</div>
      )}
    </div>
  );
}

function ImageSafe({ src, alt, className, fallbackLabel }) {
  const [err, setErr] = useState(false);
  if (!src || err)
    return (
      <div className={`relative ${className || ""} flex items-center justify-center bg-white/5 border border-white/10 rounded-xl`}>
        <Insignia label={fallbackLabel || alt || ""} size={64} />
      </div>
    );
  return <img src={src} alt={alt} onError={() => setErr(true)} className={className} loading="lazy" />;
}

/** -------------------- UI atoms -------------------- */
function PowerMeter({ level }) {
  const pct = Math.max(0, Math.min(10, level)) * 10;
  return (
    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300" style={{ width: `${pct}%` }} />
    </div>
  );
}
function FacetChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "px-3 py-1 rounded-full text-sm font-bold border transition",
        active ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/40 hover:bg-white/20"
      )}
    >
      {children}
    </button>
  );
}

/** -------------------- Character Card / Modal -------------------- */
function CharacterCard({ c, onOpen, onFacet, onUseInSim }) {
  const [pulse, setPulse] = useState(false);
  const openProfile = () => onOpen(c);
  const triggerSim = () => {
    setPulse(true);
    onUseInSim(c.id);
    setTimeout(() => setPulse(false), 420);
  };
  return (
    <Card className={cx(
      "hover:shadow-2xl hover:shadow-fuchsia-500/15 transition overflow-hidden group",
      pulse ? "ring-2 ring-amber-300 scale-[1.01]" : ""
    )}>
      <div className="relative">
        <button onClick={openProfile} className="block text-left w-full">
          <ImageSafe src={c.cover || c.gallery[0]} alt={c.name} fallbackLabel={c.name} className="h-56 w-full object-cover" />
        </button>
        <div className="absolute left-2 top-2 flex flex-col gap-2 items-start">
          <div onClick={openProfile} className="cursor-pointer">
            <Insignia label={c.faction?.[0] || c.name} size={36} variant={c.faction?.length ? "faction" : "character"} expandableName={c.name} />
          </div>
          {/* Hover-only Sim button near the name bubble */}
          <motion.button
            onClick={triggerSim}
            whileTap={{ scale: 0.95 }}
            className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-extrabold bg-amber-300 text-black shadow border border-black/10"
            aria-label="Use in Simulator"
            title="Load into Battle Arena"
          >
            <Swords size={14} /> Simulate
          </motion.button>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Insignia label={c.faction?.[0] || c.name} size={32} variant={c.faction?.length ? "faction" : "character"} />
          <CardTitle role="button" onClick={openProfile} className="cursor-pointer text-xl font-black tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,.6)] text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-amber-200">{c.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 font-semibold">{c.shortDesc || c.longDesc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {c.gender && <FacetChip onClick={() => onFacet({ key: "gender", value: c.gender })}>{c.gender}</FacetChip>}
          {c.alignment && <FacetChip onClick={() => onFacet({ key: "alignment", value: c.alignment })}>{c.alignment}</FacetChip>}
          {c.locations?.slice(0, 2).map((loc) => (
            <FacetChip key={loc} onClick={() => onFacet({ key: "locations", value: loc })}>
              {loc}
            </FacetChip>
          ))}
          {c.faction?.slice(0, 1).map((f) => (
            <FacetChip key={f} onClick={() => onFacet({ key: "faction", value: f })}>
              {f}
            </FacetChip>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="w-full">
          {c.powers?.slice(0, 1).map((p) => (
            <div key={p.name} className="text-xs mb-1 flex items-center justify-between text-white font-bold">
              <span className="truncate pr-2">{p.name}</span>
              <span>{p.level}/10</span>
            </div>
          ))}
          <PowerMeter level={c.powers?.[0]?.level ?? 0} />
        </div>
        <div className="flex gap-2 ml-3">
          <Button variant="secondary" className="font-bold" onClick={openProfile}>
            Read <ArrowRight className="ml-1" size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Gallery({ images, cover, name }) {
  const [idx, setIdx] = useState(0);
  const imgs = [cover, ...(images || [])].filter(Boolean);
  if (!imgs.length) return null;
    return (
      <div className="h-64 w-full rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
        <Insignia label={name} size={64} />
      </div>
    );
  return (
    <div className="relative group">
      <ImageSafe src={imgs[idx]} alt={`${name} gallery ${idx + 1}`} fallbackLabel={name} className="w-full h-64 object-cover rounded-xl border border-white/10" />
      {imgs.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition"
            onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition"
            onClick={() => setIdx((i) => (i + 1) % imgs.length)}
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <span key={i} className={cx("h-1.5 w-1.5 rounded-full", i === idx ? "bg-white" : "bg-white/60")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CharacterModal({ open, onClose, c, onFacet, onUseInSim }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);
  if (!open || !c) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Aurora />
      <div className="absolute inset-0 bg-black/65 backdrop-blur" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white/10 border border-white/20 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,.5)] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Insignia label={c.name} size={40} />
            <div>
              <div className="text-2xl font-black tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,.7)] text-white">{c.name}</div>
              {c.era && <div className="text-[11px] uppercase tracking-widest text-white font-bold">{c.era}</div>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onUseInSim(c.id)} className="font-bold">
              Use in Sim
            </Button>
            <Button variant="ghost" onClick={onClose} aria-label="Close">
              <X />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-h-[75vh] overflow-y-auto text-white">
          <div className="space-y-4">
            <Gallery images={c.gallery} cover={c.cover} name={c.name} />
            <div className="space-y-2">
              <div className="text-sm font-bold">Short Description</div>
              <div className="font-semibold">{c.shortDesc || "—"}</div>
              <div className="text-sm mt-3 font-bold">Bio</div>
              <div className="whitespace-pre-wrap">{c.longDesc || "—"}</div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {(c.alias || []).map((a) => (
                <FacetChip key={a} onClick={() => onFacet({ key: "alias", value: a })}>
                  {a}
                </FacetChip>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {c.gender && (
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                  <div className="mb-1 font-bold">Gender</div>
                  <div className="font-extrabold">{c.gender}</div>
                </div>
              )}
              {c.alignment && (
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                  <div className="mb-1 font-bold">Alignment</div>
                  <div className="font-extrabold">{c.alignment}</div>
                </div>
              )}
              {c.status && (
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                  <div className="mb-1 font-bold">Status</div>
                  <div className="font-extrabold">{c.status}</div>
                </div>
              )}
              {c.firstAppearance && (
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                  <div className="mb-1 font-bold">First Appearance</div>
                  <div className="font-extrabold">{c.firstAppearance}</div>
                </div>
              )}
            </div>
            {!!(c.locations || []).length && (
              <div>
                <div className="text-sm mb-2 font-bold flex items-center gap-2">
                  <MapPin size={14} /> Locations
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.locations.map((loc) => (
                    <FacetChip key={loc} onClick={() => onFacet({ key: "locations", value: loc })}>
                      {loc}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            {!!(c.faction || []).length && (
              <div>
                <div className="text-sm mb-2 font-bold flex items-center gap-2">
                  <Crown size={14} /> Factions/Teams
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.faction.map((f) => (
                    <FacetChip key={f} onClick={() => onFacet({ key: "faction", value: f })}>
                      {f}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            {!!(c.tags || []).length && (
              <div>
                <div className="text-sm mb-2 font-bold flex items-center gap-2">
                  <Layers3 size={14} /> Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <FacetChip key={t} onClick={() => onFacet({ key: "tags", value: t })}>
                      {t}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            {/* Alliances */}
            <div>
              <div className="text-sm mb-2 font-bold flex items-center gap-2">
                <Users size={14} /> Alliances
              </div>
              <div className="flex flex-wrap gap-2">
                {__ALL_CHARS.filter((x) => x.id !== c.id && (x.faction || []).some((f) => (c.faction || []).includes(f)))
                  .slice(0, 12)
                  .map((a) => (
                    <FacetChip key={a.id} onClick={() => onFacet({ key: "faction", value: (a.faction || [""])[0] || "" })}>
                      {a.name}
                    </FacetChip>
                  ))}
                {!__ALL_CHARS.filter((x) => x.id !== c.id && (x.faction || []).some((f) => (c.faction || []).includes(f))).length && (
                  <span className="text-white/70 font-semibold">No listed allies</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm mb-2 font-bold flex items-center gap-2">
                <Atom size={14} /> Powers
              </div>
              <div className="space-y-2">
                {c.powers.map((p) => (
                  <div key={p.name} className="text-sm">
                    <div className="mb-1 flex items-center justify-between font-bold">
                      <span className="truncate pr-2">{p.name}</span>
                      <span>{p.level}/10</span>
                    </div>
                    <PowerMeter level={p.level} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** -------------------- Filters & Search -------------------- */
function matchesFilters(c, f, combineAND, query) {
  const terms = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
  const hay = [
    c.name,
    ...(c.alias || []),
    ...((c.powers || []).map((p) => p.name) || []),
    ...(c.locations || []),
    ...(c.tags || []),
    c.shortDesc || "",
    c.longDesc || "",
  ]
    .join(" ")
    .toLowerCase();
  const searchMatch = terms.every((t) => hay.includes(t));
  const checks = [];
  if (f.gender) checks.push((c.gender || "").toLowerCase() === f.gender.toLowerCase());
  if (f.alignment) checks.push((c.alignment || "").toLowerCase() === f.alignment.toLowerCase());
  if (f.locations?.length) checks.push(f.locations.every((v) => (c.locations || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.faction?.length) checks.push(f.faction.every((v) => (c.faction || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.tags?.length) checks.push(f.tags.every((v) => (c.tags || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.era?.length) checks.push(f.era.some((v) => (c.era || "").toLowerCase() === v.toLowerCase()));
  if (f.status?.length) checks.push(f.status.some((v) => (c.status || "").toLowerCase() === v.toLowerCase()));
  if (f.stories?.length) checks.push(f.stories.every((v) => (c.stories || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.alias?.length) checks.push(f.alias.some((v) => (c.alias || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.powers?.length) checks.push(f.powers.every((v) => (c.powers || []).map((p) => p.name.toLowerCase()).includes(v.toLowerCase())));
  const filterMatch = combineAND ? checks.every(Boolean) : checks.some(Boolean) || Object.keys(f).length === 0;
  return searchMatch && filterMatch;
}

/** -------------------- Featured Hero (manual, fixed height) -------------------- */
function pickDaily(items, salt = "") {
  if (!items.length) return null;
  const d = todayKey();
  const r = seededRandom(d + salt)();
  return items[Math.floor(r * items.length)] ?? items[0];
}
function HeroSection({ data, onOpen, onFacet }) {
  const character = useMemo(() => pickDaily(data, "char"), [data]);
  const allFactions = useMemo(() => Array.from(new Set(data.flatMap((d) => d.faction || []))), [data]);
  const allLocations = useMemo(() => Array.from(new Set(data.flatMap((d) => d.locations || []))), [data]);
  const allPowers = useMemo(() => Array.from(new Set(data.flatMap((d) => d.powers.map((p) => p.name)))), [data]);
  const faction = useMemo(() => pickDaily(allFactions, "faction"), [allFactions]);
  const location = useMemo(() => pickDaily(allLocations, "location"), [allLocations]);
  const power = useMemo(() => pickDaily(allPowers, "power"), [allPowers]);
  const slides = (character
    ? [
        {
          type: "Character",
          render: () => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-72">
              <ImageSafe src={character.cover || character.gallery[0]} alt={character.name} fallbackLabel={character.name} className="h-72 w-full object-cover" />
              <div className="p-6 flex flex-col gap-3 text-white">
                <div className="text-xs uppercase tracking-widest font-extrabold flex items-center gap-2">
                  <Clock size={14} /> Featured Character
                </div>
                <div className="text-2xl font-extrabold">{character.name}</div>
                <div className="font-bold line-clamp-3">{character.shortDesc || character.longDesc}</div>
                <div className="mt-auto flex gap-3">
                  <Button onClick={() => onOpen(character)} className="font-bold">
                    View Profile <ArrowRight className="ml-1" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ),
        },
      ]
    : [])
    .concat(
      faction
        ? [
            {
              type: "Faction",
              render: () => (
                <div className="h-72 p-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Insignia label={String(faction)} size={56} variant="faction" />
                    <div>
                      <div className="text-xs uppercase tracking-widest font-extrabold">Featured Faction</div>
                      <div className="text-2xl font-extrabold">{String(faction)}</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => onFacet({ key: "faction", value: String(faction) })} className="font-bold">
                    View Members
                  </Button>
                </div>
              ),
            },
          ]
        : []
    )
    .concat(
      location
        ? [
            {
              type: "Location",
              render: () => (
                <div className="h-72 p-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Insignia label={String(location)} size={56} />
                    <div>
                      <div className="text-xs uppercase tracking-widest font-extrabold">Featured Location</div>
                      <div className="text-2xl font-extrabold">{String(location)}</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => onFacet({ key: "locations", value: String(location) })} className="font-bold">
                    View Residents
                  </Button>
                </div>
              ),
            },
          ]
        : []
    )
    .concat(
      power
        ? [
            {
              type: "Power",
              render: () => (
                <div className="h-72 p-6 flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <Insignia label={String(power)} size={56} />
                    <div>
                      <div className="text-xs uppercase tracking-widest font-extrabold">Featured Power</div>
                      <div className="text-2xl font-extrabold">{String(power)}</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => onFacet({ key: "powers", value: String(power) })} className="font-bold">
                    View Wielders
                  </Button>
                </div>
              ),
            },
          ]
        : []
    );
  const [idx, setIdx] = useState(0);
  const handleKey = (e) => {
    if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + slides.length) % slides.length);
    if (e.key === "ArrowRight") setIdx((i) => (i + 1) % slides.length);
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length]);
  if (!slides.length) return null;
  return (
    <Card className="bg-gradient-to-tr from-indigo-600/30 via-fuchsia-600/20 to-amber-400/20 border-white/20 backdrop-blur-xl overflow-hidden text-white">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="text-sm font-extrabold tracking-wide">Today’s Featured</div>
        <div className="flex gap-2 text-xs font-bold">
          <span>{slides[idx].type}</span> <span>•</span> <span>{todayKey()}</span>
        </div>
      </div>
      <div className="border-t border-white/10 relative">
        {slides[idx].render()}
        <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white" onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white" onClick={() => setIdx((i) => (i + 1) % slides.length)} aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </Card>
  );
}

/** -------------------- Story Chips -------------------- */
function StoryChips({ data, onFacet }) {
  const top = useMemo(() => {
    const f = new Map();
    for (const c of data) (c.stories || []).forEach((s) => f.set(s, (f.get(s) || 0) + 1));
    return Array.from(f.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([k]) => k);
  }, [data]);
  if (!top.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {top.map((s) => (
        <FacetChip key={s} onClick={() => onFacet({ key: "stories", value: s })}>
          {s}
        </FacetChip>
      ))}
    </div>
  );
}

/** -------------------- Infinite Grid -------------------- */
const PAGE_SIZE = 24;
function CharacterGrid({ data, onOpen, onFacet, onUseInSim }) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [data]);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 200) setPage((p) => (p * PAGE_SIZE < data.length ? p + 1 : p));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [data.length]);
  const slice = data.slice(0, page * PAGE_SIZE);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-24">
      {slice.map((c) => (
        <CharacterCard key={c.id} c={c} onOpen={onOpen} onFacet={onFacet} onUseInSim={onUseInSim} />
      ))}
      {!slice.length && <div className="text-white font-extrabold">No characters match your filters yet.</div>}
    </div>
  );
}

/** -------------------- Battle Arena++ -------------------- */
function scoreCharacter(c) {
  const base = (c.powers || []).reduce((s, p) => s + (isFinite(p.level) ? p.level : 0), 0);
  const elite = (c.tags || []).some((t) => /leader|legend|mythic|prime/i.test(t)) ? 3 : 0;
  const eraMod = /old gods|ancient/i.test(c.era || "") ? 1.07 : 1;
  const withBias = (base + elite) * scoreBiasByBeing(c) * eraMod;
  return Math.round(withBias);
}
function rngLuck(max) {
  const r = (Math.random() * 2 - 1) * 0.18 * max; // ±18%
  return Math.round(r);
}
function scoreBiasByBeing(c) {
  const text = [
    (c.tags || []).join(" "),
    (c.alias || []).join(" "),
    c.longDesc || "",
    c.shortDesc || "",
  ].join(" ").toLowerCase();
  // crude but effective class detection
  const isGod = /(god|goddess|deity|divine|celestial|primordial)/i.test(text) || /old gods|ancient gods/i.test(c.era || "");
  const isAlien = /(alien|extraterrestrial|offworld|cosmic)/i.test(text);
  const isMeta = /(meta|mutant|enhanced|super soldier|augment)/i.test(text) || (c.powers || []).some((p) => p.level >= 7);
  // Multipliers — humans 1.0 baseline
  if (isGod) return 1.55; // requires stacked human to match
  if (isAlien) return 1.25;
  if (isMeta) return 1.12;
  return 1.0;
}

function duel(c1, c2) {
  const s1 = scoreCharacter(c1);
  const s2 = scoreCharacter(c2);
  const maxBase = Math.max(s1, s2) || 1;
  const swings = 3;
  let h1 = 100,
    h2 = 100;
  const logs = [];
  for (let i = 0; i < swings; i++) {
    const luck1 = rngLuck(maxBase);
    const luck2 = rngLuck(maxBase);
    const hit1 = Math.max(0, s1 + luck1 - Math.max(0, s2 * 0.35));
    const hit2 = Math.max(0, s2 + luck2 - Math.max(0, s1 * 0.35));
    const scale = 34 / Math.max(1, Math.max(hit1, hit2));
    const dmg1 = Math.round(hit1 * scale);
    const dmg2 = Math.round(hit2 * scale);
    h2 = Math.max(0, h2 - dmg1);
    h1 = Math.max(0, h1 - dmg2);
    logs.push({ swing: i + 1, dmg1, dmg2, h1, h2 });
  }
  let winner = h1 === h2 ? (s1 >= s2 ? c1 : c2) : h1 > h2 ? c1 : c2;
  let loser = winner === c1 ? c2 : c1;
  return { winner, loser, h1, h2, logs };
}

function HealthBar({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden border border-white/20">
      <div className="h-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Animated Lore shield with randomized micro-effects
function LoreGlyph() {
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const wobble = [0, -2, 2, -1, 1, 0];
  return (
    <motion.div
      animate={{ rotate: wobble, scale: [1, 1.02, 1], filter: ["drop-shadow(0 0 6px rgba(255,255,255,.25))", `drop-shadow(0 0 12px hsl(${(seed*37)%360},90%,60%))`, "drop-shadow(0 0 6px rgba(255,255,255,.25))"] }}
      transition={{ duration: 2 + (seed % 10) / 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
      title="Lore"
    >
      <Insignia label="Lore" size={54} variant="site" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-black tracking-wide">Lore</span>
      </div>
    </motion.div>
  );
}

/** Filters Drawer */
function FiltersDrawer({ open, onClose, values, filters, setFilters }) {
  if (!open) return null;
  const toggle = (key, value) => {
    setFilters((f) => {
      const set = new Set([...(f[key] || [])]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [key]: Array.from(set) };
    });
  };
  const Section = ({ title, keyName, items }) => (
    <div>
      <div className="text-xs uppercase tracking-widest font-extrabold mb-2">{title}</div>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
        {items.map((v) => (
          <FacetChip key={v} active={(filters[keyName] || []).includes(v)} onClick={() => toggle(keyName, v)}>
            {v}
          </FacetChip>
        ))}
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/10 backdrop-blur-2xl border-l border-white/20 p-5 text-white overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-black tracking-tight">Filters</div>
          <Button variant="ghost" onClick={onClose}><X /></Button>
        </div>
        <div className="space-y-5">
          {values.gender.length > 0 && <Section title="Gender" keyName="gender" items={values.gender} />}
          {values.alignment.length > 0 && <Section title="Alignment" keyName="alignment" items={values.alignment} />}
          {values.faction.length > 0 && <Section title="Faction" keyName="faction" items={values.faction} />}
          {values.locations.length > 0 && <Section title="Locations" keyName="locations" items={values.locations} />}
          {values.era.length > 0 && <Section title="Era" keyName="era" items={values.era} />}
          {values.status.length > 0 && <Section title="Status" keyName="status" items={values.status} />}
          {values.tags.length > 0 && <Section title="Tags" keyName="tags" items={values.tags} />}
          {values.powers.length > 0 && <Section title="Powers" keyName="powers" items={values.powers} />}
        </div>
      </div>
    </div>
  );
}

function BackToTop() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setShowTop(scrollTop > 300);
      setShowBottom(scrollTop + clientHeight < scrollHeight - 300);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      {showTop && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.08, rotate: [-2, 2, 0] }}
          whileTap={{ scale: 0.95, rotate: 0 }}
          className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-black/70 text-white border border-white/20 shadow-xl"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp />
        </motion.button>
      )}
      {showBottom && (
        <motion.button
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
          whileHover={{ scale: 1.08, rotate: [2, -2, 0] }}
          whileTap={{ scale: 0.95, rotate: 0 }}
          className="fixed bottom-5 right-20 z-40 p-3 rounded-full bg-black/70 text-white border border-white/20 shadow-xl"
          aria-label="Back to bottom"
          title="Back to bottom"
        >
          <ArrowDown />
        </motion.button>
      )}
    </>
  );
}

function Controls({ query, setQuery, openFilters, setOpenFilters, sortMode, setSortMode, onClear, onJumpArena }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
      <div className="flex-1">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search characters, powers, locations…" />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="rounded-xl bg-black/60 text-white border border-white/20 px-3 py-2 text-sm font-bold"
        >
          <option value="default">Default</option>
          <option value="random">Random</option>
          <option value="faction">By Faction</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
          <option value="most">From Most Powerful</option>
          <option value="least">From Least Powerful</option>
          <option value="simresults">As per user's simulation battle results</option>
        </select>
        <Button variant="outline" onClick={() => setOpenFilters(true)} className="font-bold border-amber-300 text-amber-300">
          <Filter className="mr-1" size={16} /> Filters
        </Button>
        <Button variant="ghost" onClick={onClear} className="font-bold">Clear</Button>
        <Button variant="secondary" onClick={onJumpArena} className="font-bold">Arena</Button>
      </div>
    </div>
  );
}

function Simulator({ data, selectedIds, setSelectedIds, onOpen }) {
  const [animating, setAnimating] = useState(false);
  const [hp, setHp] = useState({ left: 100, right: 100 });
  const [shake, setShake] = useState(false);
  const left = data.find((c) => c.id === selectedIds[0]);
  const right = data.find((c) => c.id === selectedIds[1]);
  const canFight = !!left && !!right && !animating;

  // Subtle shake/glow when fighters change
  useEffect(() => {
    if (selectedIds.length) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [selectedIds.join('|')]);

  const release = (id) => setSelectedIds((ids) => ids.filter((x) => x !== id));

  const randomise = () => {
    if (data.length < 2) return;
    const r1 = Math.floor(Math.random() * data.length);
    let r2 = Math.floor(Math.random() * data.length);
    if (r2 === r1) r2 = (r2 + 1) % data.length;
    setSelectedIds([data[r1].id, data[r2].id]);
    setHp({ left: 100, right: 100 });
  };

  const runFight = async () => {
    if (!left || !right) return;
    setAnimating(true);
    setHp({ left: 100, right: 100 });
    const outcome = duel(left, right);
    for (const step of outcome.logs) {
      await new Promise((r) => setTimeout(r, 500));
      setHp({ left: step.h1, right: step.h2 });
    }
    await new Promise((r) => setTimeout(r, 600));
    setAnimating(false);
  };

  const StatBlock = ({ c }) => (
    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
      {/* quick chips */}
      <div className="flex flex-wrap gap-2">
        {(c.alias || []).map((a) => (
          <Badge key={a} className="bg-white/10 border border-white/20">{a}</Badge>
        ))}
      </div>
      {/* grid stats */}
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        {c.gender && (
          <div className="bg-white/10 p-2 rounded-lg border border-white/20"><div className="font-bold">Gender</div><div className="font-extrabold">{c.gender}</div></div>
        )}
        {c.alignment && (
          <div className="bg-white/10 p-2 rounded-lg border border-white/20"><div className="font-bold">Alignment</div><div className="font-extrabold">{c.alignment}</div></div>
        )}
        {c.status && (
          <div className="bg-white/10 p-2 rounded-lg border border-white/20"><div className="font-bold">Status</div><div className="font-extrabold">{c.status}</div></div>
        )}
        {c.era && (
          <div className="bg-white/10 p-2 rounded-lg border border-white/20"><div className="font-bold">Era</div><div className="font-extrabold">{c.era}</div></div>
        )}
        {c.firstAppearance && (
          <div className="bg-white/10 p-2 rounded-lg border border-white/20 col-span-2"><div className="font-bold">First Appearance</div><div className="font-extrabold">{c.firstAppearance}</div></div>
        )}
      </div>
      {!!(c.locations || []).length && (
        <div>
          <div className="text-[11px] mb-1 font-bold flex items-center gap-1"><MapPin size={12}/> Locations</div>
          <div className="flex flex-wrap gap-2">{c.locations.map((v) => (<Badge key={v} className="bg-white/10 border border-white/20">{v}</Badge>))}</div>
        </div>
      )}
      {!!(c.faction || []).length && (
        <div>
          <div className="text-[11px] mb-1 font-bold flex items-center gap-1"><Crown size={12}/> Factions</div>
          <div className="flex flex-wrap gap-2">{c.faction.map((v) => (<Badge key={v} className="bg-white/10 border border-white/20">{v}</Badge>))}</div>
        </div>
      )}
      {!!(c.tags || []).length && (
        <div>
          <div className="text-[11px] mb-1 font-bold flex items-center gap-1"><Layers3 size={12}/> Tags</div>
          <div className="flex flex-wrap gap-2">{c.tags.map((v) => (<Badge key={v} className="bg-white/10 border border-white/20">{v}</Badge>))}</div>
        </div>
      )}
      <div>
        <div className="text-[11px] mb-1 font-bold flex items-center gap-1"><Atom size={12}/> Powers</div>
        <div className="space-y-1.5">
          {(c.powers || []).map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-[12px] font-bold"><span className="truncate pr-2">{p.name}</span><span>{p.level}/10</span></div>
              <PowerMeter level={p.level} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className={cx("border-white/20 bg-white/5 backdrop-blur-xl text-white p-4 md:p-6 mt-6", shake ? "ring-2 ring-amber-300" : "") }>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Swords />
          <div className="text-lg font-black tracking-tight">Battle Arena</div>
          <Badge className="bg-amber-300 text-black">Beta</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={randomise} className="font-bold"><RefreshCcw size={16} className="mr-1"/> Randomise</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* LEFT FIGHTER */}
        <div className={cx("rounded-xl p-3 border border-white/15 bg-white/5", left ? "" : "opacity-70")} style={{ boxShadow: left ? "0 0 0 2px rgba(250,204,21,.6)" : undefined }}>
          <div className="text-xs font-bold mb-2">Fighter A</div>
          {left ? (
            <div className={cx("space-y-2", animating ? "pointer-events-none" : "") }>
              <div className="text-sm font-extrabold">{left.name}</div>
              <HealthBar value={hp.left} />
              <div className="text-[11px] uppercase tracking-widest">{left.faction?.[0] || "—"}</div>
              <div className="text-xs opacity-90">{left.shortDesc || left.longDesc}</div>
              <StatBlock c={left} />
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" onClick={() => onOpen(left)}>View</Button>
                <Button variant="outline" onClick={() => release(left.id)}>Release</Button>
              </div>
            </div>
          ) : (
            <div className="text-white/60 text-sm">Empty slot. Choose a character.</div>
          )}
        </div>

        {/* SWORD + ACTIONS */}
        <div className="flex flex-col items-center justify-center gap-3">
          <motion.div
            animate={animating ? { rotate: [0, -20, 20, -12, 12, 0], scale: [1, 1.06, 1] } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, repeat: animating ? 3 : 0, ease: "easeInOut" }}
            className={cx("p-3 rounded-full border border-white/20", animating ? "bg-amber-300/20" : "bg-white/5")}
          >
            <Swords size={32} />
          </motion.div>
          <Button onClick={runFight} disabled={!canFight} className="font-black">{animating ? "Fighting…" : "Fight"}</Button>
          {left && right && !animating && (hp.left !== 100 || hp.right !== 100) && (
            <div className="text-xs font-extrabold px-3 py-1 rounded-full bg-black text-white/90">
              {hp.left === hp.right ? "Draw" : hp.left > hp.right ? left.name : right.name}
            </div>
          )}
        </div>

        {/* RIGHT FIGHTER */}
        <div className={cx("rounded-xl p-3 border border-white/15 bg-white/5", right ? "" : "opacity-70")} style={{ boxShadow: right ? "0 0 0 2px rgba(250,204,21,.6)" : undefined }}>
          <div className="text-xs font-bold mb-2">Fighter B</div>
          {right ? (
            <div className={cx("space-y-2", animating ? "pointer-events-none" : "") }>
              <div className="text-sm font-extrabold">{right.name}</div>
              <HealthBar value={hp.right} />
              <div className="text-[11px] uppercase tracking-widest">{right.faction?.[0] || "—"}</div>
              <div className="text-xs opacity-90">{right.shortDesc || right.longDesc}</div>
              <StatBlock c={right} />
              <div className="flex gap-2 pt-1">
                <Button variant="ghost" onClick={() => onOpen(right)}>View</Button>
                <Button variant="outline" onClick={() => release(right.id)}>Release</Button>
              </div>
            </div>
          ) : (
            <div className="text-white/60 text-sm">Empty slot. Choose a character.</div>
          )}
        </div>
      </div>
    </Card>
  );
}

/** -------------------- App -------------------- */
export default function App() {
  const { data, loading, error, refetch } = useCharacters();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [combineAND, setCombineAND] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [sortMode, setSortMode] = useState("default");
  const [selectedIds, setSelectedIds] = useState([]);

  const onOpen = (c) => { setActive(c); setOpen(true); };

  // if both slots full and user adds a third, replace the oldest
  const onUseInSim = (id) => {
    setSelectedIds((ids) => {
      if (ids.includes(id)) return ids;
      if (ids.length < 2) return [...ids, id];
      return [ids[1], id]; // replace oldest
    });
    // scroll to arena
    const anchor = document.getElementById("arena-anchor");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const allValues = useMemo(() => ({
    gender: Array.from(new Set(data.map((d) => d.gender).filter(Boolean))),
    alignment: Array.from(new Set(data.map((d) => d.alignment).filter(Boolean))),
    faction: Array.from(new Set(data.flatMap((d) => d.faction || []))),
    locations: Array.from(new Set(data.flatMap((d) => d.locations || []))),
    era: Array.from(new Set(data.map((d) => d.era).filter(Boolean))),
    status: Array.from(new Set(data.map((d) => d.status).filter(Boolean))),
    tags: Array.from(new Set(data.flatMap((d) => d.tags || []))),
    powers: Array.from(new Set(data.flatMap((d) => d.powers.map((p) => p.name)))),
  }), [data]);

  const filtered = useMemo(() => data.filter((c) => matchesFilters(c, filters, combineAND, query)), [data, filters, combineAND, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortMode) {
      case "random":
        return arr.sort(() => Math.random() - 0.5);
      case "faction":
        return arr.sort((a, b) => String(a.faction?.[0] || "").localeCompare(String(b.faction?.[0] || "")));
      case "az":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "za":
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case "most":
        return arr.sort((a, b) => scoreCharacter(b) - scoreCharacter(a));
      case "least":
        return arr.sort((a, b) => scoreCharacter(a) - scoreCharacter(b));
      case "simresults":
        return arr; // placeholder until we persist history
      default:
        return arr;
    }
  }, [filtered, sortMode]);

  const clearAll = () => { setQuery(""); setFilters({}); };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Aurora />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LoreGlyph />
            <div>
              <div className="text-2xl md:text-3xl font-black tracking-tight">Loremaker Universe</div>
              <div className="text-xs uppercase tracking-widest text-white/80 font-bold">Welcome to the official home of all the Loremaker universe and characters created by Menelek Makonnen</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Switch id="mode" checked={combineAND} onChange={setCombineAND} />
            <Badge className="bg-white/10 border border-white/20">{combineAND ? "AND" : "Single"}</Badge>
          </div>
        </div>

        <HeroSection data={data} onOpen={onOpen} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} />

        {/* Arena pinned right under Hero */}
        <div id="arena-anchor">
          <Simulator data={sorted} selectedIds={selectedIds} setSelectedIds={setSelectedIds} onOpen={onOpen} />
        </div>

        <div className="mt-6">
          <Controls
            query={query}
            setQuery={setQuery}
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            sortMode={sortMode}
            setSortMode={setSortMode}
            onClear={clearAll}
            onJumpArena={() => document.getElementById("arena-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          />
        </div>

        <div className="mt-6">
          <StoryChips data={data} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} />
        </div>

        <div className="mt-6">
          <CharacterGrid data={sorted.filter((c) => !selectedIds.includes(c.id))} onOpen={onOpen} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} onUseInSim={onUseInSim} />
        </div>
      </div>

      <CharacterModal open={open} onClose={() => setOpen(false)} c={active} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} onUseInSim={(id) => { onUseInSim(id); setOpen(false); }} />

      <FiltersDrawer open={openFilters} onClose={() => setOpenFilters(false)} values={allValues} filters={filters} setFilters={setFilters} />

      <BackToTop />
    </div>
  );
}

/** -------------------- Minimal runtime tests (console) -------------------- */
(function runTinyTests() {
  try {
    console.group("Tests");
    const ps = parsePowers("Spellcraft:9, Teleportation(7), Reflexes 6");
    console.assert(ps.length === 3 && ps[0].level === 9 && ps[1].level === 7 && ps[2].level === 6, "parsePowers failed");
    const u = normalizeDriveUrl("https://drive.google.com/file/d/ABC123/view?usp=sharing");
    console.assert(u.includes("uc?export=view&id=ABC123"), "normalizeDriveUrl failed");
    const c = SAMPLE[0];
    const ok = matchesFilters(c, { faction: ["Earthguard"] }, false, "Mystic");
    console.assert(ok === true, "matchesFilters failed");
    const res = duel(SAMPLE[0], SAMPLE[1]);
    console.assert(res && res.winner && res.loser, "duel result structure");
    console.groupEnd();
  } catch (e) {
    console.error("Tests failed:", e);
  }
})();
