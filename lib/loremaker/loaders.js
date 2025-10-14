import {
  CSV_URL,
  GVIZ_URL,
  SHEET_FALLBACKS,
} from "./constants.js";
import { normalizeCellValue } from "./helpers.js";
import { ensureUniqueCharacters, SAMPLE } from "./characters.js";
import { headerMap } from "./headers.js";
import { deriveMapFromRows, dropEmptyRows, gvizRowToArray, parseCharactersFromRows } from "./table.js";
import { extractCharactersFromCsv } from "./csv.js";

function parseGViz(text) {
  const m = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?$/s);
  if (!m) throw new Error("GViz format not recognized");
  return JSON.parse(m[1]);
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

export { loadCharacters, parseGViz, pullSheet, pullSheetCsv };
