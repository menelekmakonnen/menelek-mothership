import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, RefreshCcw, X, ArrowUp, ArrowRight, ChevronLeft, ChevronRight, Filter, Users, MapPin, Layers3, Atom, Clock, LibraryBig, Crown, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

/**
 * LOREMAKER — Ultra build (JS version, no TS in JSX)
 * - No dropdowns, bright text everywhere except Arena
 * - Sidebar filters; floating Clear/Top
 * - Fixed-height manual Hero slider with arrow controls
 */

/** -------------------- Config -------------------- */
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
    .replace(/[|;/]/g, ",")
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
    const paren = item.match(/^(.*?)\((\d{1,2})\)$/);
    if (colon) {
      name = colon[1].trim();
      level = Math.min(10, parseInt(colon[2]));
    } else if (paren) {
      name = paren[1].trim();
      level = Math.min(10, parseInt(paren[2]));
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
      console.info(`[Loremaker] Loaded ${parsed.length} characters`);
      setRaw(parsed);
      __ALL_CHARS = parsed;
    } catch (e) {
      console.error(e);
      setError(e?.message || "Failed to load sheet");
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
  const initials = label.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("") || "LM";
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
        <Insignia label={fallbackLabel} size={64} />
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
      className={`px-3 py-1 rounded-full text-sm font-bold border transition ${active ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/40 hover:bg-white/20"}`}
    >
      {children}
    </button>
  );
}

/** -------------------- Character Card / Modal -------------------- */
function CharacterCard({ c, onOpen, onFacet, onUseInSim }) {
  const openProfile = () => onOpen(c);
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:shadow-2xl hover:shadow-fuchsia-500/15 transition overflow-hidden group">
      <div className="relative">
        <button onClick={openProfile} className="block text-left w-full">
          <ImageSafe src={c.cover || c.gallery[0]} alt={c.name} fallbackLabel={c.name} className="h-56 w-full object-cover" />
        </button>
        <div className="absolute left-2 top-2">
          <div className="inline-flex items-center gap-2">
            <div onClick={openProfile} className="cursor-pointer">
              <Insignia label={c.faction?.[0] || c.name} size={36} variant={c.faction?.length ? "faction" : "character"} expandableName={c.name} />
            </div>
          </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Insignia label={c.faction?.[0] || c.name} size={32} variant={c.faction?.length ? "faction" : "character"} />
          <CardTitle onClick={openProfile} role="button" className="cursor-pointer text-xl font-black tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,.6)] text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-amber-200">{c.name}</span>
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 text-white font-semibold">{c.shortDesc || c.longDesc}</CardDescription>
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
          <Button variant="secondary" className="font-bold" onClick={() => onUseInSim(c.id)}>
            Use in Sim
          </Button>
        </div>
      </CardFooter>
    </Card>
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
          <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition" onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition" onClick={() => setIdx((i) => (i + 1) % imgs.length)} aria-label="Next">
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imgs.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/60"}`} />
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
  if (f.locations?.length) checks.push(f.locations.every((v) => c.locations.map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.faction?.length) checks.push(f.faction.every((v) => (c.faction || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.tags?.length) checks.push(f.tags.every((v) => (c.tags || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.era?.length) checks.push(f.era.some((v) => (c.era || "").toLowerCase() === v.toLowerCase()));
  if (f.status?.length) checks.push(f.status.some((v) => (c.status || "").toLowerCase() === v.toLowerCase()));
  if (f.stories?.length) checks.push(f.stories.every((v) => (c.stories || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.alias?.length) checks.push(f.alias.some((v) => (c.alias || []).map((x) => x.toLowerCase()).includes(v.toLowerCase())));
  if (f.powers?.length) checks.push(f.powers.every((v) => c.powers.map((p) => p.name.toLowerCase()).includes(v.toLowerCase())));
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
  const base = c.powers.reduce((s, p) => s + (isFinite(p.level) ? p.level : 0), 0);
  const elite = (c.tags || []).some((t) => /leader|legend|mythic|prime/i.test(t)) ? 3 : 0;
  const eraMod = /old gods/i.test(c.era || "") ? 1.05 : 1;
  return Math.round((base + elite) * eraMod);
}
function rngLuck(max) {
  const r = (Math.random() * 2 - 1) * 0.18 * max;
  return Math.round(r);
}
function duel(c1, c2) {
  const s1 = scoreCharacter(c1),
    s2 = scoreCharacter(c2);
  const m = Math.max(s1, s2) || 1;
  const r1 = rngLuck(m),
    r2 = rngLuck(m);
  const f1 = s1 + r1,
    f2 = s2 + r2;
  const winner = f1 === f2 ? (Math.random() < 0.5 ? c1 : c2) : f1 > f2 ? c1 : c2;
  return { s1, s2, r1, r2, f1, f2, winner };
}

function BattleArena({ data, externalPick }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!externalPick) return;
    setResult(null);
    if (!a) setA(externalPick);
    else if (!b) setB(externalPick);
    else {
      setA(externalPick);
      setB("");
    }
  }, [externalPick]);

  const ca = data.find((x) => x.id === a);
  const cb = data.find((x) => x.id === b);
  const runRandom = () => {
    if (data.length < 2) return;
    const i1 = Math.floor(Math.random() * data.length);
    let i2 = Math.floor(Math.random() * data.length);
    if (i2 === i1) i2 = (i2 + 1) % data.length;
    setA(data[i1].id);
    setB(data[i2].id);
    setTimeout(() => setResult(duel(data[i1], data[i2])), 50);
  };
  const runDuel = () => {
    if (ca && cb && ca.id !== cb.id) setResult(duel(ca, cb));
  };

  return (
    <Card className="bg-white text-slate-900 border-0 shadow-[0_12px_60px_rgba(0,0,0,.35)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-extrabold">
          <Swords /> Battle Arena
        </CardTitle>
        <CardDescription className="text-slate-700 font-semibold">Auto‑luck enabled. Missing power values are seeded daily.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold">A:</span>
          {a ? <Badge className="bg-slate-900 text-white font-extrabold">{ca?.name}</Badge> : <span className="text-slate-600">None</span>}
          <span className="font-bold ml-4">B:</span>
          {b ? <Badge className="bg-slate-900 text-white font-extrabold">{cb?.name}</Badge> : <span className="text-slate-600">None</span>}
          <Button variant="outline" className="ml-auto font-bold" onClick={runRandom}>
            Random Duel
          </Button>
          <Button className="font-bold" onClick={runDuel}>
            Fight
          </Button>
          <Button variant="destructive" className="font-bold" onClick={() => { setA(""); setB(""); setResult(null); }}>
            Reset
          </Button>
        </div>
        {result && (
          <div className="grid md:grid-cols-3 gap-4 mt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold mb-1">{ca?.name}</div>
              <div className="text-sm">
                Base: <b>{result.s1}</b> | Luck: <b>{result.r1}</b> | Final: <b>{result.f1}</b>
              </div>
            </div>
            <div className="flex items-center justify-center text-slate-600">
              <Swords />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-bold mb-1">{cb?.name}</div>
              <div className="text-sm">
                Base: <b>{result.s2}</b> | Luck: <b>{result.r2}</b> | Final: <b>{result.f2}</b>
              </div>
            </div>
            <div className="md:col-span-3 text-center font-extrabold text-lg">Winner: {result.winner.name}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** -------------------- Sidebar Filters (no dropdowns) -------------------- */
function SidebarFilters({ data, filters, setFilters, combineAND, setCombineAND, sidebarRef, onClear }) {
  const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b));
  const genders = uniq(data.map((d) => d.gender || ""));
  const alignments = uniq(data.map((d) => d.alignment || ""));
  const locations = uniq(data.flatMap((d) => d.locations || []));
  const factions = uniq(data.flatMap((d) => d.faction || []));
  const eras = uniq(data.map((d) => d.era || ""));
  const tags = uniq(data.flatMap((d) => d.tags || []));
  const statuses = uniq(data.map((d) => d.status || ""));
  const stories = uniq(data.flatMap((d) => d.stories || []));
  const powers = uniq(data.flatMap((d) => d.powers.map((p) => p.name)));

  const toggle = (key, value, single = false) =>
    setFilters((f) => {
      const next = { ...f };
      if (single) {
        next[key] = next[key] === value ? undefined : value;
        return next;
      }
      const set = new Set([...(next[key] || [])]);
      set.has(value) ? set.delete(value) : set.add(value);
      next[key] = Array.from(set);
      return next;
    });

  function Section({ title, values, keyName, single }) {
    return (
      <div>
        <div className="text-xs uppercase tracking-widest font-extrabold mb-2">{title}</div>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
          {values.map((v) => (
            <FacetChip key={v} active={single ? filters[keyName] === v : (filters[keyName] || []).includes(v)} onClick={() => toggle(keyName, v, !!single)}>
              {v}
            </FacetChip>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside ref={sidebarRef} className="sticky top-20 space-y-6 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-2xl text-white">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold flex items-center gap-2">
          <Filter /> Filters
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold">Mode</span>
          <Badge className="bg-white/10 border-white/10">{combineAND ? "AND" : "Single"}</Badge>
     </div> </div>
  </aside>
);
