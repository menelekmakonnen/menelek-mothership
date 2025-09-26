import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  Tags,
  Users,
  MapPin,
  Shield,
  Zap,
  Swords,
  Eye,
  Image as ImageIcon,
  ListTree,
  Rows,
  Sparkles,
} from "lucide-react";

/**
 * Loremaker — Characters (v2)
 * Spicier colorway • Skill meters • Cover + Gallery slider • Short/Long desc • Aliases • Split locations
 * Era belt • Daily featured slider (Character, Faction, Location, Power) deterministic per day
 * Story section (filters by shared appearances)
 *
 * Data: Google Sheets via GViz (read-only). Later you can swap to a private Sheets API route without changing this UI.
 */

// ======= CONFIG ======= //
const SHEET_ID = "1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM"; // replace if needed
const TAB = "Characters"; // public-safe view

// ======= UTIL ======= //
const cn = (...a) => a.filter(Boolean).join(" ");
const sanitize = (s) => (s == null ? "" : String(s)).trim();
const tokenize = (s) => sanitize(s).split(/[;|]/g).flatMap((t) => t.split(",")).map((x) => x.trim()).filter(Boolean);
const toSlug = (s) => sanitize(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function parseGVizJSONP(text) {
  const start = text.indexOf("(") + 1;
  const end = text.lastIndexOf(")");
  if (start <= 0 || end <= 0) throw new Error("Unexpected GViz payload");
  return JSON.parse(text.slice(start, end));
}

function rowsFromGViz(data) {
  const cols = (data.table.cols || []).map((c) => (c.label || c.id || "").toString().trim());
  const rows = (data.table.rows || []);
  const looksLikeLetterCols = cols.length > 0 && cols.every((l) => l === "" || /^[A-Z]+$/.test(l));
  const firstRowCells = rows[0]?.c || [];
  const firstRowAllStrings = firstRowCells.length > 0 && firstRowCells.every((cell) => typeof cell?.v === "string");
  if (looksLikeLetterCols && firstRowAllStrings) {
    const headerLabels = firstRowCells.map((cell, i) => (cell?.v ?? `col_${i}`)).map((s) => s.toString().trim());
    return rows.slice(1).map((r) => {
      const obj = {};
      (r.c || []).forEach((cell, i) => {
        obj[headerLabels[i] || `col_${i}`] = cell && typeof cell.v !== "undefined" ? cell.v : "";
      });
      return obj;
    });
  }
  // Normal path
  return rows.map((r) => {
    const obj = {};
    (r.c || []).forEach((cell, i) => {
      obj[cols[i] || `col_${i}`] = cell && typeof cell.v !== "undefined" ? cell.v : "";
    });
    return obj;
  });
}

// power text → [{name, level?}] — supports "Speed:8", "Speed (8)", "Speed-8", "Speed=8"
function parsePowersWithLevels(text) {
  const toks = tokenize(text);
  return toks
    .map((tok) => {
      const m = tok.match(/^(.+?)[\s]*[:=\-\(]?[\s]*(\d{1,2})?\)?$/); // lax capture
      const name = sanitize(m?.[1]);
      const lvl = m?.[2] ? Math.max(0, Math.min(10, parseInt(m[2], 10))) : null;
      return name ? { name, level: lvl } : null;
    })
    .filter(Boolean);
}

function splitLocations(text) {
  // treat commas/semicolons/pipes as separators; also split on " and " conservatively
  return sanitize(text)
    .replace(/\sand\s/gi, ",")
    .split(/[;,|]/g)
    .flatMap((t) => t.split(","))
    .map((x) => x.trim())
    .filter(Boolean);
}

// Daily deterministic pick (per kind) using date-based seed
function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function xorshift32(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return (x >>> 0) / 4294967296;
  };
}
function strHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24); } return h >>> 0; }
function pickDeterministic(arr, salt) { if (!arr?.length) return null; const rng = xorshift32(strHash(`${salt}|${dayKey()}`)); const idx = Math.floor(rng() * arr.length); return arr[idx]; }

// ======= COLUMN MAP ======= //
const COLMAP = [
  { keys: ["id", "ID", "CharID", "Character ID"], as: "id" },
  { keys: ["slug", "Slug"], as: "slug" },
  { keys: ["name", "character", "Character", "Name", "Character Name", "Full Name", "Display Name", "Hero Name"], as: "name" },
  { keys: ["alias", "aliases", "Alias", "Aliases", "Also Known As"], as: "aliases" },
  { keys: ["gender", "Gender", "Sex", "Gender Identity"], as: "gender" },
  { keys: ["alignment", "Alignment", "Moral Alignment", "Morality"], as: "alignment" },
  { keys: ["location", "base", "Base", "Location", "Home Base", "Base of Operations", "City"], as: "location" },
  { keys: ["powers", "abilities", "Abilities", "Powers", "Power Set", "Power(s)", "Abilities/Skills"], as: "powers" },
  { keys: ["faction/team", "faction", "team", "Faction/Team", "Faction", "Team", "Affiliation", "Group", "Organization", "Team(s)", "Faction(s)"], as: "factionTeam" },
  { keys: ["tags", "tag", "Tag", "Tags", "Keywords", "Labels"], as: "tags" },
  { keys: ["status", "Status", "Life Status", "State"], as: "status" },
  { keys: ["type", "Type"], as: "type" },
  { keys: ["era", "Era"], as: "era" },
  { keys: ["image", "imageurl", "Image", "ImageURL", "Portrait", "Image Link", "Image URL", "Thumbnail", "Cover"], as: "imageUrl" },
  { keys: ["cover image", "cover", "Cover Image", "Main Image"], as: "coverImage" },
  { keys: ["short description", "Short Description", "ShortDesc"], as: "shortDesc" },
  { keys: ["long description", "Long Description", "LongDesc", "Description"], as: "longDesc" },
  { keys: ["firstappearance", "FirstAppearance", "First Appearance", "Debut", "First Seen"], as: "firstAppearance" },
  { keys: ["stories", "appearsin", "Stories", "Appearances", "Story Links"], as: "stories" },
];

function canonicalizeRow(row) {
  const lowerMap = new Map(Object.keys(row).map((k) => [k.toLowerCase(), k]));
  const out = {};
  for (const { keys, as } of COLMAP) {
    const found = keys.map((k) => lowerMap.get(k.toLowerCase())).find(Boolean);
    if (found) out[as] = row[found];
  }
  // Slug/ID
  if (!out.slug && out.name) out.slug = toSlug(out.name);
  if (!out.id && out.slug) out.id = out.slug.toUpperCase();

  // Arrays
  out.tagsArr = tokenize(out.tags || "");
  out.aliasesArr = tokenize(out.aliases || "");
  out.powersLeveled = parsePowersWithLevels(out.powers || "");
  out.powersArr = out.powersLeveled.map((p) => p.name);
  out.factionsArr = tokenize(out.factionTeam || "");
  out.locationsArr = splitLocations(out.location || "");
  out.storiesArr = tokenize(out.stories || "");

  // Media
  out.coverImage = sanitize(out.coverImage || out.imageUrl || "");
  // Gallery 1..15 (by scanning keys)
  const galleryKeys = Object.keys(row).filter((k) => /gallery\s*(image)?\s*\d+/i.test(k));
  out.gallery = galleryKeys
    .sort((a, b) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0))
    .map((k) => sanitize(row[k]))
    .filter(Boolean);

  // Plain fields
  out.name = sanitize(out.name);
  out.gender = sanitize(out.gender);
  out.alignment = sanitize(out.alignment);
  out.status = sanitize(out.status);
  out.type = sanitize(out.type);
  out.era = sanitize(out.era);
  out.firstAppearance = sanitize(out.firstAppearance);
  out.shortDesc = sanitize(out.shortDesc);
  out.longDesc = sanitize(out.longDesc);
  return out;
}

// ======= LUX BACKGROUND (Aurora Diamonds) ======= //
function DiamondsAurora({ className }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d");
    const scale = () => { const dpr = devicePixelRatio || 1; c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    scale();
    const onResize = () => scale();
    const onMove = (e) => { const r = c.getBoundingClientRect(); mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }; };

    const cell = 16, rot = Math.PI / 4, size = 2.2;
    let t = 0;
    const draw = () => {
      const w = c.offsetWidth, h = c.offsetHeight; t += 0.003;
      // Aurora gradient
      const g1 = ctx.createLinearGradient(0, 0, w, h);
      g1.addColorStop(0, "#0b0f2a");
      g1.addColorStop(1, "#0b0820");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
      const { x: mx, y: my } = mouseRef.current;
      for (let y = 0; y < h + cell; y += cell) {
        for (let x = 0; x < w + cell; x += cell) {
          const cx = x + cell / 2, cy = y + cell / 2; const dx = cx - mx, dy = cy - my; const dist = Math.hypot(dx, dy);
          const phase = (Math.sin((x + y) * 0.012 + t) + 1) / 2; // 0..1
          const aura = Math.max(0, 1 - dist / 72);
          const alpha = 0.03 + phase * 0.05 + aura * 0.15;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
          const hue = 200 + phase * 120; // deep cyan → magenta
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", onResize);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerleave", () => (mouseRef.current = { x: -9999, y: -9999 }));
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10 h-full w-full", className)} />;
}

// ======= UI Parts ======= //
function Button({ children, onClick, icon: Icon, className = "", title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "px-3 py-2 rounded-xl border text-white/95",
        "bg-gradient-to-b from-white/15 to-white/5 border-white/20",
        "shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:from-white/25 hover:to-white/10",
        "backdrop-blur transition-all hover:shadow-[0_16px_60px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">{Icon ? <Icon className="h-4 w-4" /> : null}{children}</span>
    </button>
  );
}
function Card({ children, className = "" }) {
  return (
    <div className={cn(
      "rounded-2xl border border-white/12 bg-white/5 backdrop-blur",
      "shadow-[0_12px_60px_rgba(0,0,0,0.45)] p-5",
      className
    )}>{children}</div>
  );
}
function Chip({ label, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "px-2.5 py-1 rounded-full border text-xs",
        active
          ? "bg-gradient-to-r from-cyan-500/25 via-fuchsia-500/25 to-amber-500/25 border-fuchsia-300/50 text-white"
          : "bg-white/7 border-white/15 text-white/85 hover:bg-white/12"
      )}
    >
      {label}
    </button>
  );
}
function Meter({ value = 0 }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / 10) * 100)));
  return (
    <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #22d3ee, #a78bfa, #f59e0b)",
          boxShadow: "0 0 12px rgba(167,139,250,0.45)",
        }}
      />
    </div>
  );
}

// ======= Data Hook ======= //
function useCharacters() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(TAB)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const gviz = parseGVizJSONP(text);
      const raw = rowsFromGViz(gviz);
      const canon = raw.map(canonicalizeRow);
      setRows(canon);
    } catch (e) {
      console.error(e);
      setError("Could not load Google Sheet. Check sharing or tab name.");
      setRows(sampleCharacters);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return { rows, loading, error, reload: load };
}

// ======= Facets & Filtering ======= //
const emptyQuery = { gender: [], alignment: [], location: [], powers: [], factionTeam: [], tags: [], status: [], era: [], stories: [] };
function appliesFacet(v, selected) { if (!selected || selected.length === 0) return true; if (Array.isArray(v)) return v.some((x) => selected.includes(x)); return selected.includes(v); }
function buildFacetIndex(rows) {
  const idx = { gender:new Map(), alignment:new Map(), location:new Map(), powers:new Map(), factionTeam:new Map(), tags:new Map(), status:new Map(), era:new Map(), stories:new Map() };
  const add = (m, k) => { if (!k) return; const key = k.toString(); m.set(key, (m.get(key) || 0) + 1); };
  for (const r of rows) {
    add(idx.gender, r.gender); add(idx.alignment, r.alignment); r.locationsArr.forEach((l)=>add(idx.location, l));
    r.powersArr.forEach((p)=>add(idx.powers, p)); r.factionsArr.forEach((f)=>add(idx.factionTeam, f));
    r.tagsArr.forEach((t)=>add(idx.tags, t)); add(idx.status, r.status); add(idx.era, r.era); r.storiesArr.forEach((s)=>add(idx.stories, s));
  }
  return idx;
}
function filterRows(rows, q, text) {
  const qlc = sanitize(text).toLowerCase();
  return rows.filter((r) => {
    const matchText = !qlc || [r.name, r.shortDesc, r.longDesc, r.powers, r.locationsArr.join(" "), r.factionTeam, r.tags]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(qlc));
    if (!matchText) return false;
    return (
      appliesFacet(r.gender, q.gender) &&
      appliesFacet(r.alignment, q.alignment) &&
      appliesFacet(r.locationsArr, q.location) &&
      appliesFacet(r.powersArr, q.powers) &&
      appliesFacet(r.factionsArr, q.factionTeam) &&
      appliesFacet(r.tagsArr, q.tags) &&
      appliesFacet(r.status, q.status) &&
      appliesFacet(r.era, q.era) &&
      appliesFacet(r.storiesArr, q.stories)
    );
  });
}

// ======= Character Components ======= //
function CharacterCard({ c, onOpen, onFacet }) {
  const img = c.coverImage || c.imageUrl || "";
  return (
    <Card className="group">
      <div className="aspect-[16/10] rounded-xl overflow-hidden border border-white/12 bg-black/40 relative">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={c.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/50"><ImageIcon className="h-7 w-7"/></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
        <div className="absolute left-3 right-3 bottom-3">
          <div className="font-semibold drop-shadow">{c.name}</div>
          {c.aliasesArr.length > 0 && <div className="text-[12px] text-white/80">aka {c.aliasesArr.slice(0,2).join(", ")}{c.aliasesArr.length>2?"…":""}</div>}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <div className="text-sm text-white/85">{c.shortDesc || "No short description yet."}</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {c.era && <Chip label={c.era} onClick={() => onFacet("era", c.era)} title="Filter by era" />}
        {c.gender && <Chip label={c.gender} onClick={() => onFacet("gender", c.gender)} title="Filter by gender" />}
        {c.alignment && <Chip label={c.alignment} onClick={() => onFacet("alignment", c.alignment)} title="Filter by alignment" />}
        {c.locationsArr.slice(0, 2).map((l) => (<Chip key={l} label={l} onClick={() => onFacet("location", l)} title="Filter by location" />))}
      </div>
      <div className="mt-3"><Button onClick={() => onOpen(c)} icon={Eye}>Open</Button></div>
    </Card>
  );
}

function GallerySlider({ cover, images }) {
  const all = [cover, ...images].filter(Boolean);
  const [i, setI] = useState(0);
  if (all.length === 0) return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[16/10] grid place-items-center text-white/40"><ImageIcon className="h-8 w-8"/></div>
  );
  const prev = () => setI((p) => (p - 1 + all.length) % all.length);
  const next = () => setI((p) => (p + 1) % all.length);
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[16/10]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={all[i]} alt="Gallery" className="w-full h-full object-cover" />
      {all.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronLeft/></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronRight/></button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
            {all.map((_, idx) => (
              <span key={idx} className={cn("h-1.5 w-3 rounded-full", idx === i ? "bg-white" : "bg-white/40")}/>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CharacterModal({ open, onClose, c, onFacet }) {
  return (
    <AnimatePresence>
      {open && c ? (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            className={cn(
              "relative z-10 mx-auto mt-[5vh] w-[94vw] max-w-6xl",
              "rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 text-white"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-white/60">{c.type || c.alignment}</div>
                <h3 className="text-2xl font-bold">{c.name}</h3>
                {c.aliasesArr.length > 0 && <div className="text-sm text-white/80">Aliases: {c.aliasesArr.join(", ")}</div>}
              </div>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-4">
              <GallerySlider cover={c.coverImage || c.imageUrl} images={c.gallery} />
              <div>
                {/* Descriptions */}
                <div className="space-y-3">
                  {c.shortDesc && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-white/60">Short Description</div>
                      <div className="text-sm text-white/90 mt-1">{c.shortDesc}</div>
                    </div>
                  )}
                  {c.longDesc && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="text-[11px] uppercase tracking-wide text-white/60">Long Description</div>
                      <div className="text-sm text-white/90 mt-1 whitespace-pre-wrap">{c.longDesc}</div>
                    </div>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-2 mt-4 text-sm">
                  {c.gender && <FacetKV k="Gender" v={c.gender} onFacet={() => onFacet("gender", c.gender)} />}
                  {c.alignment && <FacetKV k="Alignment" v={c.alignment} onFacet={() => onFacet("alignment", c.alignment)} />}
                  {c.locationsArr.length > 0 && <FacetKV k="Locations" v={c.locationsArr.join(", ")} onFacet={() => onFacet("location", c.locationsArr[0])} />}
                  {c.status && <FacetKV k="Status" v={c.status} onFacet={() => onFacet("status", c.status)} />}
                  {c.firstAppearance && <KV k="First Appearance" v={c.firstAppearance} />}
                  {c.era && <FacetKV k="Era" v={c.era} onFacet={() => onFacet("era", c.era)} />}
                </div>

                {/* Powers with meters */}
                {c.powersLeveled?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-white/10 p-3 bg-white/5">
                    <div className="text-[11px] uppercase tracking-wide text-white/60 mb-2">Abilities</div>
                    <div className="space-y-2">
                      {c.powersLeveled.map((p) => (
                        <div key={p.name} className="flex items-center gap-3">
                          <div className="min-w-[140px] text-sm text-white/90">{p.name}</div>
                          <Meter value={p.level ?? 0} />
                          <div className="w-8 text-right text-xs text-white/80">{p.level ?? "?"}/10</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stories */}
                {c.storiesArr?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[11px] uppercase tracking-wide text-white/60 mb-1">Stories</div>
                    <div className="flex flex-wrap gap-1.5">
                      {c.storiesArr.map((s) => (
                        <a key={s} href={(s.startsWith("http") ? s : `#/stories/${toSlug(s)}`)} className="text-cyan-300 hover:text-cyan-200 underline text-sm">{s}</a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function KV({ k, v }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
      <div className="text-white/60 text-[11px] uppercase tracking-wide">{k}</div>
      <div className="text-white/85 mt-0.5">{v}</div>
    </div>
  );
}
function FacetKV({ k, v, onFacet }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2">
      <div className="text-white/60 text-[11px] uppercase tracking-wide">{k}</div>
      <button className="mt-0.5 text-emerald-300 hover:text-emerald-200 underline" onClick={onFacet}>{v}</button>
    </div>
  );
}

// ======= Facet UI ======= //
function FacetBlock({ icon: Icon, title, entries, selected, onToggle }) {
  const [open, setOpen] = useState(true);
  const list = useMemo(() => Array.from(entries.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 24), [entries]);
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2"><Icon className="h-4 w-4"/> <span className="font-semibold text-sm">{title}</span></div>
        <button onClick={()=>setOpen(!open)} className="text-white/60 hover:text-white text-sm">{open?"Hide":"Show"}</button>
      </div>
      {open && (
        <div className="p-3 flex flex-wrap gap-1.5">
          {list.length===0 ? (<span className="text-white/60 text-sm px-2 py-1">No values</span>) : list.map(([k, n]) => (
            <Chip key={k} label={`${k} · ${n}`} active={selected.includes(k)} onClick={()=>onToggle(k)} />
          ))}
        </div>
      )}
    </Card>
  );
}
function FacetsPanel({ index, query, setQuery }) {
  const toggle = (facet) => (val) => { setQuery((q) => { const cur = new Set(q[facet]); cur.has(val) ? cur.delete(val) : cur.add(val); return { ...q, [facet]: Array.from(cur) }; }); };
  const clearAll = () => setQuery(JSON.parse(JSON.stringify(emptyQuery)));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-white/80 text-sm">Filters are ANDed across facets, ORed within facets.</div>
        <Button onClick={clearAll} className="bg-white/10">Clear All</Button>
      </div>
      <FacetBlock icon={Users} title="Gender" entries={index.gender} selected={query.gender} onToggle={toggle("gender")} />
      <FacetBlock icon={Shield} title="Alignment" entries={index.alignment} selected={query.alignment} onToggle={toggle("alignment")} />
      <FacetBlock icon={MapPin} title="Location" entries={index.location} selected={query.location} onToggle={toggle("location")} />
      <FacetBlock icon={Zap} title="Powers" entries={index.powers} selected={query.powers} onToggle={toggle("powers")} />
      <FacetBlock icon={Swords} title="Faction/Team" entries={index.factionTeam} selected={query.factionTeam} onToggle={toggle("factionTeam")} />
      <FacetBlock icon={Tags} title="Tags" entries={index.tags} selected={query.tags} onToggle={toggle("tags")} />
      <FacetBlock icon={Filter} title="Status" entries={index.status} selected={query.status} onToggle={toggle("status")} />
      <FacetBlock icon={Rows} title="Era" entries={index.era} selected={query.era} onToggle={toggle("era")} />
      <FacetBlock icon={ListTree} title="Stories" entries={index.stories} selected={query.stories} onToggle={toggle("stories")} />
    </div>
  );
}

// ======= Pagination ======= //
function usePagination(items, pageSize = 24) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);
  useEffect(() => { if (page > totalPages) setPage(1); }, [items.length]);
  return { page, setPage, totalPages, pageItems };
}
function Pager({ page, total, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-center gap-3 text-white/85">
      <button onClick={onPrev} className="px-2 py-1 rounded border border-white/15 hover:bg-white/10"><ChevronLeft className="h-4 w-4"/></button>
      <span className="text-sm">Page {page} / {total}</span>
      <button onClick={onNext} className="px-2 py-1 rounded border border-white/15 hover:bg-white/10"><ChevronRight className="h-4 w-4"/></button>
    </div>
  );
}

// ======= Featured Daily Slider ======= //
function FeaturedRail({ rows, onOpen, onFacet }) {
  const index = useMemo(() => buildFacetIndex(rows), [rows]);
  const featuredCharacter = pickDeterministic(rows, "CHAR") || null;
  const factions = Array.from(index.factionTeam.keys());
  const featuredFaction = pickDeterministic(factions, "FAC");
  const locations = Array.from(index.location.keys());
  const featuredLocation = pickDeterministic(locations, "LOC");
  const powers = Array.from(index.powers.keys());
  const featuredPower = pickDeterministic(powers, "POW");

  const slides = [
    {
      title: "Featured Character",
      gist: featuredCharacter?.shortDesc || "",
      image: featuredCharacter?.coverImage || featuredCharacter?.imageUrl,
      cta: "Read profile",
      onClick: () => featuredCharacter && onOpen(featuredCharacter),
      tag: featuredCharacter?.name,
    },
    {
      title: "Featured Faction",
      gist: `Explore characters from ${featuredFaction}`,
      image: rows.find((r)=>r.factionsArr.includes(featuredFaction))?.coverImage,
      cta: "View members",
      onClick: () => featuredFaction && onFacet("factionTeam", featuredFaction),
      tag: featuredFaction,
    },
    {
      title: "Featured Location",
      gist: `Who operates around ${featuredLocation}?`,
      image: rows.find((r)=>r.locationsArr.includes(featuredLocation))?.coverImage,
      cta: "See characters",
      onClick: () => featuredLocation && onFacet("location", featuredLocation),
      tag: featuredLocation,
    },
    {
      title: "Featured Power",
      gist: `Power focus: ${featuredPower}`,
      image: rows.find((r)=>r.powersArr.includes(featuredPower))?.coverImage,
      cta: "See wielders",
      onClick: () => featuredPower && onFacet("powers", featuredPower),
      tag: featuredPower,
    },
  ].filter((s) => s.tag);

  const [i, setI] = useState(0);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setI((p) => (p + 1) % slides.length);
  if (slides.length === 0) return null;

  const slide = slides[i];
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative grid md:grid-cols-2 gap-0">
        <div className="relative min-h-[240px]">
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image} alt="Featured" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/50"><Sparkles className="h-8 w-8"/></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
        <div className="p-5 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-widest text-white/70">{dayKey()} • rotates daily</div>
          <h3 className="text-2xl font-bold mt-1">{slide.title}</h3>
          <div className="text-white/85 mt-1">{slide.tag}</div>
          <p className="text-white/80 mt-2 text-sm">{slide.gist}</p>
          <div className="mt-3"><Button onClick={slide.onClick}>{slide.cta}</Button></div>
        </div>
        {slides.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronLeft/></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70"><ChevronRight/></button>
          </>
        )}
      </div>
    </Card>
  );
}

// ======= Era Belt ======= //
function EraBelt({ eras, selected, onToggle }) {
  if (!eras.length) return null;
  return (
    <div className="overflow-x-auto no-scrollbar -mx-1">
      <div className="flex items-center gap-2 px-1 py-2">
        {eras.map((e) => (
          <Chip key={e} label={e} active={selected.includes(e)} onClick={() => onToggle(e)} title="Filter by era" />
        ))}
      </div>
    </div>
  );
}

// ======= Stories Section ======= //
function StoriesSection({ rows, onToggle }) {
  const map = new Map();
  rows.forEach((r) => r.storiesArr.forEach((s) => map.set(s, (map.get(s) || 0) + 1)));
  const stories = Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).slice(0, 20);
  if (!stories.length) return null;
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-2">Stories</h3>
      <div className="flex flex-wrap gap-1.5">
        {stories.map(([s, n]) => (
          <Chip key={s} label={`${s} · ${n}`} onClick={() => onToggle(s)} />
        ))}
      </div>
      <p className="text-xs text-white/70 mt-1">Click a story to filter characters who appear together in it.</p>
    </div>
  );
}

// ======= SAMPLE FALLBACK ======= //
const sampleCharacters = [
  { id:"CHAR_TOHAZIE", slug:"tohazie", name:"Tohazie", type:"Hero", gender:"Male", alignment:"Lawful Good", location:"Accra", powers:"Warcraft:9; Leadership:8", factionTeam:"Earthguard", tags:"Legend; Warrior", status:"Active", coverImage:"", gallery:[], aliases:"The Red General", shortDesc:"Ancient general reborn in crimson armor.", longDesc:"Tohazie commands with iron calm. In battle, his red cuirass channels ancestral echoes.", era:"Old Gods Era" },
  { id:"CHAR_NIGHTEAGLE", slug:"nighteagle", name:"Nighteagle", type:"Hero", gender:"Female", alignment:"Neutral Good", location:"Accra, Rooftops", powers:"Aerial Combat:8; Tactical Mind:9", factionTeam:"Skywatch", tags:"Vigilante; Detective", status:"Active", coverImage:"", gallery:[], aliases:"Eagle of the Night", shortDesc:"Black-and-gold eagle armor; rooftop tactician.", longDesc:"She knows Accra's wind patterns like a score sheet.", era:"Modern Era" },
  { id:"CHAR_LITHESPEED", slug:"lithespeed", name:"Lithe Speed", type:"Hero", gender:"Female", alignment:"Chaotic Good", location:"Accra", powers:"Superspeed:9; HUD Visor:6", factionTeam:"Earthguard", tags:"Young; Tech", status:"Active", coverImage:"", gallery:[], shortDesc:"Blue-white armor, nineteen, laughs at physics.", longDesc:"Her steps drum triplets the ear can't parse.", era:"Modern Era" },
  { id:"CHAR_OBIMPE", slug:"obimpe", name:"Obimpe", type:"Entity", gender:"Female", alignment:"Chaotic Neutral", location:"Volta, Sky", powers:"Stormcall:10; Mistform:8", factionTeam:"None", tags:"Myth; Storm", status:"Unknown", coverImage:"", gallery:[], shortDesc:"White afro, thunder garments.", longDesc:"She speaks in isobars.", era:"Old Gods Era" },
];

// ======= MAIN PAGE ======= //
export default function LoremakerCharactersPage() {
  const { rows, loading, error, reload } = useCharacters();
  const [open, setOpen] = useState(null);

  // hash route for modal
  useEffect(() => {
    const applyFromHash = () => {
      const m = window.location.hash.match(/#\/?loremaker\/?([^?]+)/i);
      if (m && rows.length) {
        const slug = m[1].replace(/\/$/, "");
        const found = rows.find((r) => r.slug === slug || toSlug(r.name) === slug);
        setOpen(found || null);
      } else { setOpen(null); }
    };
    applyFromHash(); window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, [rows]);

  // query + search
  const [q, setQ] = useState({ ...emptyQuery });
  const [text, setText] = useState("");
  const filtered = useMemo(() => filterRows(rows, q, text), [rows, q, text]);
  const index = useMemo(() => buildFacetIndex(rows), [rows]);
  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 24);

  const onFacet = (facet, value) => { setQ((prev) => { const cur = new Set(prev[facet]); cur.has(value) ? cur.delete(value) : cur.add(value); return { ...prev, [facet]: Array.from(cur) }; }); setPage(1); };
  const onOpen = (c) => { setOpen(c); const slug = c.slug || toSlug(c.name); window.location.hash = `#/loremaker/${slug}`; };
  const onClose = () => { setOpen(null); if (/^#\/loremaker\//i.test(window.location.hash)) window.location.hash = "#/loremaker"; };

  const eras = useMemo(() => Array.from(index.era.keys()), [index]);

  return (
    <div className="min-h-screen text-white relative">
      <div className="fixed inset-0 -z-10"><DiamondsAurora/></div>

      <header className="sticky top-0 z-30 backdrop-blur bg-black/45 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400/30 via-fuchsia-400/30 to-amber-400/30 grid place-items-center border border-white/20"><Shield className="h-4 w-4"/></div>
            <span className="font-semibold tracking-tight">Loremaker Universe</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={reload} icon={RefreshCw}>Sync</Button>
          </div>
        </div>
      </header>

      <main className="py-9">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured rail (daily deterministic) */}
          {!loading && rows.length > 0 && (
            <div className="mb-6"><FeaturedRail rows={rows} onOpen={onOpen} onFacet={onFacet} /></div>
          )}

          {/* Era belt */}
          <div className="mb-3">
            <EraBelt eras={eras} selected={q.era} onToggle={(e)=>onFacet("era", e)} />
          </div>

          {/* Search */}
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="h-4 w-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input value={text} onChange={(e)=>{ setText(e.target.value); setPage(1); }} placeholder="Search name, powers, locations, tags…" className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20" />
              </div>
              <div className="text-white/70 text-sm">Showing <span className="text-white">{filtered.length}</span> of {rows.length}</div>
            </div>
          </Card>

          <div className="mt-6 grid lg:grid-cols-4 gap-6 items-start">
            {/* Grid */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {loading && Array.from({length:6}).map((_,i)=> (
                  <Card key={i}><div className="h-[160px] rounded-xl bg-black/30 animate-pulse"/><div className="h-3 w-24 bg-white/10 rounded mt-3"/><div className="h-3 w-40 bg-white/10 rounded mt-2"/></Card>
                ))}
                {!loading && pageItems.map((c) => (
                  <CharacterCard key={c.id || c.slug || c.name} c={c} onOpen={onOpen} onFacet={onFacet} />
                ))}
              </div>
              {!loading && filtered.length > 24 && (
                <div className="mt-6"><Pager page={page} total={totalPages} onPrev={()=>setPage(Math.max(1,page-1))} onNext={()=>setPage(Math.min(totalPages,page+1))} /></div>
              )}
              {error && (<p className="mt-4 text-amber-300/90 text-sm">{error} (displaying sample data)</p>)}

              {/* Stories aggregate */}
              {!loading && rows.length > 0 && (
                <StoriesSection rows={rows} onToggle={(s)=>onFacet("stories", s)} />
              )}
            </div>

            {/* Facets */}
            <div className="lg:col-span-1">
              <FacetsPanel index={index} query={q} setQuery={setQ} />
            </div>
          </div>
        </div>
      </main>

      <CharacterModal open={!!open} c={open || undefined} onClose={onClose} onFacet={onFacet} />
    </div>
  );
}
