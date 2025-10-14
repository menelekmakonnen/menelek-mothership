import { COL_ALIAS, GALLERY_ALIASES, RESERVED_HEADER_VALUES } from "./constants.js";
import { normalizeCellValue } from "./helpers.js";

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

export { headerMap, guessNameIndex };
