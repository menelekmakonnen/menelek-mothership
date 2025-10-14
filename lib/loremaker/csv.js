import { headerMap } from "./headers";
import { normalizeCellValue } from "./helpers";
import { ensureUniqueCharacters } from "./characters";
import { deriveMapFromRows, dropEmptyRows, parseCharactersFromRows } from "./table";

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

export { extractCharactersFromCsv, parseCSV };
