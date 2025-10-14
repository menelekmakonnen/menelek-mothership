const SHEET_ID = "1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM";
const SHEET_NAME = "Characters";
const SHEET_FALLBACKS = Array.from(new Set([SHEET_NAME, "Characters", "Sheet1"]));
const GVIZ_URL = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
const CSV_URL = (sheetName) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&sheet=${encodeURIComponent(sheetName)}`;

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

const RESERVED_HEADER_VALUES = new Set(
  Object.values(COL_ALIAS)
    .flat()
    .map((v) => v.toLowerCase())
);

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

function normalizeCellValue(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return String(value ?? "");
}

function guessNameIndex(rows) {
  const stats = new Map();
  rows.forEach((row) => {
    row.forEach((raw, idx) => {
      const value = normalizeCellValue(raw).trim();
      if (!value) return;
      if (/^https?:\/\//i.test(value)) return;
      if (/^[0-9\-]+$/.test(value) && !/[a-z]/i.test(value)) return;
      if (RESERVED_HEADER_VALUES.has(value.toLowerCase())) return;
      if (value.length < 2) return;
      const entry = stats.get(idx) || { hits: 0, bonus: 0 };
      entry.hits += 1;
      if (/[\s'-]/.test(value)) entry.bonus += 0.5;
      if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(value)) entry.bonus += 0.75;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) entry.bonus += 0.25;
      stats.set(idx, entry);
    });
  });
  let bestIdx = null;
  let bestScore = -Infinity;
  for (const [idx, { hits, bonus }] of stats) {
    const score = hits + bonus;
    if (score > bestScore) {
      bestIdx = Number(idx);
      bestScore = score;
    }
  }
  return bestIdx;
}

function ensureName(row, map = {}) {
  const get = (key) => {
    const idx = map[key];
    if (idx == null || idx >= row.length) return "";
    return normalizeCellValue(row[idx]);
  };
  let name = normalizeCellValue(get("name")).trim();
  if (name) return name;
  for (const value of row) {
    const text = normalizeCellValue(value).trim();
    if (!text) continue;
    if (RESERVED_HEADER_VALUES.has(text.toLowerCase())) continue;
    if (/^https?:\/\//i.test(text)) continue;
    if (/^[0-9\-]+$/.test(text) && !/[a-z]/i.test(text)) continue;
    name = text;
    break;
  }
  return name.trim();
}

function rowToCharacter(row, map = {}) {
  const get = (k) => {
    const idx = map[k];
    if (idx == null || idx >= row.length) return undefined;
    const value = normalizeCellValue(row[idx]);
    return value === "" ? undefined : value;
  };
  const name = ensureName(row, map);
  if (!name) return null;
  const rawId = get("id");
  const slugSource = toSlug(name) || toSlug(rawId || "");
  const slug = slugSource || toSlug(`${name}-${Math.random()}`);
  const char = {
    id: (rawId || slug || name).trim() || slug,
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

function gvizRowToArray(row) {
  const cells = row?.c || [];
  return cells.map((cell) => {
    if (!cell) return "";
    const value = cell.v ?? cell.f ?? cell;
    return normalizeCellValue(value);
  });
}

function dropEmptyRows(rows) {
  return rows.filter((row) => row.some((value) => normalizeCellValue(value).trim().length > 0));
}

function deriveMapFromRows(rows, initialMap = {}) {
  const working = [...rows];
  let map = { ...initialMap };
  if (map.name == null) {
    for (let i = 0; i < working.length; i++) {
      const normalized = working[i].map((value) => normalizeCellValue(value).trim());
      const alt = headerMap(normalized);
      if (alt.name != null) {
        map = { ...alt };
        working.splice(0, i + 1);
        break;
      }
    }
  }
  if (map.name == null) {
    const guess = guessNameIndex(working);
    if (guess != null) {
      map.name = guess;
    }
  }
  return { map, rows: working };
}

function parseCharactersFromRows(rows, map) {
  const parsed = [];
  rows.forEach((row) => {
    const character = rowToCharacter(row, map);
    if (character) parsed.push(character);
  });
  return parsed;
}

function ensureUniqueCharacters(characters) {
  const seenSlugs = new Set();
  const seenIds = new Set();
  return characters.map((char, index) => {
    const baseSlug = toSlug(char.slug || char.name || char.id || `character-${index + 1}`) || `character-${index + 1}`;
    let slug = baseSlug || `character-${index + 1}`;
    let slugAttempt = 1;
    while (seenSlugs.has(slug)) {
      slugAttempt += 1;
      slug = `${baseSlug}-${slugAttempt}`;
    }
    seenSlugs.add(slug);

    let id = normalizeCellValue(char.id).trim();
    if (!id) id = slug;
    let idAttempt = 1;
    const baseId = id;
    while (seenIds.has(id)) {
      idAttempt += 1;
      id = `${baseId}-${idAttempt}`;
    }
    seenIds.add(id);

    return fillDailyPowers({ ...char, id, slug });
  });
}

async function pullSheet(sheetName) {
  const res = await fetch(GVIZ_URL(sheetName));
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status}`);
  const txt = await res.text();
  return parseGViz(txt);
}

async function pullSheetCsv(sheetName) {
  const res = await fetch(CSV_URL(sheetName));
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);
  return res.text();
}

function parseCSV(text) {
  const rows = [];
  let current = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === "\"") {
        if (text[i + 1] === "\"") {
          value += "\"";
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        value += char;
      }
      continue;
    }
    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      current.push(value);
      value = "";
    } else if (char === "\n") {
      current.push(value);
      rows.push(current);
      current = [];
      value = "";
    } else if (char === "\r") {
      // ignore
    } else {
      value += char;
    }
  }
  current.push(value);
  rows.push(current);
  return rows;
}

function extractCharactersFromCsv(text) {
  const rawRows = dropEmptyRows(parseCSV(text));
  if (!rawRows.length) return [];
  // Attempt to detect headers within the CSV rows
  let headerRowIndex = -1;
  let map = {};
  for (let i = 0; i < rawRows.length; i++) {
    const normalized = rawRows[i].map((value) => normalizeCellValue(value).trim());
    const candidate = headerMap(normalized);
    if (candidate.name != null) {
      headerRowIndex = i;
      map = candidate;
      break;
    }
  }
  let dataRows = rawRows;
  if (headerRowIndex !== -1) {
    dataRows = rawRows.slice(headerRowIndex + 1);
  }
  const { map: ensuredMap, rows } = deriveMapFromRows([...dataRows], map);
  const parsed = parseCharactersFromRows(rows, ensuredMap);
  return ensureUniqueCharacters(parsed);
}

async function loadCharacters() {
  const errors = [];

  for (const sheetName of SHEET_FALLBACKS) {
    try {
      const obj = await pullSheet(sheetName);
      const rawRows = (obj.table?.rows || []).map(gvizRowToArray);
      const labels = (obj.table?.cols || []).map((c) => normalizeCellValue(c?.label || c?.id || ""));
      let map = headerMap(labels);
      let dataRows = [...rawRows];
      if (map.name != null && rawRows.length) {
        const headerSignature = labels.map((value) => normalizeCellValue(value).trim().toLowerCase());
        const firstRowSignature = rawRows[0].map((value) => normalizeCellValue(value).trim().toLowerCase());
        const looksLikeHeader =
          firstRowSignature.some(Boolean) &&
          firstRowSignature.length === headerSignature.length &&
          firstRowSignature.every((cell, idx) => cell === headerSignature[idx]);
        if (looksLikeHeader) {
          dataRows = rawRows.slice(1);
        }
      }
      if (map.name == null && rawRows.length) {
        for (let i = 0; i < rawRows.length; i++) {
          const normalized = rawRows[i].map((value) => normalizeCellValue(value).trim());
          const alt = headerMap(normalized);
          if (alt.name != null) {
            map = alt;
            dataRows = rawRows.slice(i + 1);
            break;
          }
        }
      }
      const { map: ensuredMap, rows } = deriveMapFromRows(dropEmptyRows(dataRows), map);
      const parsed = parseCharactersFromRows(rows, ensuredMap);
      if (parsed.length) {
        return { data: ensureUniqueCharacters(parsed), error: errors.length ? errors.join("; ") : null };
      }
      errors.push(`No characters found in sheet "${sheetName}"`);
    } catch (err) {
      errors.push(err?.message || String(err));
    }
  }

  for (const sheetName of SHEET_FALLBACKS) {
    try {
      const csv = await pullSheetCsv(sheetName);
      const parsed = extractCharactersFromCsv(csv);
      if (parsed.length) {
        return { data: parsed, error: errors.length ? errors.join("; ") : null };
      }
      errors.push(`No characters found in CSV sheet "${sheetName}"`);
    } catch (err) {
      errors.push(err?.message || String(err));
    }
  }

  console.error("Sheet load failed, using SAMPLE:", errors.join("; "));
  return { data: ensureUniqueCharacters(SAMPLE), error: errors.join("; ") || "Loaded fallback sample data" };
}

export {
  SHEET_ID,
  SHEET_NAME,
  SHEET_FALLBACKS,
  GVIZ_URL,
  CSV_URL,
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
