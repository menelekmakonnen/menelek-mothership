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
  const slug = toSlug(name);
  const char = {
    id: get("id") || slug,
    slug,
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

const SAMPLE = [
  {
    id: "mystic-man",
    slug: "mystic-man",
    name: "Mystic Man",
    alias: ["Arcanist"],
    gender: "Male",
    alignment: "Hero",
    locations: ["Accra", "London"],
    status: "Active",
    era: "Modern",
    firstAppearance: "2019",
    powers: [
      { name: "Mystic Shields", level: 8 },
      { name: "Astral Projection", level: 7 },
    ],
    faction: ["Earthguard"],
    tags: ["Guardian", "Prime"],
    shortDesc: "Sorcerer defending the portals between realms.",
    longDesc: "Mystic Man keeps the dimensional gates sealed, wielding light webs and astral chains to keep cosmic threats away.",
    stories: ["Gatekeepers", "Age of Origins"],
    cover:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
  {
    id: "quantum-rift",
    slug: "quantum-rift",
    name: "Quantum Rift",
    alias: ["The Living Portal"],
    gender: "Non-binary",
    alignment: "Antihero",
    locations: ["Addis Ababa", "Orbit"],
    status: "Active",
    era: "Futurewave",
    firstAppearance: "2022",
    powers: [
      { name: "Phase Shift", level: 9 },
      { name: "Graviton Flux", level: 8 },
    ],
    faction: ["Gatebreakers"],
    tags: ["Legend"],
    shortDesc: "Dimensional tactician manipulating gravity wells.",
    longDesc: "Quantum Rift is a former protégé of Mystic Man who now experiments with unstable portals to rewrite destiny.",
    stories: ["Age of Origins", "The Rift War"],
    cover:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
  {
    id: "iron-shade",
    slug: "iron-shade",
    name: "Iron Shade",
    alias: ["Night Warden"],
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

async function pullSheet(sheetName) {
  const res = await fetch(GVIZ_URL(sheetName));
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  const txt = await res.text();
  return parseGViz(txt);
}

async function loadCharacters() {
  try {
    let obj;
    try {
      obj = await pullSheet(SHEET_NAME);
    } catch {
      obj = await pullSheet("Sheet1");
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
    return { data: parsed, error: null };
  } catch (e) {
    console.error("Sheet load failed, using SAMPLE:", e?.message || e);
    const parsed = SAMPLE.map(fillDailyPowers);
    return { data: parsed, error: e?.message || "Loaded fallback sample data" };
  }
}

export {
  SHEET_ID,
  SHEET_NAME,
  GVIZ_URL,
  COL_ALIAS,
  GALLERY_ALIASES,
  toSlug,
  normalizeDriveUrl,
  splitList,
  parseLocations,
  parsePowers,
  headerMap,
  parseGViz,
  rowToCharacter,
  fillDailyPowers,
  loadCharacters,
  SAMPLE,
};
