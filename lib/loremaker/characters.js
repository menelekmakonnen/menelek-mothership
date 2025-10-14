import { RESERVED_HEADER_VALUES, toSlug } from "./constants.js";
import {
  normalizeCellValue,
  normalizeDriveUrl,
  parseLocations,
  parsePowers,
  splitList,
} from "./helpers.js";

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
  const character = {
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
    if (url) character.gallery.push(normalizeDriveUrl(url));
  }
  return character;
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

function fillDailyPowers(character) {
  const powers = (character.powers || []).map((power) => ({
    ...power,
    level: power.level > 0 ? power.level : dailyInt(`${character.name}|${power.name}`, 4, 9),
  }));
  return { ...character, powers };
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
    longDesc:
      "Mystic Man keeps the dimensional gates sealed, wielding light webs and astral chains to keep cosmic threats away.",
    stories: ["Gatekeepers", "Age of Origins"],
    cover: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200&auto=format&fit=crop",
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
    cover: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
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
    cover: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop",
    gallery: [],
  },
];

function ensureUniqueCharacters(characters) {
  const seenSlugs = new Set();
  const seenIds = new Set();
  return characters.map((character, index) => {
    const baseSlug =
      toSlug(character.slug || character.name || character.id || `character-${index + 1}`) || `character-${index + 1}`;
    let slug = baseSlug || `character-${index + 1}`;
    let slugAttempt = 1;
    while (seenSlugs.has(slug)) {
      slugAttempt += 1;
      slug = `${baseSlug}-${slugAttempt}`;
    }
    seenSlugs.add(slug);

    let id = normalizeCellValue(character.id).trim();
    if (!id) id = slug;
    let idAttempt = 1;
    const baseId = id;
    while (seenIds.has(id)) {
      idAttempt += 1;
      id = `${baseId}-${idAttempt}`;
    }
    seenIds.add(id);

    return fillDailyPowers({ ...character, id, slug });
  });
}

export { ensureUniqueCharacters, fillDailyPowers, rowToCharacter, SAMPLE };
