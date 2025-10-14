import { headerMap, guessNameIndex } from "./headers";
import { normalizeCellValue } from "./helpers";
import { rowToCharacter } from "./characters";

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

export { deriveMapFromRows, dropEmptyRows, gvizRowToArray, parseCharactersFromRows };
