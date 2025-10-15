import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  MapPin,
  Layers,
  Atom,
  Clock,
  Crown,
  Swords,
  Sparkles,
  MessageCircle,
  Send,
  Bot,
  Home,
  BookOpen,
  Cpu,
  Newspaper,
  ExternalLink,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
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
    default: "bg.white text-black hover:bg-white/90".replace(".", "-"),
    secondary: "bg-black/70 text-white hover:bg-black",
    outline: "border border-white/30 text-white hover:bg-white/10",
    ghost: "text-white/90 hover:bg-white/10",
    destructive: "bg-red-600 text-white hover:bg-red-500",
  }[variant];
  return (
    <Tag className={cx(base, styles, className)} {...props}>
      {children}
    </Tag>
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
      onClick={() => onChange && onChange(!checked)}
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

const CHATBOT_WEBHOOK =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_LOREMAKER_CHAT_WEBHOOK || ""
    : window?.__NEXT_DATA__?.props?.pageProps?.chatbotWebhook ||
      process.env.NEXT_PUBLIC_LOREMAKER_CHAT_WEBHOOK ||
      "";

const TRACK_VISIT_WEBHOOK =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_LOREMAKER_TRACK_WEBHOOK || ""
    : window?.__NEXT_DATA__?.props?.pageProps?.trackVisitWebhook ||
      process.env.NEXT_PUBLIC_LOREMAKER_TRACK_WEBHOOK ||
      "";

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
const directDriveUrl = (id) => `https://drive.google.com/uc?export=view&id=${id}`;
function normalizeDriveUrl(url) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const host = u.hostname;
    if (host.includes("drive.google.com") || host.includes("drive.usercontent.google.com")) {
      const pathMatch = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = (pathMatch && pathMatch[1]) || u.searchParams.get("id");
      if (id) return directDriveUrl(id);
      if (u.pathname.startsWith("/uc") && u.searchParams.get("id")) {
        u.searchParams.set("export", "view");
        return u.toString();
      }
    }
    const immediateHost = url.split("//")[1]?.split("/")[0] || "";
    if (/^lh\d+\.googleusercontent\.com$/i.test(immediateHost) || /drive\.googleusercontent\.com$/i.test(immediateHost)) {
      return url;
    }
    return url;
  } catch {
    return url;
  }
}

function extractDriveImages(text) {
  if (!text) return [];
  const urls = new Set();
  const directRx = /https?:\/\/(?:drive\.google\.com|drive\.usercontent\.google\.com)\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+)|(?:u\/\d\/)?uc\?(?:[^\s]*?&)?id=([a-zA-Z0-9_-]+)|thumbnail\?id=([a-zA-Z0-9_-]+)|download\?id=([a-zA-Z0-9_-]+))/gi;
  let match;
  while ((match = directRx.exec(text))) {
    const id = match[1] || match[2] || match[3] || match[4] || match[5];
    if (id) urls.add(directDriveUrl(id));
  }
  const cdnRx = /https?:\/\/lh\d+\.googleusercontent\.com\/[a-zA-Z0-9_\-\/=.]+/gi;
  while ((match = cdnRx.exec(text))) {
    urls.add(match[0]);
  }
  return Array.from(urls);
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
  const descImages = extractDriveImages([char.shortDesc, char.longDesc, (row.map((cell) => cell?.v || cell?.f || "") || []).join(" ")].join(" \n "));
  const uniqueGallery = new Set(char.gallery.filter(Boolean));
  if (!char.cover && descImages.length) {
    char.cover = descImages[0];
    uniqueGallery.add(descImages[0]);
  }
  descImages.forEach((img) => {
    if (!uniqueGallery.has(img)) {
      uniqueGallery.add(img);
      char.gallery.push(img);
    }
  });
  char.gallery = Array.from(uniqueGallery);
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
  const seed = c.id || c.name || "character";
  const powers = (c.powers || []).map((p, idx) => {
    const label = p.name || `Power ${idx + 1}`;
    const base = Math.max(0, Math.min(10, Number(p.level) || 0));
    const min = base ? Math.max(3, base - 2) : 3;
    const max = base ? Math.min(10, base + 2) : 9;
    const level = dailyInt(`${seed}|${label}`, min, max);
    return { ...p, level };
  });
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
  const base = label || "Lore";
  const initials =
    base
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "LM";
  const text = variant === "site" ? base.toUpperCase().slice(0, 4) : initials;
  const fontSize = variant === "site" ? 14 : 20;
  const letterSpacing = variant === "site" ? 2.4 : 0;
  const hue = Math.abs([...base].reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
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
        <text
          x="32"
          y={variant === "site" ? 36 : 38}
          textAnchor="middle"
          fontFamily="ui-sans-serif,system-ui"
          fontWeight="900"
          fontSize={fontSize}
          fill="#fff"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.6))", letterSpacing }}
        >
          {text}
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
function CharacterCard({ c, onOpen, onFacet, onUseInSim, highlight }) {
  const [pulse, setPulse] = useState(false);
  const openProfile = () => onOpen(c);
  const triggerSim = () => {
    setPulse(true);
    onUseInSim(c.id);
    setTimeout(() => setPulse(false), 480);
  };
  return (
    <motion.div
      animate={pulse || highlight ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="group"
    >
      <Card
        className={cx(
          "hover:shadow-2xl hover:shadow-fuchsia-500/15 transition overflow-hidden",
          pulse || highlight
            ? "ring-2 ring-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.35)]"
            : ""
        )}
      >
        <div className="relative">
          <button onClick={openProfile} className="block text-left w-full">
            <ImageSafe src={c.cover || c.gallery[0]} alt={c.name} fallbackLabel={c.name} className="h-56 w-full object-cover" />
          </button>
          <div className="absolute left-2 top-2 flex flex-col gap-2 items-start">
            <div onClick={openProfile} className="cursor-pointer">
              <Insignia label={c.faction?.[0] || c.name} size={36} variant={c.faction?.length ? "faction" : "character"} expandableName={c.name} />
            </div>
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
    </motion.div>
  );
}

function Gallery({ images, cover, name }) {
  const [idx, setIdx] = useState(0);
  const imgs = [cover, ...(images || [])].filter(Boolean);
  if (!imgs.length)
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
                  <Layers size={14} /> Tags
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
  const norm = (v) => (Array.isArray(v) ? v : v != null ? [v] : []);
  const checks = [];
  const _fg = norm(f.gender).map((x) => String(x).toLowerCase());
  if (_fg.length) checks.push(_fg.includes(String(c.gender || "").toLowerCase()));
  const _fa = norm(f.alignment).map((x) => String(x).toLowerCase());
  if (_fa.length) checks.push(_fa.includes(String(c.alignment || "").toLowerCase()));
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
  const slides = [];
  if (character) {
    slides.push({
      type: "Character",
      onClick: () => onOpen(character),
      content: (
        <div className="grid h-72 grid-cols-1 gap-0 md:grid-cols-2">
          <ImageSafe src={character.cover || character.gallery[0]} alt={character.name} fallbackLabel={character.name} className="h-72 w-full object-cover" />
          <div className="flex flex-col gap-3 p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest">
              <Clock size={14} /> Featured Character
            </div>
            <div className="text-2xl font-extrabold">{character.name}</div>
            <div className="font-bold line-clamp-3 text-white/90">{character.shortDesc || character.longDesc}</div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(character);
                }}
                className="bg-white text-black hover:bg-white/90"
              >
                Character Profile
              </Button>
              {character.faction?.map((factionName) => (
                <Button
                  key={`hero-faction-${factionName}`}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFacet({ key: "faction", value: factionName });
                  }}
                  className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  {factionName}
                </Button>
              ))}
              {character.gender && (
                <Button
                  key="hero-gender"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFacet({ key: "gender", value: character.gender });
                  }}
                  className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  {character.gender}
                </Button>
              )}
              {(character.powers || []).slice(0, 3).map((p) => (
                <Button
                  key={`hero-power-${p.name}`}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFacet({ key: "powers", value: p.name });
                  }}
                  className="border border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  {p.name}
                </Button>
              ))}
            </div>
            <div className="mt-auto text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Click to open profile</div>
          </div>
        </div>
      ),
    });
  }
  if (faction) {
    slides.push({
      type: "Faction",
      onClick: () => onFacet({ key: "faction", value: String(faction) }),
      content: (
        <div className="flex h-72 items-center justify-between gap-6 p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(faction)} size={56} variant="faction" />
            <div>
              <div className="text-xs uppercase tracking-widest font-extrabold">Featured Faction</div>
              <div className="text-2xl font-extrabold">{String(faction)}</div>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onFacet({ key: "faction", value: String(faction) });
            }}
            className="bg-white text-black hover:bg-white/90"
          >
            View Members
          </Button>
        </div>
      ),
    });
  }
  if (location) {
    slides.push({
      type: "Location",
      onClick: () => onFacet({ key: "locations", value: String(location) }),
      content: (
        <div className="flex h-72 items-center justify-between gap-6 p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(location)} size={56} />
            <div>
              <div className="text-xs uppercase tracking-widest font-extrabold">Featured Location</div>
              <div className="text-2xl font-extrabold">{String(location)}</div>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onFacet({ key: "locations", value: String(location) });
            }}
            className="bg-white text-black hover:bg-white/90"
          >
            View Residents
          </Button>
        </div>
      ),
    });
  }
  if (power) {
    slides.push({
      type: "Power",
      onClick: () => onFacet({ key: "powers", value: String(power) }),
      content: (
        <div className="flex h-72 items-center justify-between gap-6 p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(power)} size={56} />
            <div>
              <div className="text-xs uppercase tracking-widest font-extrabold">Featured Power</div>
              <div className="text-2xl font-extrabold">{String(power)}</div>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onFacet({ key: "powers", value: String(power) });
            }}
            className="bg-white text-black hover:bg-white/90"
          >
            View Wielders
          </Button>
        </div>
      ),
    });
  }
  const [idx, setIdx] = useState(0);
  const activeRef = useRef(null);
  useEffect(() => {
    if (!slides.length) return undefined;
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + slides.length) % slides.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % slides.length);
      if ((e.key === "Enter" || e.key === " ") && document.activeElement === activeRef.current) {
        e.preventDefault();
        slides[idx].onClick?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length, idx, slides]);
  useEffect(() => {
    if (idx >= slides.length) setIdx(0);
  }, [slides.length, idx]);
  if (!slides.length) return null;
  const activeSlide = slides[idx];
  return (
    <Card className="overflow-hidden border-white/20 bg-gradient-to-tr from-indigo-600/30 via-fuchsia-600/20 to-amber-400/20 text-white backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.35em]">
          <Sparkles size={16} /> Today’s Featured
        </div>
        <div className="flex gap-2 text-xs font-bold">
          <span>{activeSlide.type}</span> <span>•</span> <span>{todayKey()}</span>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div
          role="button"
          tabIndex={0}
          ref={activeRef}
          onClick={() => activeSlide.onClick?.()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              activeSlide.onClick?.();
            }
          }}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          {activeSlide.content}
        </div>
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur"
          onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur"
          onClick={() => setIdx((i) => (i + 1) % slides.length)}
          aria-label="Next"
        >
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

const SITE_MENU = [
  { label: "Home", description: "Return to the mothership", href: "/", icon: Home },
  { label: "Biography", description: "Meet Menelek Makonnen", href: "/#bio", icon: BookOpen },
  { label: "AI Consultancy", description: "ICUNI — intelligence crafted", href: "https://icuni.co.uk", icon: Cpu, external: true },
  { label: "Blog", description: "Latest essays and updates", href: "/#blog", icon: Newspaper },
  { label: "Loremaker Database", description: "Dive deeper into the universe", href: "/loremaker", icon: Sparkles },
];

const LORE_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Biography", href: "/#bio" },
  { label: "AI", href: "https://icuni.co.uk", external: true },
  { label: "Loremaker", href: "/loremaker" },
  { label: "Blog", href: "/#blog" },
];

const SITE_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/menelek.makonnen", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@director_menelek", icon: Youtube },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/menelekmakonnen/", icon: Linkedin },
  { label: "Email", href: "mailto:admin@menelekmakonnen.com", icon: Mail },
];

function SiteMenuSection() {
  return (
    <section className="mt-12">
      <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.35em] text-white/70">
          <Sparkles size={14} /> Main Navigation
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SITE_MENU.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-white transition hover:-translate-y-1 hover:border-amber-300/50 hover:bg-black/55"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-amber-200">
                    <Icon size={20} />
                  </span>
                  <div>
                    <div className="text-sm font-black tracking-tight text-white">{item.label}</div>
                    <div className="text-xs text-white/70">{item.description}</div>
                  </div>
                </div>
                {item.external ? (
                  <ExternalLink size={16} className="text-white/60 group-hover:text-amber-200" />
                ) : (
                  <ArrowRight size={16} className="text-white/40 group-hover:text-amber-200" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/35 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
        <div>
          <div className="text-lg font-semibold text-white">Menelek Makonnen</div>
          <div className="text-sm text-white/70">Filmmaker • Worldbuilder</div>
          <div className="mt-4 flex flex-wrap gap-4 text-white/80">
            {SITE_SOCIALS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Icon size={16} /> {item.label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2 text-sm text-white/60">
          <p>© {year} Loremaker • ICUNI. All rights reserved.</p>
          <p className="mt-2 text-white/50">
            Curated with the same palette as the main site so you can traverse Menelek’s worlds without losing your bearings.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** -------------------- Infinite Grid -------------------- */
const PAGE_SIZE = 24;
function CharacterGrid({ data, onOpen, onFacet, onUseInSim, highlightId }) {
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
        <CharacterCard
          key={c.id}
          c={c}
          onOpen={onOpen}
          onFacet={onFacet}
          onUseInSim={onUseInSim}
          highlight={highlightId === c.id}
        />
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
  const origin = powerOriginProfile(c);
  const withBias = (base + elite) * origin.multiplier * eraMod;
  return Math.round(withBias);
}
function rngLuck(max) {
  const r = (Math.random() * 2 - 1) * 0.2 * max; // ±20%
  return Math.round(r);
}
function powerOriginProfile(c) {
  const text = [
    (c.tags || []).join(" "),
    (c.alias || []).join(" "),
    c.longDesc || "",
    c.shortDesc || "",
  ].join(" ").toLowerCase();
  // crude but effective class detection
  const isGod = /(god|goddess|deity|divine|celestial|primordial)/i.test(text) || /old gods|ancient gods/i.test(c.era || "");
  const isAlien = /(alien|extraterrestrial|offworld|cosmic)/i.test(text);
  const isMythic = /(demon|spirit|ethereal|eldritch|angel)/i.test(text);
  const isMeta = /(meta|mutant|enhanced|super soldier|augment)/i.test(text) || (c.powers || []).some((p) => p.level >= 7);
  if (isGod) return { label: "Divine", multiplier: 1.6 };
  if (isAlien) return { label: "Alien", multiplier: 1.28 };
  if (isMythic) return { label: "Mythic", multiplier: 1.24 };
  if (isMeta) return { label: "Enhanced", multiplier: 1.14 };
  if (/human|civilian/.test(text)) return { label: "Human", multiplier: 1.0 };
  return { label: "Legend", multiplier: 1.08 };
}

function duel(c1, c2) {
  const s1 = scoreCharacter(c1);
  const s2 = scoreCharacter(c2);
  const origin1 = powerOriginProfile(c1);
  const origin2 = powerOriginProfile(c2);
  const maxBase = Math.max(s1, s2) || 1;
  const swings = 3;
  let h1 = 100;
  let h2 = 100;
  const logs = [];
  for (let i = 0; i < swings; i += 1) {
    const luck1 = rngLuck(maxBase);
    const luck2 = rngLuck(maxBase);
    const offensive1 = s1 + luck1;
    const offensive2 = s2 + luck2;
    const shield1 = s1 * 0.35;
    const shield2 = s2 * 0.35;
    const delta1 = Math.max(0, offensive1 - shield2);
    const delta2 = Math.max(0, offensive2 - shield1);
    const combined = Math.max(1, delta1 + delta2);
    const dmg1 = Math.round((delta1 / combined) * 48);
    const dmg2 = Math.round((delta2 / combined) * 48);
    h2 = Math.max(0, h2 - dmg1);
    h1 = Math.max(0, h1 - dmg2);
    logs.push({
      swing: i + 1,
      luck1,
      luck2,
      offensive1,
      offensive2,
      dmg1,
      dmg2,
      h1,
      h2,
    });
  }
  let winner;
  if (h1 === h2) {
    winner = s1 === s2 ? (Math.random() > 0.5 ? c1 : c2) : s1 > s2 ? c1 : c2;
  } else {
    winner = h1 > h2 ? c1 : c2;
  }
  const loser = winner === c1 ? c2 : c1;
  return {
    winner,
    loser,
    h1,
    h2,
    logs,
    breakdown: {
      s1,
      s2,
      origin1,
      origin2,
    },
  };
}

function HealthBar({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden border border-white/20">
      <div className="h-full bg-gradient-to-r from-green-300 via-yellow-300 to-red-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Animated Lore shield with dramatic plasma aura
function LoreGlyph({ onRefresh }) {
  const [seed] = useState(() => Math.floor(Math.random() * 1000));
  const hue = (seed * 47) % 360;
  return (
    <motion.button
      type="button"
      onClick={onRefresh}
      whileTap={{ scale: 0.95, rotate: [-3, 3, 0] }}
      animate={{ rotate: [0, -3, 2, -1, 0], scale: [1, 1.04, 1], filter: [
        "drop-shadow(0 0 18px rgba(255,255,255,0.35))",
        `drop-shadow(0 0 28px hsla(${hue},100%,65%,0.75))`,
        "drop-shadow(0 0 18px rgba(255,255,255,0.35))",
      ] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      className="relative grid h-14 w-14 place-items-center overflow-visible"
      title="Refresh Lore data"
      aria-label="Refresh Lore data"
    >
      <motion.span
        className="absolute inset-0 -z-10 rounded-[1.35rem] bg-gradient-to-br from-indigo-500/60 via-fuchsia-400/55 to-amber-300/55 blur-lg"
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.18, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.span
        className="absolute -inset-2 -z-20 rounded-[1.6rem] bg-gradient-to-tr from-white/10 via-transparent to-white/10"
        animate={{ rotate: [0, 180, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <Insignia label="LORE" size={56} variant="site" />
      <motion.span
        className="absolute -bottom-2 right-0 text-amber-200"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={16} />
      </motion.span>
    </motion.button>
  );
}

function LoreTopNav({ onRefresh }) {
  return (
    <nav className="rounded-2xl border border-white/15 bg-black/45 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <LoreGlyph onRefresh={onRefresh} />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.4em] text-white/60">Menelek Makonnen</span>
            <span className="text-sm font-semibold text-white/80">Universe Portal</span>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm font-semibold text-white/70">
          {LORE_NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="rounded-xl border border-white/10 px-3 py-1.5 transition hover:border-amber-300/70 hover:text-white hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/** Filters Drawer */
function FiltersDrawer({ open, onClose, values, filters, setFilters, combineAND, setCombineAND }) {
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
    <div className="mb-5 rounded-2xl border border-white/15 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.3em] text-white/70">
        <span>Match Mode</span>
        <Badge className="bg-white/15 border border-white/25 text-[10px]">{combineAND ? "AND" : "Single"}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Require all selected facets</span>
        <Switch id="and-mode" checked={combineAND} onChange={setCombineAND} />
      </div>
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
          animate={{ y: [0, -6, 0], boxShadow: [
            "0 0 0 rgba(0,0,0,0.2)",
            "0 12px 24px rgba(251,191,36,0.35)",
            "0 0 0 rgba(0,0,0,0.2)",
          ] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-5 right-5 z-40 rounded-full border border-amber-300/60 bg-black/80 p-3 text-white shadow-xl"
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
          animate={{ y: [0, 6, 0], boxShadow: [
            "0 0 0 rgba(0,0,0,0.2)",
            "0 -12px 24px rgba(148,163,184,0.35)",
            "0 0 0 rgba(0,0,0,0.2)",
          ] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-5 right-24 z-40 rounded-full border border-white/30 bg-black/80 p-3 text-white shadow-xl"
          aria-label="Back to bottom"
          title="Back to bottom"
        >
          <ArrowDown />
        </motion.button>
      )}
    </>
  );
}

function Controls({ query, setQuery, setOpenFilters, sortMode, setSortMode, onClear, onToggleArena, arenaVisible }) {
  const options = [
    { id: "default", label: "Default" },
    { id: "random", label: "Random" },
    { id: "faction", label: "By Faction" },
    { id: "az", label: "A-Z" },
    { id: "za", label: "Z-A" },
    { id: "most", label: "From Most Powerful" },
    { id: "least", label: "From Least Powerful" },
  ];
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search characters, powers, locations…"
        />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
              onClick={() => setSortMode(opt.id)}
              aria-pressed={sortMode === opt.id}
              className={cx(
                "rounded-xl border px-3 py-2 text-xs font-black uppercase tracking-wide transition",
                sortMode === opt.id
                  ? "bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300 text-black shadow-[0_0_22px_rgba(251,191,36,0.45)] border-amber-100"
                  : "border-white/25 bg-white/10 text-white/80 hover:bg-white/15"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Button
            variant="ghost"
            onClick={() => setOpenFilters(true)}
            className="font-black border border-amber-200 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-black shadow-[0_0_22px_rgba(251,191,36,0.45)] hover:bg-amber-200 hover:shadow-[0_0_26px_rgba(251,191,36,0.55)]"
          >
            <Filter className="mr-1" size={16} /> Filters
          </Button>
          <Button variant="ghost" onClick={onClear} className="font-bold">
            Clear
          </Button>
          <Button
            variant={arenaVisible ? "secondary" : "ghost"}
            onClick={onToggleArena}
            className={cx("font-bold", arenaVisible ? "bg-emerald-400 text-black" : "border border-white/40 text-white/90 hover:bg-white/10")}
          >
            Arena
            <Badge className={cx("ml-2 text-[10px]", arenaVisible ? "bg-black/80 text-emerald-300" : "bg-white/15 text-white/70 border border-white/30")}>{arenaVisible ? "On" : "Off"}</Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Simulator({ data, selectedIds, setSelectedIds, onOpen, pulse }) {
  const [animating, setAnimating] = useState(false);
  const [hp, setHp] = useState({ left: 100, right: 100 });
  const [shake, setShake] = useState(false);
  const [phase, setPhase] = useState(-1);
  const [battle, setBattle] = useState(null);
  const [winner, setWinner] = useState(null);
  const [loser, setLoser] = useState(null);
  const [explosion, setExplosion] = useState(false);
  const [loserMark, setLoserMark] = useState(false);

  const left = data.find((c) => c.id === selectedIds[0]);
  const right = data.find((c) => c.id === selectedIds[1]);
  const canFight = !!left && !!right && !animating;
  const originLeft = left ? powerOriginProfile(left) : null;
  const originRight = right ? powerOriginProfile(right) : null;

  useEffect(() => {
    if (selectedIds.some(Boolean)) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [selectedIds.join("|")]);

  useEffect(() => {
    if (!pulse) return undefined;
    setShake(true);
    const t = setTimeout(() => setShake(false), 600);
    return () => clearTimeout(t);
  }, [pulse]);

  const setSlotValue = (side, value) => {
    setSelectedIds((ids) => {
      const next = Array.isArray(ids) && ids.length === 2 ? [...ids] : [ids[0] || null, ids[1] || null];
      next[side === "left" ? 0 : 1] = value;
      return next;
    });
  };

  const release = (side) => {
    setSlotValue(side, null);
    setBattle(null);
    setWinner(null);
    setLoser(null);
    setLoserMark(false);
    setPhase(-1);
    setHp((prev) => ({ ...prev, [side]: 100 }));
  };

  const randomiseCharacter = (side) => {
    if (!data.length) return;
    const otherId = side === "left" ? selectedIds[1] : selectedIds[0];
    const currentId = side === "left" ? selectedIds[0] : selectedIds[1];
    const pool = data.filter((c) => c.id !== otherId && c.id !== currentId);
    const candidates = pool.length ? pool : data.filter((c) => c.id !== otherId);
    if (!candidates.length) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setSlotValue(side, pick.id);
    setHp((prev) => ({ ...prev, [side]: 100 }));
    setWinner(null);
    setLoser(null);
    setLoserMark(false);
    setBattle(null);
    setPhase(-1);
  };

  const randomiseNext = () => {
    if (!selectedIds[0]) {
      randomiseCharacter("left");
    } else if (!selectedIds[1]) {
      randomiseCharacter("right");
    } else {
      randomiseCharacter("left");
    }
  };

  const runFight = () => {
    if (!left || !right) return;
    setAnimating(true);
    setWinner(null);
    setLoser(null);
    setLoserMark(false);
    setExplosion(false);
    setPhase(-1);
    setHp({ left: 100, right: 100 });
    const outcome = duel(left, right);
    setBattle(outcome);
    outcome.logs.forEach((step, idx) => {
      setTimeout(() => {
        setPhase(idx);
        setHp({ left: step.h1, right: step.h2 });
      }, 600 * (idx + 1));
    });
    const blastAt = 600 * outcome.logs.length + 200;
    setTimeout(() => setExplosion(true), blastAt);
    setTimeout(() => setExplosion(false), blastAt + 480);
    setTimeout(() => {
      setWinner(outcome.winner);
      setLoser(outcome.loser);
      setLoserMark(true);
      setAnimating(false);
      setTimeout(() => setLoserMark(false), 1100);
    }, blastAt + 520);
  };

  const StatBlock = ({ c }) => (
    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
      <div className="flex flex-wrap gap-2">
        {(c.alias || []).map((a) => (
          <Badge key={a} className="bg-white/10 border border-white/20">
            {a}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        {c.gender && (
          <div className="rounded-lg border border-white/20 bg-white/10 p-2">
            <div className="font-bold">Gender</div>
            <div className="font-extrabold">{c.gender}</div>
          </div>
        )}
        {c.alignment && (
          <div className="rounded-lg border border-white/20 bg-white/10 p-2">
            <div className="font-bold">Alignment</div>
            <div className="font-extrabold">{c.alignment}</div>
          </div>
        )}
        {c.status && (
          <div className="rounded-lg border border-white/20 bg-white/10 p-2">
            <div className="font-bold">Status</div>
            <div className="font-extrabold">{c.status}</div>
          </div>
        )}
        {c.era && (
          <div className="rounded-lg border border-white/20 bg-white/10 p-2">
            <div className="font-bold">Era</div>
            <div className="font-extrabold">{c.era}</div>
          </div>
        )}
        {c.firstAppearance && (
          <div className="col-span-2 rounded-lg border border-white/20 bg-white/10 p-2">
            <div className="font-bold">First Appearance</div>
            <div className="font-extrabold">{c.firstAppearance}</div>
          </div>
        )}
      </div>
      {!!(c.locations || []).length && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-bold">
            <MapPin size={12} /> Locations
          </div>
          <div className="flex flex-wrap gap-2">
            {c.locations.map((v) => (
              <Badge key={v} className="bg-white/10 border border-white/20">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {!!(c.faction || []).length && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-bold">
            <Crown size={12} /> Factions
          </div>
          <div className="flex flex-wrap gap-2">
            {c.faction.map((v) => (
              <Badge key={v} className="bg-white/10 border border-white/20">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {!!(c.tags || []).length && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-bold">
            <Layers size={12} /> Tags
          </div>
          <div className="flex flex-wrap gap-2">
            {c.tags.map((v) => (
              <Badge key={v} className="bg-white/10 border border-white/20">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {!!(c.stories || []).length && (
        <div>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-bold">
            <BookOpen size={12} /> Stories
          </div>
          <div className="flex flex-wrap gap-2">
            {c.stories.map((v) => (
              <Badge key={v} className="bg-white/10 border border-white/20">
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-1 flex items-center gap-1 text-[11px] font-bold">
          <Atom size={12} /> Powers
        </div>
        <div className="space-y-1.5">
          {(c.powers || []).map((p) => (
            <div key={p.name}>
              <div className="flex items-center justify-between text-[12px] font-bold">
                <span className="truncate pr-2">{p.name}</span>
                <span>{p.level}/10</span>
              </div>
              <PowerMeter level={p.level} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Slot = ({ label, side, character, health, origin }) => {
    if (!character)
      return (
        <div className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/70 md:p-6">
          <div className="font-extrabold uppercase tracking-widest text-white/60">{label}</div>
          <div>Summon a character from the roster or let the arena pick one for you.</div>
          <Button variant="secondary" onClick={() => randomiseCharacter(side)} className="font-black">
            Random Character
          </Button>
        </div>
      );
    const isWinner = winner?.id === character.id;
    const isLoser = loser?.id === character.id;
    return (
      <motion.div
        animate={isWinner ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className={cx(
          "relative rounded-2xl border border-white/15 bg-white/5 p-3 md:p-5",
          isWinner ? "shadow-[0_0_30px_rgba(251,191,36,0.35)]" : ""
        )}
      >
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/70">
          <span>{label}</span>
          <span>{origin?.label || "Origin"}</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/15">
          <ImageSafe
            src={character.cover || character.gallery?.[0]}
            alt={character.name}
            fallbackLabel={character.name}
            className="h-32 w-full object-cover"
          />
          <AnimatePresence>
            {loserMark && isLoser && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-red-600/40"
              >
                <span className="text-4xl font-black text-red-200">✕</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-sm font-extrabold">{character.name}</div>
          <Badge className="bg-white/10 border border-white/20 text-[10px]">
            {origin?.label || "Unknown"}
          </Badge>
        </div>
        <div className="mt-2">
          <HealthBar value={health} />
        </div>
        <div className="mt-2 text-[12px] text-white/80">
          {character.shortDesc || character.longDesc}
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" onClick={() => onOpen(character)}>
            Read More
          </Button>
          <Button variant="outline" onClick={() => release(side)}>
            Release
          </Button>
          <Button variant="ghost" onClick={() => randomiseCharacter(side)}>
            Random Character
          </Button>
        </div>
        <div className="mt-3">
          <StatBlock c={character} />
        </div>
      </motion.div>
    );
  };

  return (
    <Card
      className={cx(
        "mt-6 bg-white/5 p-4 text-white backdrop-blur-xl md:p-6",
        shake || pulse ? "ring-2 ring-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.25)]" : "",
        animating ? "animate-[pulse_2s_ease-in-out_infinite]" : ""
      )}
    >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords />
            <div className="text-lg font-black tracking-tight">Battle Arena</div>
            <Badge className="bg-amber-300 text-black">Live</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={randomiseNext} className="font-bold">
              Randomise Next
            </Button>
            <Button onClick={runFight} disabled={!canFight} className="font-black">
              {animating ? "Simulating…" : "Fight"}
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1.2fr)] md:items-stretch">
        <Slot label="Character One" side="left" character={left} health={hp.left} origin={originLeft} />
        <div className="relative flex flex-col items-center justify-center gap-3 overflow-hidden">
          <motion.div
            animate={
              animating
                ? {
                    rotate: [0, -18, 22, -14, 14, 0],
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 0 0px rgba(255,255,255,0.2)",
                      "0 0 25px rgba(251,191,36,0.6)",
                      "0 0 0px rgba(255,255,255,0.2)",
                    ],
                  }
                : { rotate: 0, scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
            }
            transition={{ duration: 0.6, repeat: animating ? Infinity : 0, ease: "easeInOut" }}
            className="relative rounded-full border border-white/20 bg-white/10 p-4"
          >
            <Swords size={36} />
            <AnimatePresence>
              {explosion && (
                <motion.span
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: [0, 1.4, 1.8], opacity: [0.6, 0.35, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-amber-400/60 via-fuchsia-400/40 to-indigo-400/30"
                />
              )}
            </AnimatePresence>
          </motion.div>
          {battle && (
            <div className="text-center text-[11px] font-semibold text-white/70">
              Phase {phase + 1}/{battle.logs.length}
            </div>
          )}
          {winner && (
            <div className="rounded-full bg-amber-300 px-4 py-1 text-sm font-black text-black shadow-lg">
              Champion: {winner.name}
            </div>
          )}
        </div>
        <Slot label="Character Two" side="right" character={right} health={hp.right} origin={originRight} />
      </div>

      {battle && (
        <div className="mt-4 grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-xs md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">Power Spread</div>
            <div className="font-bold text-white">{left?.name}: {battle.breakdown.s1} • {battle.breakdown.origin1.label}</div>
            <div className="font-bold text-white">{right?.name}: {battle.breakdown.s2} • {battle.breakdown.origin2.label}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">Luck Timeline</div>
            <ul className="space-y-1 font-semibold">
              {battle.logs.map((step) => (
                <li key={step.swing}>
                  Round {step.swing}: {left?.name} luck {step.luck1 >= 0 ? "+" : ""}{step.luck1}, {right?.name} luck {step.luck2 >= 0 ? "+" : ""}{step.luck2}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}

function ChatDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome to the Loremaker concierge. Ask about characters, battles, or request spreadsheet syncs!",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const trailRef = useRef(null);

  useEffect(() => {
    if (open) trailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;
    setMessages((prev) => [...prev, { role: "user", text: content, ts: Date.now() }]);
    setInput("");
    setSending(true);
    try {
      if (!CHATBOT_WEBHOOK) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Chatbot webhook is not configured yet. Please add NEXT_PUBLIC_LOREMAKER_CHAT_WEBHOOK.",
            ts: Date.now(),
          },
        ]);
      } else {
        const payload = {
          message: content,
          timestamp: new Date().toISOString(),
          source: "loremaker",
        };
        const res = await fetch(CHATBOT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        let reply = "Our lore AI has received your message!";
        if (res.ok) {
          const data = await res.json().catch(() => null);
          reply = data?.reply || data?.message || reply;
        }
        setMessages((prev) => [...prev, { role: "bot", text: reply, ts: Date.now() }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "We couldn't reach the chatbot right now. Please try again shortly.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 text-white">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-4 py-2 font-bold shadow-lg"
      >
        <MessageCircle size={16} /> {open ? "Hide" : "Chat"}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="mt-3 w-72 rounded-2xl border border-white/20 bg-black/80 p-3 backdrop-blur"
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-extrabold">
              <Bot size={16} /> Loremaker Live Chat
            </div>
            <div className="mb-3 max-h-64 space-y-2 overflow-y-auto pr-1 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.ts + msg.role}
                  className={cx(
                    "rounded-xl border px-3 py-2",
                    msg.role === "user"
                      ? "ml-8 border-amber-300/40 bg-amber-300/10 text-amber-100"
                      : "mr-8 border-white/20 bg-white/10 text-white"
                  )}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={trailRef} />
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message to the lore team"
                className="flex-1 border-white/30 bg-white/10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={sending} className="px-3">
                <Send size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [selectedIds, setSelectedIds] = useState([null, null]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [arenaPulse, setArenaPulse] = useState(false);
  const [arenaVisible, setArenaVisible] = useState(true);
  const visitTracked = useRef(false);

  const onOpen = (c) => { setActive(c); setOpen(true); };

  // if both slots full and user adds a third, replace the oldest
  const onUseInSim = (id) => {
    setSelectedIds((ids) => {
      const next = Array.isArray(ids) && ids.length === 2 ? [...ids] : [ids[0] || null, ids[1] || null];
      if (next.includes(id)) return next;
      const emptyIdx = next.findIndex((slot) => !slot);
      if (emptyIdx !== -1) {
        next[emptyIdx] = id;
        return next;
      }
      return [next[1], id];
    });
    setHighlightedId(id);
    setArenaPulse(true);
    setTimeout(() => setHighlightedId(null), 900);
    setTimeout(() => setArenaPulse(false), 900);
    setArenaVisible(true);
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
      default:
        return arr;
    }
  }, [filtered, sortMode]);

  const clearAll = () => { setQuery(""); setFilters({}); };

  useEffect(() => {
    if (visitTracked.current) return;
    if (!TRACK_VISIT_WEBHOOK || typeof window === "undefined") return;
    if (!data.length) return;
    visitTracked.current = true;
    fetch(TRACK_VISIT_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        characters: data.length,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, [data.length]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Aurora />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <LoreTopNav onRefresh={() => refetch()} />
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.location.href = "/loremaker";
              }}
              className="text-left text-2xl md:text-3xl font-black tracking-tight text-white hover:text-amber-200 transition"
            >
              Loremaker Universe
            </button>
            <p className="mt-2 max-w-2xl text-sm text-white/80 leading-relaxed">
              Explore every storyline, faction, and mythic ability woven through Menelek Makonnen’s expanding cosmos. Filter the archive, dive into detailed dossiers, and summon characters into the Arena.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setOpenFilters(true)}
              className="font-black border border-amber-200 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 text-black shadow-[0_0_22px_rgba(251,191,36,0.45)] hover:bg-amber-200 hover:shadow-[0_0_26px_rgba(251,191,36,0.55)]"
            >
              <Filter className="mr-1" size={16} /> Filters
            </Button>
          </div>
        </div>

        <HeroSection data={data} onOpen={onOpen} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} />

        {/* Arena pinned right under Hero */}
        <div id="arena-anchor">
          <AnimatePresence>
            {arenaVisible && (
              <motion.div
                key="arena"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Simulator data={sorted} selectedIds={selectedIds} setSelectedIds={setSelectedIds} onOpen={onOpen} pulse={arenaPulse} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6">
          <Controls
            query={query}
            setQuery={setQuery}
            setOpenFilters={setOpenFilters}
            sortMode={sortMode}
            setSortMode={setSortMode}
            onClear={clearAll}
            onToggleArena={() => setArenaVisible((v) => !v)}
            arenaVisible={arenaVisible}
          />
        </div>

        <div className="mt-6">
          <StoryChips data={data} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} />
        </div>

        <div className="mt-6">
          <CharacterGrid
            data={sorted.filter((c) => !selectedIds.includes(c.id))}
            onOpen={onOpen}
            onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))}
            onUseInSim={onUseInSim}
            highlightId={highlightedId}
          />
        </div>

        <SiteMenuSection />
      </div>

      <CharacterModal open={open} onClose={() => setOpen(false)} c={active} onFacet={(kv) => setFilters((f) => ({ ...f, [kv.key]: [...new Set([...(f[kv.key] || []), kv.value])] }))} onUseInSim={(id) => { onUseInSim(id); setOpen(false); }} />

      <FiltersDrawer open={openFilters} onClose={() => setOpenFilters(false)} values={allValues} filters={filters} setFilters={setFilters} combineAND={combineAND} setCombineAND={setCombineAND} />

      <BackToTop />
      <ChatDock />
      <SiteFooter />
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
