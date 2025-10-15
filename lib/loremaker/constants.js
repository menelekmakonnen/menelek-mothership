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
    .map((value) => value.toLowerCase())
);

export {
  SHEET_ID,
  SHEET_NAME,
  SHEET_FALLBACKS,
  GVIZ_URL,
  CSV_URL,
  COL_ALIAS,
  GALLERY_ALIASES,
  RESERVED_HEADER_VALUES,
  toSlug,
};
