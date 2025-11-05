const SHEET_ID = '1N1kbNjScNxfj48X2HXDFFgSUPxnl22UeJl13O3a16is';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

const COLUMN_KEYS = ['name', 'countries', 'levels', 'coverage', 'deadline', 'link'];

const splitPattern = /\b(?:and|to)\b|[,\/;•\n]|\u2013|\u2014/g;

function extractJSONPayload(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Unexpected response structure from Google Sheets');
  }
  return JSON.parse(text.slice(start, end + 1));
}

function cleanString(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return `${value}`.trim();
}

function toList(value) {
  const cleaned = cleanString(value);
  if (!cleaned) return [];
  return cleaned
    .split(splitPattern)
    .map((entry) => entry.replace(/[\u2022\u00b7]/g, '').trim())
    .filter(Boolean)
    .filter((item, index, arr) => index === arr.findIndex((el) => el.toLowerCase() === item.toLowerCase()));
}

function parseDeadline(cell) {
  if (!cell) return { iso: null, label: '', status: 'open' };
  const formatted = cleanString(cell.f ?? cell.v);
  if (!formatted) return { iso: null, label: '', status: 'open' };

  const raw = cleanString(cell.v ?? cell.f);
  let date;

  if (/Date\(/.test(raw)) {
    const match = raw.match(/Date\((\d+),(\d+),(\d+)/);
    if (match) {
      const [, y, m, d] = match.map(Number);
      date = new Date(Date.UTC(y, m, d));
    }
  }

  if (!date) {
    const parsed = Date.parse(formatted.replace(/\./g, '/'));
    if (!Number.isNaN(parsed)) {
      date = new Date(parsed);
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return { iso: null, label: formatted, status: 'open' };
  }

  const iso = date.toISOString();
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  let status = 'open';
  if (days < 0) status = 'closed';
  else if (days <= 30) status = 'closing-soon';

  const display = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return { iso, label: display, status };
}

function makeId(name, index) {
  const base = cleanString(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return base ? `${base}-${index + 1}` : `scholarship-${index + 1}`;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MenelekScholarshipsBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to load sheet (${response.status})`);
    }

    const text = await response.text();
    const payload = extractJSONPayload(text);
    const rows = payload.table?.rows ?? [];

    const scholarships = rows
      .map((row, index) => {
        const cells = row.c || [];
        const values = COLUMN_KEYS.map((_, colIndex) => cells[colIndex] ?? null);

        const [nameCell, countryCell, levelCell, coverageCell, deadlineCell, linkCell] = values;
        const name = cleanString(nameCell?.v ?? nameCell?.f ?? '');
        const link = cleanString(linkCell?.v ?? linkCell?.f ?? '');

        if (!name && !link) return null;

        const id = makeId(name || link, index);
        const deadline = parseDeadline(deadlineCell);

        return {
          id,
          name,
          countries: toList(countryCell?.v ?? countryCell?.f ?? ''),
          levels: toList(levelCell?.v ?? levelCell?.f ?? ''),
          coverage: toList(coverageCell?.v ?? coverageCell?.f ?? ''),
          coverageText: cleanString(coverageCell?.f ?? coverageCell?.v ?? ''),
          deadlineISO: deadline.iso,
          deadlineLabel: deadline.label,
          deadlineStatus: deadline.status,
          link,
          rawCountry: cleanString(countryCell?.f ?? countryCell?.v ?? ''),
          rawLevel: cleanString(levelCell?.f ?? levelCell?.v ?? ''),
          rawDeadline: cleanString(deadlineCell?.f ?? deadlineCell?.v ?? ''),
        };
      })
      .filter(Boolean);

    res.status(200).json({ scholarships });
  } catch (error) {
    console.error('Scholarship API error', error);
    res.status(500).json({ error: error.message || 'Failed to load scholarships' });
  }
}
