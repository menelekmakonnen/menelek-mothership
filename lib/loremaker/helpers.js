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

function normalizeCellValue(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return String(value ?? "");
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

export {
  normalizeDriveUrl,
  normalizeCellValue,
  parseLocations,
  parsePowers,
  splitList,
};
