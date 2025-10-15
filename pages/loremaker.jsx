import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Search,
  RefreshCcw,
  X,
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
  Library,
  Crown,
  Swords,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";

/**
 * Ultra interactive Loremaker experience
 * - Loads characters from Google Sheets (GViz)
 * - Daily seeded hero carousel + power seeding
 * - Sliding filters drawer, animated arena, chat webhook bridge
 */

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ variant = "solid", size = "md", className = "", children, as: Tag = "button", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-extrabold rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-base",
  };
  const variants = {
    solid: "bg-white text-black hover:bg-white/90",
    subtle: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    ghost: "text-white/80 hover:bg-white/10",
    gradient: "bg-gradient-to-r from-amber-400 via-fuchsia-400 to-indigo-500 text-black shadow-lg hover:brightness-110",
    destructive: "bg-red-600 text-white hover:bg-red-500",
    outline: "border border-white/40 text-white hover:bg-white/10",
    dark: "bg-black/70 text-white hover:bg-black",
  };
  return (
    <Tag className={cx(base, sizes[size], variants[variant] || variants.solid, className)} {...props}>
      {children}
    </Tag>
  );
}

function Card({ className = "", children }) {
  return <div className={cx("rounded-3xl border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0_25px_80px_rgba(8,8,20,0.55)]", className)}>{children}</div>;
}
const CardHeader = ({ className = "", children }) => <div className={cx("p-5", className)}>{children}</div>;
const CardContent = ({ className = "", children }) => <div className={cx("p-5", className)}>{children}</div>;
const CardFooter = ({ className = "", children }) => <div className={cx("px-5 pb-5", className)}>{children}</div>;
const CardTitle = ({ className = "", children }) => <div className={cx("text-lg font-black", className)}>{children}</div>;
const CardDescription = ({ className = "", children }) => <div className={cx("text-sm text-white/75", className)}>{children}</div>;

const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cx(
        "w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white placeholder-white/50 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
        className
      )}
      {...props}
    />
  );
});

const Badge = ({ className = "", children }) => (
  <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide", className)}>{children}</span>
);

const Switch = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    onClick={() => onCheckedChange(!checked)}
    role="switch"
    aria-checked={checked}
    className={cx(
      "relative h-7 w-12 rounded-full border transition",
      checked ? "border-amber-300 bg-amber-300/70" : "border-white/30 bg-white/12"
    )}
  >
    <span
      className={cx(
        "absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-all",
        checked ? "translate-x-5 shadow-lg" : "translate-x-0"
      )}
    />
  </button>
);

const SHEET_ID = "1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM";
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

let __SOURCE_ORDER = new Map();

const toSlug = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
function normalizeDriveUrl(url) {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    if (u.hostname.includes("drive.google.com")) {
      const match = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = (match && match[1]) || u.searchParams.get("id");
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
    .replace(/[|;/]/g, ",")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function parseLocations(raw) {
  const items = splitList(raw);
  const set = new Set();
  for (const item of items) {
    item
      .split(/\s*,\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((value) => set.add(value));
  }
  return Array.from(set);
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
      level = parseInt(colon[2], 10);
    } else if (/\((\d{1,2})\)/.test(item)) {
      const m = item.match(/^(.*?)\((\d{1,2})\)$/);
      name = (m?.[1] || item).trim();
      level = parseInt(m?.[2] || "0", 10);
    } else {
      const trail = item.match(/^(.*?)(\d{1,2})$/);
      if (trail) {
        name = trail[1].trim();
        level = parseInt(trail[2], 10);
      } else {
        name = item.trim();
      }
    }
    return { name, level: Number.isFinite(level) ? Math.min(10, Math.max(0, level)) : 0 };
  });
}
function headerMap(headers) {
  const map = {};
  const lower = headers.map((h) => (h || "").toLowerCase().trim());
  const findIndex = (aliases) => {
    for (const alias of aliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) return idx;
    }
    return -1;
  };
  for (const key of Object.keys(COL_ALIAS)) {
    const idx = findIndex(COL_ALIAS[key]);
    if (idx !== -1) map[key] = idx;
  }
  GALLERY_ALIASES.forEach((aliases, index) => {
    const idx = findIndex(aliases);
    if (idx !== -1) map[`gallery_${index + 1}`] = idx;
  });
  return map;
}
function parseGViz(text) {
  const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
  if (!match) throw new Error("GViz format not recognised");
  return JSON.parse(match[1]);
}
function rowToCharacter(row, map) {
  const read = (key) => {
    const idx = map[key];
    if (idx == null) return undefined;
    const cell = row[idx];
    if (!cell) return undefined;
    const value = cell.v ?? cell.f ?? cell;
    return typeof value === "string" ? value : String(value ?? "");
  };
  const name = (read("name") || "").trim();
  if (!name) return null;
  const char = {
    id: read("id") || toSlug(name),
    name,
    alias: splitList(read("alias")),
    gender: read("gender"),
    alignment: read("alignment"),
    locations: parseLocations(read("location")),
    status: read("status"),
    era: read("era"),
    firstAppearance: read("firstAppearance"),
    powers: parsePowers(read("powers")),
    faction: splitList(read("faction")),
    tags: splitList(read("tag")),
    shortDesc: read("shortDesc"),
    longDesc: read("longDesc"),
    stories: splitList(read("stories")),
    cover: normalizeDriveUrl(read("cover")),
    gallery: [],
  };
  for (let i = 1; i <= 15; i++) {
    const url = read(`gallery_${i}`);
    if (url) char.gallery.push(normalizeDriveUrl(url));
  }
  return char;
}

const todayKey = () => new Date().toISOString().slice(0, 10);
function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dailyInt = (seed, min = 1, max = 10) => {
  const rand = seededRandom(`${seed}|${todayKey()}`)();
  return Math.floor(rand * (max - min + 1)) + min;
};
function fillDailyPowers(char) {
  const powers = (char.powers || []).map((power, index) => {
    const base = Number.isFinite(power.level) && power.level > 0 ? power.level : 5;
    const seeded = dailyInt(`${char.name}|${power.name}|${index}`, 3, 10);
    const blended = Math.round((base * 0.4 + seeded * 0.6) * 10) / 10;
    return { ...power, level: Math.min(10, Math.max(1, blended)) };
  });
  if (!powers.length) {
    powers.push({ name: "Untapped Potential", level: dailyInt(`${char.name}|fallback`, 4, 9) });
  }
  return { ...char, powers };
}

function useCharacters() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      const pull = async (sheet) => {
        const res = await fetch(GVIZ_URL(sheet));
        if (!res.ok) throw new Error(`Google Sheets request failed (${res.status})`);
        const text = await res.text();
        return parseGViz(text);
      };
      let response;
      try {
        response = await pull(SHEET_NAME);
      } catch (err) {
        response = await pull("Sheet1");
      }
      const rows = response.table.rows || [];
      const labels = response.table.cols.map((col) => (col?.label || col?.id || "").trim());
      let map = headerMap(labels);
      let usableRows = rows;
      if (map.name == null && rows.length) {
        const guess = (rows[0]?.c || []).map((cell) => String(cell?.v ?? cell?.f ?? "").trim());
        const alt = headerMap(guess);
        if (alt.name != null) {
          map = alt;
          usableRows = rows.slice(1);
        }
      }
      const parsed = [];
      usableRows.forEach((row, index) => {
        const char = rowToCharacter(row.c || [], map);
        if (char) {
          parsed.push(fillDailyPowers(char));
          if (!__SOURCE_ORDER.has(char.id)) __SOURCE_ORDER.set(char.id, index);
        }
      });
      setData(parsed);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Unable to load characters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheet();
  }, []);

  return { data, loading, error, refetch: fetchSheet };
}

function Aurora({ className = "" }) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  const left = useTransform(sx, (value) => `${value}%`);
  const top = useTransform(sy, (value) => `${value}%`);
  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - rect.left) / rect.width) * 100);
        y.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
      className={cx("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <motion.div style={{ left, top }} className="absolute h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-3xl">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-700/40 via-fuchsia-500/35 to-amber-400/40" />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.09),transparent_65%)]" />
    </motion.div>
  );
}

function Insignia({ label, size = 48, variant = "character" }) {
  const fallback = label || "Lore";
  const initials = fallback
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "LM";
  const hue = Math.abs([...fallback].reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 360;
  const topWidth = variant === "site" ? 42 : variant === "faction" ? 36 : 32;
  const fillOne = `hsl(${hue}, 85%, 64%)`;
  const fillTwo = `hsl(${(hue + 48) % 360}, 80%, 60%)`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]">
      <defs>
        <linearGradient id={`ins-${hue}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={fillOne} />
          <stop offset="100%" stopColor={fillTwo} />
        </linearGradient>
      </defs>
      <path
        d={`M32 6 C32 6 ${32 - topWidth / 2} 10 ${32 - topWidth / 2} 10 L ${32 + topWidth / 2} 10 C ${32 + topWidth / 2} 10 32 6 32 6 L 56 16 L 56 36 C 56 47 46 57 32 60 C 18 57 8 47 8 36 L 8 16 Z`}
        fill={`url(#ins-${hue})`}
        stroke="rgba(255,255,255,.45)"
        strokeWidth="1.4"
      />
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontFamily="var(--font-sans, 'Inter', 'Segoe UI', sans-serif)"
        fontWeight="900"
        fontSize="20"
        fill="#fff"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,.6))" }}
      >
        {initials}
      </text>
    </svg>
  );
}

function ImageSafe({ src, alt, className = "", fallbackLabel }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={cx("flex items-center justify-center rounded-2xl border border-white/15 bg-white/10", className)}>
        <Insignia label={fallbackLabel} size={64} />
      </div>
    );
  }
  return <img src={src} alt={alt} onError={() => setError(true)} className={className} loading="lazy" />;
}

function PowerMeter({ level, accent = "amber" }) {
  const pct = Math.min(100, Math.max(0, (Number(level) || 0) * 10));
  const gradient =
    accent === "emerald"
      ? "from-emerald-200 via-cyan-200 to-blue-300"
      : accent === "crimson"
      ? "from-rose-300 via-rose-400 to-red-500"
      : "from-amber-200 via-fuchsia-300 to-indigo-300";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
      <div className={cx("h-full bg-gradient-to-r", gradient)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function FacetChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition",
        active ? "border-white bg-white text-black" : "border-white/30 bg-white/10 text-white hover:bg-white/20"
      )}
    >
      {children}
    </button>
  );
}

function matchesFilters(char, filters, combineAND, query) {
  const terms = (query || "").toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    char.name,
    ...(char.alias || []),
    ...(char.locations || []),
    ...(char.tags || []),
    ...(char.faction || []),
    ...(char.powers || []).map((p) => p.name),
    char.shortDesc,
    char.longDesc,
  ]
    .join(" ")
    .toLowerCase();
  const searchMatches = terms.every((term) => haystack.includes(term));

  const checks = [];
  if (filters.gender) checks.push((char.gender || "").toLowerCase() === filters.gender.toLowerCase());
  if (filters.alignment) checks.push((char.alignment || "").toLowerCase() === filters.alignment.toLowerCase());
  if (filters.locations?.length)
    checks.push(filters.locations.every((loc) => char.locations.map((value) => value.toLowerCase()).includes(loc.toLowerCase())));
  if (filters.faction?.length)
    checks.push(filters.faction.every((value) => (char.faction || []).map((item) => item.toLowerCase()).includes(value.toLowerCase())));
  if (filters.tags?.length)
    checks.push(filters.tags.every((value) => (char.tags || []).map((item) => item.toLowerCase()).includes(value.toLowerCase())));
  if (filters.era?.length)
    checks.push(filters.era.some((value) => (char.era || "").toLowerCase() === value.toLowerCase()));
  if (filters.status?.length)
    checks.push(filters.status.some((value) => (char.status || "").toLowerCase() === value.toLowerCase()));
  if (filters.stories?.length)
    checks.push(filters.stories.every((value) => (char.stories || []).map((item) => item.toLowerCase()).includes(value.toLowerCase())));
  if (filters.alias?.length)
    checks.push(filters.alias.some((value) => (char.alias || []).map((item) => item.toLowerCase()).includes(value.toLowerCase())));
  if (filters.powers?.length)
    checks.push(filters.powers.every((value) => (char.powers || []).map((item) => item.name.toLowerCase()).includes(value.toLowerCase())));

  const filterMatch = combineAND ? checks.every(Boolean) : checks.length === 0 || checks.some(Boolean);
  return searchMatches && filterMatch;
}

function pickDaily(items, salt = "") {
  if (!items.length) return null;
  const rng = seededRandom(`${todayKey()}|${salt}`);
  return items[Math.floor(rng() * items.length)] || items[0];
}

function HeroSection({ data, onOpen, onFacet }) {
  const character = useMemo(() => pickDaily(data, "character"), [data]);
  const allFactions = useMemo(() => Array.from(new Set(data.flatMap((item) => item.faction || []))), [data]);
  const allLocations = useMemo(() => Array.from(new Set(data.flatMap((item) => item.locations || []))), [data]);
  const allPowers = useMemo(() => Array.from(new Set(data.flatMap((item) => (item.powers || []).map((p) => p.name)))), [data]);
  const featuredFaction = useMemo(() => pickDaily(allFactions, "faction"), [allFactions]);
  const featuredLocation = useMemo(() => pickDaily(allLocations, "location"), [allLocations]);
  const featuredPower = useMemo(() => pickDaily(allPowers, "power"), [allPowers]);

  const slides = [];
  if (character) {
    slides.push({
      type: "Character",
      render: () => (
        <div className="grid h-72 grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-2">
          <ImageSafe
            src={character.cover || character.gallery[0]}
            alt={character.name}
            fallbackLabel={character.name}
            className="h-72 w-full object-cover"
          />
          <div className="flex h-full flex-col gap-3 bg-gradient-to-br from-black/55 via-indigo-900/40 to-transparent p-6 text-white">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.3em]">
              <Clock size={14} /> Today’s Featured Character
            </div>
            <div className="text-3xl font-black leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">{character.name}</div>
            <div className="text-sm font-semibold text-white/85 line-clamp-4">{character.shortDesc || character.longDesc}</div>
            <div className="mt-auto flex gap-3">
              <Button variant="gradient" onClick={() => onOpen(character)}>
                Meet {character.name.split(" ")[0]} <ArrowRight className="h-4 w-4" />
              </Button>
              {character.faction?.[0] && (
                <Button variant="subtle" onClick={() => onFacet({ key: "faction", value: character.faction[0] })}>
                  Visit {character.faction[0]}
                </Button>
              )}
            </div>
          </div>
        </div>
      ),
    });
  }
  if (featuredFaction) {
    slides.push({
      type: "Faction",
      render: () => (
        <div className="flex h-72 flex-col justify-between gap-4 bg-gradient-to-br from-indigo-700/35 via-fuchsia-600/20 to-transparent p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(featuredFaction)} size={64} variant="faction" />
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.3em]">Featured Faction</div>
              <div className="text-3xl font-black">{String(featuredFaction)}</div>
            </div>
          </div>
          <Button variant="gradient" onClick={() => onFacet({ key: "faction", value: String(featuredFaction) })}>
            View Members
          </Button>
        </div>
      ),
    });
  }
  if (featuredLocation) {
    slides.push({
      type: "Location",
      render: () => (
        <div className="flex h-72 flex-col justify-between gap-4 bg-gradient-to-br from-amber-400/25 via-rose-300/12 to-transparent p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(featuredLocation)} size={64} />
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.3em]">Featured Location</div>
              <div className="text-3xl font-black">{String(featuredLocation)}</div>
            </div>
          </div>
          <Button variant="gradient" onClick={() => onFacet({ key: "locations", value: String(featuredLocation) })}>
            Explore Residents
          </Button>
        </div>
      ),
    });
  }
  if (featuredPower) {
    slides.push({
      type: "Power",
      render: () => (
        <div className="flex h-72 flex-col justify-between gap-4 bg-gradient-to-br from-cyan-400/25 via-emerald-400/10 to-transparent p-6 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={String(featuredPower)} size={64} />
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.3em]">Featured Power</div>
              <div className="text-3xl font-black">{String(featuredPower)}</div>
            </div>
          </div>
          <Button variant="gradient" onClick={() => onFacet({ key: "powers", value: String(featuredPower) })}>
            View Wielders
          </Button>
        </div>
      ),
    });
  }

  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    const handler = (event) => {
      if (slides.length < 2) return;
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + slides.length) % slides.length);
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <Card className="overflow-hidden border-white/20 bg-gradient-to-tr from-indigo-700/22 via-fuchsia-600/12 to-amber-500/12 text-white">
      <CardHeader className="flex items-center justify-between border-b border-white/15 pb-3">
        <div className="text-sm font-extrabold uppercase tracking-[0.3em]">Daily Features</div>
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
          {slides[index].type} • {todayKey()}
        </div>
      </CardHeader>
      <div className="relative">
        {slides[index].render()}
        {slides.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur hover:bg-black/65"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              aria-label="Previous feature"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white backdrop-blur hover:bg-black/65"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              aria-label="Next feature"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <span key={idx} className={cx("h-1.5 w-6 rounded-full", idx === index ? "bg-white" : "bg-white/40")} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function StoryChips({ data, onFacet }) {
  const stories = useMemo(() => {
    const counts = new Map();
    for (const char of data) {
      (char.stories || []).forEach((story) => counts.set(story, (counts.get(story) || 0) + 1));
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([story]) => story);
  }, [data]);
  if (!stories.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {stories.map((story) => (
        <FacetChip key={story} onClick={() => onFacet({ key: "stories", value: story })}>
          {story}
        </FacetChip>
      ))}
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "random", label: "Random" },
  { value: "faction", label: "By Faction" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
  { value: "power", label: "From Most Powerful" },
  { value: "power-low", label: "From Least Powerful" },
];

function SortBar({ option, setOption }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3">
      <span className="text-xs font-bold uppercase tracking-wide text-white/70">Sort</span>
      <div className="relative">
        <select
          value={option}
          onChange={(event) => setOption(event.target.value)}
          className="appearance-none rounded-xl border border-white/30 bg-black/70 px-4 py-2 pr-10 text-sm font-bold text-white shadow-inner focus:outline-none"
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value} className="bg-black text-white">
              {item.label}
            </option>
          ))}
        </select>
        <ArrowDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
      </div>
    </div>
  );
}

function CharacterCard({ char, onOpen, onFacet, onUseInSim, highlight }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!highlight) return;
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 900);
    return () => clearTimeout(timer);
  }, [highlight]);
  const triggerSim = () => {
    setPulse(true);
    onUseInSim(char.id);
    setTimeout(() => setPulse(false), 700);
  };
  return (
    <motion.div
      layout
      animate={pulse ? { rotate: [0, -2, 2, -1, 1, 0], scale: [1, 1.02, 0.98, 1.01, 1] } : { rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 230, damping: 18 }}
    >
      <Card className={cx("overflow-hidden bg-white/8", highlight ? "ring-2 ring-amber-300" : "")}
        >
        <div className="relative">
          <button onClick={() => onOpen(char)} className="block h-56 w-full overflow-hidden">
            <ImageSafe
              src={char.cover || char.gallery[0]}
              alt={char.name}
              fallbackLabel={char.name}
              className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            <div className="cursor-pointer" onClick={() => onOpen(char)}>
              <Insignia label={char.faction?.[0] || char.name} size={44} variant={char.faction?.length ? "faction" : "character"} />
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={triggerSim}
              className="rounded-full bg-gradient-to-r from-amber-300 to-rose-300 px-3 py-1 text-xs font-black text-black shadow-lg"
            >
              <Swords size={14} /> Simulate
            </motion.button>
          </div>
        </div>
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <Insignia label={char.faction?.[0] || char.name} size={32} variant={char.faction?.length ? "faction" : "character"} />
            <CardTitle className="text-2xl text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
              <button onClick={() => onOpen(char)} className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-left text-transparent">
                {char.name}
              </button>
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-white/80">
            {char.shortDesc || char.longDesc || "No description yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {char.gender && <FacetChip onClick={() => onFacet({ key: "gender", value: char.gender })}>{char.gender}</FacetChip>}
            {char.alignment && <FacetChip onClick={() => onFacet({ key: "alignment", value: char.alignment })}>{char.alignment}</FacetChip>}
            {(char.locations || []).slice(0, 2).map((loc) => (
              <FacetChip key={loc} onClick={() => onFacet({ key: "locations", value: loc })}>
                {loc}
              </FacetChip>
            ))}
            {(char.faction || []).slice(0, 1).map((faction) => (
              <FacetChip key={faction} onClick={() => onFacet({ key: "faction", value: faction })}>
                {faction}
              </FacetChip>
            ))}
          </div>
          <div className="space-y-1 text-xs font-bold text-white">
            {(char.powers || []).slice(0, 1).map((power) => (
              <div key={power.name} className="flex items-center justify-between">
                <span className="truncate pr-2">{power.name}</span>
                <span>{power.level}/10</span>
              </div>
            ))}
            <PowerMeter level={char.powers?.[0]?.level ?? 0} />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="gradient" size="sm" onClick={() => onOpen(char)}>
              Read <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Gallery({ images, cover, name }) {
  const [index, setIndex] = useState(0);
  const sources = [cover, ...(images || [])].filter(Boolean);
  if (!sources.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/15 bg-white/12">
        <Insignia label={name} size={72} />
      </div>
    );
  }
  return (
    <div className="group relative">
      <ImageSafe
        src={sources[index]}
        alt={`${name} gallery ${index + 1}`}
        fallbackLabel={name}
        className="h-64 w-full rounded-2xl border border-white/12 object-cover"
      />
      {sources.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition group-hover:opacity-100"
            onClick={() => setIndex((i) => (i - 1 + sources.length) % sources.length)}
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition group-hover:opacity-100"
            onClick={() => setIndex((i) => (i + 1) % sources.length)}
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {sources.map((_, idx) => (
              <span key={idx} className={cx("h-1.5 w-5 rounded-full", idx === index ? "bg-white" : "bg-white/50")} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CharacterModal({ open, onClose, char, onFacet, onUseInSim }) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);
  if (!open || !char) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Aurora className="opacity-70" />
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-black/65 backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/15 px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <Insignia label={char.name} size={48} />
            <div>
              <div className="text-3xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{char.name}</div>
              {char.era && <div className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-white/70">{char.era}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="gradient" size="sm" onClick={() => onUseInSim(char.id)}>
              Use in Sim
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close profile">
              <X />
            </Button>
          </div>
        </div>
        <div className="grid max-h-[75vh] grid-cols-1 gap-6 overflow-y-auto p-6 text-white lg:grid-cols-2">
          <div className="space-y-5">
            <Gallery images={char.gallery} cover={char.cover} name={char.name} />
            <div className="space-y-3 text-sm font-semibold text-white/80">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-white">Short Description</div>
                <div className="mt-1 text-white/80">{char.shortDesc || "—"}</div>
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide text-white">Bio</div>
                <div className="mt-1 whitespace-pre-wrap text-white/80">{char.longDesc || "—"}</div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {(char.alias || []).map((alias) => (
                <FacetChip key={alias} onClick={() => onFacet({ key: "alias", value: alias })}>
                  {alias}
                </FacetChip>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {char.gender && (
                <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-white/70">Gender</div>
                  <div className="text-base font-extrabold">{char.gender}</div>
                </div>
              )}
              {char.alignment && (
                <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-white/70">Alignment</div>
                  <div className="text-base font-extrabold">{char.alignment}</div>
                </div>
              )}
              {char.status && (
                <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-white/70">Status</div>
                  <div className="text-base font-extrabold">{char.status}</div>
                </div>
              )}
              {char.firstAppearance && (
                <div className="rounded-2xl border border-white/15 bg-white/8 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-white/70">First Appearance</div>
                  <div className="text-base font-extrabold">{char.firstAppearance}</div>
                </div>
              )}
            </div>
            {!!(char.locations || []).length && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
                  <MapPin size={14} /> Locations
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(char.locations || []).map((loc) => (
                    <FacetChip key={loc} onClick={() => onFacet({ key: "locations", value: loc })}>
                      {loc}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            {!!(char.faction || []).length && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
                  <Crown size={14} /> Factions / Teams
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(char.faction || []).map((faction) => (
                    <FacetChip key={faction} onClick={() => onFacet({ key: "faction", value: faction })}>
                      {faction}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            {!!(char.tags || []).length && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
                  <Layers size={14} /> Tags
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(char.tags || []).map((tag) => (
                    <FacetChip key={tag} onClick={() => onFacet({ key: "tags", value: tag })}>
                      {tag}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
                <Atom size={14} /> Powers
              </div>
              <div className="mt-3 space-y-2">
                {(char.powers || []).map((power) => (
                  <div key={power.name}>
                    <div className="mb-1 flex items-center justify-between text-sm font-bold">
                      <span className="truncate pr-3">{power.name}</span>
                      <span>{power.level}/10</span>
                    </div>
                    <PowerMeter level={power.level} accent="emerald" />
                  </div>
                ))}
              </div>
            </div>
            {!!(char.stories || []).length && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/70">
                <Library size={14} /> Stories
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(char.stories || []).map((story) => (
                    <FacetChip key={story} onClick={() => onFacet({ key: "stories", value: story })}>
                      {story}
                    </FacetChip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 24;
function CharacterGrid({ data, onOpen, onFacet, onUseInSim, highlightId }) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [data]);
  useEffect(() => {
    const handler = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 320) {
        setPage((current) => (current * PAGE_SIZE < data.length ? current + 1 : current));
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [data.length]);
  const slice = data.slice(0, page * PAGE_SIZE);
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {slice.map((char) => (
        <CharacterCard
          key={char.id}
          char={char}
          onOpen={onOpen}
          onFacet={onFacet}
          onUseInSim={onUseInSim}
          highlight={highlightId === char.id}
        />
      ))}
      {!slice.length && <div className="text-lg font-black text-white">No characters match your filters… yet.</div>}
    </div>
  );
}

function descriptorPowerMultiplier(char) {
  const baseString = [char.era, char.status, ...(char.tags || []), char.longDesc, char.shortDesc]
    .join(" ")
    .toLowerCase();
  let multiplier = 1;
  if (/ancient god|god|goddess|deity|primordial/.test(baseString)) multiplier += 0.65;
  if (/celestial|cosmic|divine|angelic/.test(baseString)) multiplier += 0.35;
  if (/alien|extraterrestrial|martian|xeno/.test(baseString)) multiplier += 0.25;
  if (/demi-god|demigod|demi/.test(baseString)) multiplier += 0.2;
  if (/spirit|spectral|ethereal|astral/.test(baseString)) multiplier += 0.15;
  if (/enhanced|augmented|super soldier|meta-human|mutant/.test(baseString)) multiplier += 0.12;
  if (/human/.test(baseString)) multiplier -= 0.1;
  if (/ordinary human|civilian/.test(baseString)) multiplier -= 0.2;
  multiplier = Math.max(0.55, multiplier);
  return multiplier;
}

function scoreCharacter(char) {
  const base = (char.powers || []).reduce((sum, power) => sum + (Number(power.level) || 0), 0);
  const elite = (char.tags || []).some((tag) => /legend|mythic|prime|eternal|apex/.test(tag.toLowerCase())) ? 6 : 0;
  const multiplier = descriptorPowerMultiplier(char);
  return Math.round((base + elite) * multiplier);
}

function computeBattleTimeline(charA, charB) {
  const rng = seededRandom(`${charA.id}|${charB.id}|${todayKey()}`);
  const baseA = scoreCharacter(charA);
  const baseB = scoreCharacter(charB);
  const timeline = [];
  let healthA = 100;
  let healthB = 100;
  for (let round = 1; round <= 3; round++) {
    const luckA = (rng() * 2 - 1) * 0.22 * Math.max(baseA, baseB, 1);
    const luckB = (rng() * 2 - 1) * 0.22 * Math.max(baseA, baseB, 1);
    const strikeA = baseA + luckA + rng() * 12;
    const strikeB = baseB + luckB + rng() * 12;
    const total = strikeA + strikeB || 1;
    const damageA = Math.max(0, (strikeB / total) * 28 + rng() * 4);
    const damageB = Math.max(0, (strikeA / total) * 28 + rng() * 4);
    healthA = Math.max(0, healthA - damageA);
    healthB = Math.max(0, healthB - damageB);
    timeline.push({
      round,
      strikeA: Math.round(strikeA),
      strikeB: Math.round(strikeB),
      luckA: Math.round(luckA),
      luckB: Math.round(luckB),
      healthA: Math.round(healthA),
      healthB: Math.round(healthB),
    });
  }
  const finalScoreA = baseA + timeline.reduce((sum, phase) => sum + phase.luckA, 0);
  const finalScoreB = baseB + timeline.reduce((sum, phase) => sum + phase.luckB, 0);
  const winner = finalScoreA === finalScoreB ? (rng() > 0.5 ? charA : charB) : finalScoreA > finalScoreB ? charA : charB;
  return { timeline, winner, loser: winner.id === charA.id ? charB : charA, baseA, baseB, finalScoreA, finalScoreB };
}

function ArenaCard({ char, position, onRelease, onOpen, health, isWinner, showX }) {
  if (!char) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-500/60 bg-slate-900/40 p-6 text-center text-sm font-bold text-slate-400">
        Choose combatant {position}
      </div>
    );
  }
  const healthGradient = health > 60 ? "from-emerald-300 to-emerald-500" : health > 30 ? "from-amber-300 to-amber-500" : "from-rose-400 to-red-500";
  return (
    <motion.div
      layout
      className={cx(
        "relative h-full rounded-3xl border border-slate-700 bg-slate-950/90 p-5 text-left text-slate-100 shadow-[0_25px_80px_rgba(6,7,12,0.65)]",
        isWinner ? "ring-4 ring-emerald-400 scale-[1.02]" : "",
        showX ? "ring-2 ring-red-500" : ""
      )}
      animate={isWinner ? { scale: [1, 1.03, 1], boxShadow: "0 30px 80px rgba(16,185,129,0.35)" } : {}}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {showX && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-6xl font-black text-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: 1 }}
        >
          X
        </motion.div>
      )}
      <div className="flex items-center justify-between">
        <Badge className="bg-slate-800/80 text-slate-200">Combatant {position}</Badge>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpen(char)}>
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => onRelease(char.id)}>
            Release
          </Button>
        </div>
      </div>
      <button onClick={() => onOpen(char)} className="mt-3 block w-full text-left">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Health</div>
        <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            key={health}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, health)}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cx("h-full bg-gradient-to-r", healthGradient)}
          />
        </div>
      </button>
      <div className="mt-5 flex items-start gap-4">
        <ImageSafe
          src={char.cover || char.gallery[0]}
          alt={char.name}
          fallbackLabel={char.name}
          className="h-32 w-32 rounded-2xl border border-slate-700 object-cover"
        />
        <div className="flex-1 space-y-3 text-xs">
          <div className="text-lg font-black text-white">{char.name}</div>
          <div className="grid grid-cols-2 gap-2">
            {char.gender && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Gender</div>
                <div className="text-sm font-extrabold text-white">{char.gender}</div>
              </div>
            )}
            {char.alignment && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Alignment</div>
                <div className="text-sm font-extrabold text-white">{char.alignment}</div>
              </div>
            )}
            {char.status && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Status</div>
                <div className="text-sm font-extrabold text-white">{char.status}</div>
              </div>
            )}
            {char.era && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Era</div>
                <div className="text-sm font-extrabold text-white">{char.era}</div>
              </div>
            )}
          </div>
          {!!(char.locations || []).length && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Locations</div>
              <div className="flex flex-wrap gap-1.5">
                {(char.locations || []).map((loc) => (
                  <Badge key={loc} className="bg-slate-800/70 text-white">
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!!(char.faction || []).length && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Factions</div>
              <div className="flex flex-wrap gap-1.5">
                {(char.faction || []).map((faction) => (
                  <Badge key={faction} className="bg-slate-800/70 text-white">
                    {faction}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!!(char.tags || []).length && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {(char.tags || []).map((tag) => (
                  <Badge key={tag} className="bg-slate-800/70 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {(char.powers || []).map((power) => (
          <div key={power.name}>
            <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="truncate pr-2">{power.name}</span>
              <span>{power.level}/10</span>
            </div>
            <PowerMeter level={power.level} accent="crimson" />
          </div>
        ))}
      </div>
      {!!(char.stories || []).length && (
        <div className="mt-4">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Stories</div>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-300">
            {(char.stories || []).map((story) => (
              <span key={story} className="rounded-full bg-slate-800/60 px-2 py-1">
                {story}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

const swordVariants = {
  idle: { rotate: 0, scale: 1, filter: "drop-shadow(0 0 0 rgba(255,255,255,0))" },
  charging: { rotate: [0, -5, 5, -8, 8, 0], scale: 1.05, filter: "drop-shadow(0 0 25px rgba(249,250,139,0.9))" },
  swing: { rotate: [0, -25, 25, -18, 18, 0], scale: 1.1, filter: "drop-shadow(0 0 35px rgba(255,255,255,0.9))" },
  explode: { rotate: [0, -15, 15, 0], scale: [1, 1.2, 0.9, 1], filter: "drop-shadow(0 0 45px rgba(255,196,12,1))" },
};

function BattleArena({ characters, slots, setSlots, onOpenCharacter, pulseKey }) {
  const left = characters.find((item) => item.id === slots.left) || null;
  const right = characters.find((item) => item.id === slots.right) || null;
  const [battleState, setBattleState] = useState("idle");
  const [timeline, setTimeline] = useState([]);
  const [result, setResult] = useState(null);
  const [health, setHealth] = useState({ left: 100, right: 100 });
  const [showX, setShowX] = useState(null);
  const [arenaPulse, setArenaPulse] = useState(false);

  useEffect(() => {
    if (!pulseKey) return;
    setArenaPulse(true);
    const timer = setTimeout(() => setArenaPulse(false), 700);
    return () => clearTimeout(timer);
  }, [pulseKey]);

  useEffect(() => {
    setBattleState("idle");
    setTimeline([]);
    setResult(null);
    setHealth({ left: 100, right: 100 });
    setShowX(null);
  }, [left?.id, right?.id]);

  const release = (id) => {
    setSlots((prev) => ({
      left: prev.left === id ? null : prev.left,
      right: prev.right === id ? null : prev.right,
    }));
    setShowX(null);
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const runBattle = async () => {
    if (!left || !right || left.id === right.id) return;
    const computed = computeBattleTimeline(left, right);
    setBattleState("charging");
    setResult(null);
    setTimeline([]);
    setHealth({ left: 100, right: 100 });
    setShowX(null);
    for (const phase of computed.timeline) {
      setBattleState("swing");
      setTimeline((prev) => [...prev, phase]);
      setHealth({ left: phase.healthA, right: phase.healthB });
      // eslint-disable-next-line no-await-in-loop
      await delay(650);
    }
    setBattleState("explode");
    await delay(450);
    setBattleState("idle");
    setResult(computed);
    setShowX(computed.loser.id);
    setTimeout(() => setShowX(null), 2200);
  };

  const runRandom = () => {
    if (characters.length < 2) return;
    const rng = seededRandom(`arena|${Date.now()}`);
    const shuffled = [...characters].sort(() => rng() - 0.5);
    const first = shuffled[0];
    const second = shuffled.find((char) => char.id !== first.id) || shuffled[1];
    setSlots({ left: first?.id || null, right: second?.id || null });
  };

  const reset = () => {
    setSlots({ left: null, right: null });
    setTimeline([]);
    setResult(null);
    setHealth({ left: 100, right: 100 });
    setBattleState("idle");
    setShowX(null);
  };

  return (
    <motion.div
      layout
      animate={arenaPulse ? { scale: [1, 1.02, 0.99, 1.01, 1], boxShadow: "0 30px 100px rgba(244,187,74,0.25)" } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Card className="border-0 bg-slate-900 text-slate-100">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-white">
              <Swords /> Battle Arena
            </CardTitle>
            <Badge className="bg-slate-800/70 text-slate-300">Luck recalculates every round</Badge>
            <div className="ml-auto flex items-center gap-3 text-xs font-semibold text-slate-300">
              <span>Humans must earn their victories — gods begin ahead.</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr]">
            <ArenaCard
              char={left}
              position="A"
              onRelease={release}
              onOpen={onOpenCharacter}
              health={health.left}
              isWinner={result?.winner?.id === left?.id}
              showX={showX === left?.id}
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <motion.div
                animate={battleState}
                variants={swordVariants}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-rose-300 p-4 text-slate-900 shadow-[0_0_60px_rgba(251,191,36,0.45)]"
              >
                <Swords className="h-10 w-10" />
              </motion.div>
              <div className="flex flex-col gap-2 text-xs font-bold text-slate-300">
                <Button variant="outline" size="sm" onClick={runRandom}>
                  Random Duel
                </Button>
                <Button variant="gradient" size="sm" onClick={runBattle}>
                  Fight
                </Button>
                <Button variant="destructive" size="sm" onClick={reset}>
                  Reset Arena
                </Button>
              </div>
            </div>
            <ArenaCard
              char={right}
              position="B"
              onRelease={release}
              onOpen={onOpenCharacter}
              health={health.right}
              isWinner={result?.winner?.id === right?.id}
              showX={showX === right?.id}
            />
          </div>
          {timeline.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <div className="mb-2 text-sm font-black uppercase tracking-wide text-slate-200">Battle Flow</div>
              <div className="grid gap-3 md:grid-cols-3">
                {timeline.map((phase) => (
                  <div key={phase.round} className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 text-slate-200">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Round {phase.round}</div>
                    <div className="mt-2 space-y-1">
                      <div>A Strike: {phase.strikeA}</div>
                      <div>A Luck: {phase.luckA}</div>
                      <div>A Health: {phase.healthA}%</div>
                      <div className="pt-1">B Strike: {phase.strikeB}</div>
                      <div>B Luck: {phase.luckB}</div>
                      <div>B Health: {phase.healthB}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-5 text-center">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Winner</div>
              <div className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-lg font-black text-slate-100">
                {result.winner.name}
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Final totals — {left?.name}: {result.finalScoreA} • {right?.name}: {result.finalScoreB}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SidebarFilters({ data, filters, setFilters, combineAND, setCombineAND, onClear }) {
  const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b));
  const genders = useMemo(() => uniq(data.map((item) => item.gender || "")), [data]);
  const alignments = useMemo(() => uniq(data.map((item) => item.alignment || "")), [data]);
  const locations = useMemo(() => uniq(data.flatMap((item) => item.locations || [])), [data]);
  const factions = useMemo(() => uniq(data.flatMap((item) => item.faction || [])), [data]);
  const eras = useMemo(() => uniq(data.map((item) => item.era || "")), [data]);
  const tags = useMemo(() => uniq(data.flatMap((item) => item.tags || [])), [data]);
  const statuses = useMemo(() => uniq(data.map((item) => item.status || "")), [data]);
  const stories = useMemo(() => uniq(data.flatMap((item) => item.stories || [])), [data]);
  const powers = useMemo(() => uniq(data.flatMap((item) => (item.powers || []).map((p) => p.name))), [data]);

  const toggle = (key, value, single = false) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (single) {
        next[key] = next[key] === value ? undefined : value;
        return next;
      }
      const set = new Set([...(next[key] || [])]);
      set.has(value) ? set.delete(value) : set.add(value);
      next[key] = Array.from(set);
      return next;
    });
  };

  const Section = ({ title, values, keyName, single }) => (
    <div className="space-y-2">
      <div className="text-xs font-extrabold uppercase tracking-wide text-white/70">{title}</div>
      <div className="flex max-h-40 flex-wrap gap-2 overflow-auto pr-1">
        {values.map((value) => (
          <FacetChip key={value} active={single ? filters[keyName] === value : (filters[keyName] || []).includes(value)} onClick={() => toggle(keyName, value, !!single)}>
            {value}
          </FacetChip>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
          <Filter className="text-amber-300" /> Filters
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold uppercase tracking-wide">Mode</span>
          <Badge className="bg-white/10 text-white/80">{combineAND ? "AND" : "Blend"}</Badge>
          <Switch checked={combineAND} onCheckedChange={setCombineAND} />
        </div>
      </div>
      <Button variant="destructive" className="w-full" onClick={onClear}>
        Clear all
      </Button>
      <Section title="Gender / Sex" values={genders} keyName="gender" single />
      <Section title="Alignment" values={alignments} keyName="alignment" single />
      <Section title="Era" values={eras} keyName="era" />
      <Section title="Locations" values={locations} keyName="locations" />
      <Section title="Faction / Team" values={factions} keyName="faction" />
      <Section title="Powers" values={powers} keyName="powers" />
      <Section title="Tags" values={tags} keyName="tags" />
      <Section title="Status" values={statuses} keyName="status" />
      <Section title="Stories" values={stories} keyName="stories" />
    </div>
  );
}

function runDevTests() {
  if (process.env.NODE_ENV === "production") return;
  console.groupCollapsed("[Loremaker] quick sanity tests");
  console.assert(toSlug("Mystic Man!") === "mystic-man", "slug ok");
  console.assert(JSON.stringify(parseLocations("Hova, Yankopia; Afajato | and Luminae")) === JSON.stringify(["Hova", "Yankopia", "Afajato", "Luminae"]), "locations ok");
  const powers = parsePowers("Speed:8, Strength=10, Flight (9), Telepathy 7");
  console.assert(powers[0].level === 8 && powers[1].level === 10 && powers[2].level === 9 && powers[3].level === 7, "powers ok");
  const gurl = normalizeDriveUrl("https://drive.google.com/file/d/12345/view?usp=sharing");
  console.assert(gurl === "https://drive.google.com/uc?export=view&id=12345", "drive url normalised");
  console.groupEnd();
}

const CHAT_WEBHOOK = process.env.NEXT_PUBLIC_LOREMAKER_CHATBOT_WEBHOOK;
const TRACK_WEBHOOK = process.env.NEXT_PUBLIC_LOREMAKER_TRACK_WEBHOOK;

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", text: "Welcome to the Loremaker concierge. Ask about heroes, factions, or lore!" },
  ]);
  const [pending, setPending] = useState(false);
  const inputRef = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    const value = inputRef.current?.value?.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setPending(true);
    inputRef.current.value = "";
    try {
      if (CHAT_WEBHOOK) {
        const res = await fetch(CHAT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: value, timestamp: new Date().toISOString() }),
        });
        const data = await res.json().catch(() => ({}));
        const reply = data?.reply || data?.message || "The Lore council acknowledges your request.";
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Webhook not configured yet, but the Loremaker hears you." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Signal lost in the aether. Try again soon." }]);
      console.error(err);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="mb-3 w-80 rounded-3xl border border-white/15 bg-black/70 p-4 text-white backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
                <MessageCircle className="text-amber-300" size={16} /> Chat Console
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-2 text-sm">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={cx(
                    "rounded-2xl px-3 py-2",
                    message.role === "user" ? "bg-gradient-to-r from-amber-300 to-fuchsia-400 text-black" : message.role === "assistant" ? "bg-white/10 text-white" : "text-white/60"
                  )}
                >
                  {message.text}
                </div>
              ))}
              {pending && <div className="text-xs text-white/60">Consulting the archives…</div>}
            </div>
            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <Input ref={inputRef} placeholder="Ask the Loremaker…" disabled={pending} />
              <Button type="submit" disabled={pending} variant="gradient" size="sm">
                <Send size={14} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-fuchsia-400 to-indigo-500 text-black shadow-lg"
        whileTap={{ scale: 0.92 }}
        animate={{ y: open ? [0, -5, 0] : 0, boxShadow: open ? "0 20px 45px rgba(251,191,36,0.35)" : "0 12px 35px rgba(251,191,36,0.25)" }}
        aria-label="Toggle Lore chat"
      >
        <MessageCircle />
      </motion.button>
    </div>
  );
}

function FloatingScrollControls({ showTop, showBottom }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1], y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 via-fuchsia-400 to-indigo-500 px-4 py-2 text-sm font-extrabold text-black shadow-[0_20px_60px_rgba(251,191,36,0.35)]"
          >
            <Sparkles size={16} /> Top
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBottom && (
          <motion.button
            key="bottom"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 text-sm font-extrabold text-white backdrop-blur"
          >
            <ArrowDown size={16} /> Bottom
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function useTrackVisits() {
  useEffect(() => {
    if (!TRACK_WEBHOOK) return;
    const payload = {
      path: typeof window !== "undefined" ? window.location.pathname : "/loremaker",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    };
    fetch(TRACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn("Visit tracking failed", err));
  }, []);
}

export default function LoremakerApp() {
  const { data, loading, error, refetch } = useCharacters();
  const [filters, setFilters] = useState({});
  const [combineAND, setCombineAND] = useState(true);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [current, setCurrent] = useState(null);
  const [arenaSlots, setArenaSlots] = useState({ left: null, right: null });
  const [highlightCard, setHighlightCard] = useState(null);
  const [arenaPulseKey, setArenaPulseKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showArena, setShowArena] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useTrackVisits();
  useEffect(() => runDevTests(), []);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      setShowTop(scrollTop > 120 || Object.keys(filters).length > 0);
      setShowBottom(scrollTop + clientHeight < scrollHeight - 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [filters]);

  const arenaIds = useMemo(() => new Set([arenaSlots.left, arenaSlots.right].filter(Boolean)), [arenaSlots]);

  const filtered = useMemo(() => {
    let result = data.filter((char) => matchesFilters(char, filters, combineAND, query));
    switch (sortOption) {
      case "random": {
        const rng = seededRandom(`sort|${todayKey()}`);
        result = [...result].sort(() => rng() - 0.5);
        break;
      }
      case "faction": {
        result = [...result].sort((a, b) => (a.faction?.[0] || "").localeCompare(b.faction?.[0] || ""));
        break;
      }
      case "az": {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      }
      case "za": {
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      }
      case "power": {
        result = [...result].sort((a, b) => scoreCharacter(b) - scoreCharacter(a));
        break;
      }
      case "power-low": {
        result = [...result].sort((a, b) => scoreCharacter(a) - scoreCharacter(b));
        break;
      }
      default: {
        result = [...result].sort((a, b) => (__SOURCE_ORDER.get(a.id) ?? 0) - (__SOURCE_ORDER.get(b.id) ?? 0));
      }
    }
    return result.filter((char) => !arenaIds.has(char.id));
  }, [data, filters, combineAND, query, sortOption, arenaIds]);

  const handleFacet = (facet) => {
    setFilters((prev) => {
      const next = { ...prev };
      const key = facet.key;
      if (["locations", "faction", "tags", "era", "status", "stories", "alias", "powers"].includes(String(key))) {
        const set = new Set([...(next[key] || []), facet.value]);
        next[key] = Array.from(set);
      } else {
        next[key] = facet.value;
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setFilters({});

  const openCharacter = (char) => {
    setCurrent(char);
    setOpenModal(true);
  };

  const closeCharacter = () => {
    setOpenModal(false);
  };

  const useInSim = (id) => {
    setArenaSlots((prev) => {
      if (prev.left === id || prev.right === id) return prev;
      if (!prev.left) return { ...prev, left: id };
      if (!prev.right) return { ...prev, right: id };
      return { left: id, right: prev.left };
    });
    setHighlightCard(id);
    setArenaPulseKey(Date.now());
    setShowArena(true);
    setTimeout(() => setHighlightCard(null), 900);
  };

  const charactersForGrid = filtered;
  const currentCharacter = current ? data.find((item) => item.id === current.id) : null;

  const hasStories = useMemo(() => data.some((item) => (item.stories || []).length), [data]);

  return (
    <div className="relative min-h-screen bg-[#070813] text-white">
      <Aurora />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Insignia label="Lore" size={32} variant="site" />
            </div>
            <div className="text-2xl font-black tracking-tight">Loremaker Universe</div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search characters, powers, locations, tags..."
                className="w-72 bg-white/15 pl-9"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            </div>
            <Button variant="gradient" onClick={() => setShowFilters(true)} className="shadow-[0_15px_40px_rgba(250,204,21,0.3)]">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <X size={14} /> Clear
            </Button>
            <Button variant="subtle" onClick={() => setShowArena((prev) => !prev)}>
              <Swords size={14} /> {showArena ? "Hide Arena" : "Arena"}
            </Button>
            <Button variant="dark" onClick={() => refetch()}>
              <RefreshCcw size={14} /> Sync
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <HeroSection data={data} onOpen={openCharacter} onFacet={handleFacet} />

        <AnimatePresence>{showArena && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}>
            <BattleArena
              characters={data}
              slots={arenaSlots}
              setSlots={setArenaSlots}
              onOpenCharacter={(char) => openCharacter(char)}
              pulseKey={arenaPulseKey}
            />
          </motion.div>
        )}</AnimatePresence>

        {hasStories && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.3em] text-white/70">
              <Library size={14} /> Stories
            </div>
            <StoryChips data={data} onFacet={handleFacet} />
          </section>
        )}

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            <Users size={14} /> {filtered.length} heroes ready
          </div>
          <SortBar option={sortOption} setOption={setSortOption} />
        </section>

        {loading && <div className="text-lg font-black text-white">Loading characters from Google Sheets…</div>}
        {error && <div className="text-lg font-black text-rose-200">{error}</div>}

        <CharacterGrid
          data={charactersForGrid}
          onOpen={openCharacter}
          onFacet={handleFacet}
          onUseInSim={useInSim}
          highlightId={highlightCard}
        />
      </main>

      <CharacterModal
        open={openModal}
        onClose={closeCharacter}
        char={currentCharacter}
        onFacet={handleFacet}
        onUseInSim={useInSim}
      />

      {showFilters && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="absolute right-0 top-0 h-full w-[360px] overflow-y-auto border-l border-white/15 bg-black/60 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
              <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
                <Filter className="text-amber-300" /> Filters
              </div>
              <Button variant="subtle" size="sm" onClick={() => setShowFilters(false)}>
                Close
              </Button>
            </div>
            <SidebarFilters
              data={data}
              filters={filters}
              setFilters={setFilters}
              combineAND={combineAND}
              setCombineAND={setCombineAND}
              onClear={clearFilters}
            />
          </motion.aside>
        </div>
      )}

      <FloatingScrollControls showTop={showTop} showBottom={showBottom} />
      <ChatWidget />

      <footer className="mt-16 bg-gradient-to-r from-indigo-600/25 via-fuchsia-500/20 to-amber-300/25 py-10 text-center text-xs font-semibold text-white/60">
        © {new Date().getFullYear()} Loremaker Universe — Powered by imagination and spreadsheets.
      </footer>
    </div>
  );
}
