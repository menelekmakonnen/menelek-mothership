const SHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=tsv`;

const IMAGE_COLUMNS = [
  'Cover Image',
  'Gallery Image 1',
  'Gallery Image 2',
  'Gallery Image 3',
  'Gallery Image 4',
  'Gallery Image 5',
  'Gallery Image 6',
  'Gallery Image 7',
  'Gallery Image 8',
  'Gallery Image 9',
  'Gallery Image 10',
  'Gallery Image 11',
  'Gallery Image 12',
  'Gallery Image 13',
  'Gallery Image 14',
  'Gallery Image 15',
];

function normaliseDriveUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.includes('drive.google.com')) {
    const idMatch = trimmed.match(/[-\w]{25,}/);
    if (idMatch) {
      return `https://drive.google.com/uc?id=${idMatch[0]}&export=view`;
    }
  }
  return trimmed;
}

function parseTsv(tsv) {
  const lines = tsv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return [];
  const headers = lines[0].split('\t');
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = lines[i].split('\t');
    const entry = {};
    headers.forEach((header, index) => {
      entry[header.trim()] = values[index] ? values[index].trim() : '';
    });
    rows.push(entry);
  }

  return rows;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(SHEET_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download spreadsheet with status ${response.status}`);
    }

    const tsv = await response.text();
    const rows = parseTsv(tsv);
    const characters = rows
      .map((row, index) => {
        const images = IMAGE_COLUMNS.map((column) => normaliseDriveUrl(row[column])).filter(Boolean);
        if (!images.length) {
          return null;
        }

        return {
          id: row.Char_ID || row.Character || `character-${index}`,
          character: row.Character || row.Alias || 'Unnamed Character',
          alias: row.Alias || '',
          gender: row.Gender || '',
          alignment: row.Alignment || '',
          location: row.Location || '',
          powers: row.Powers || '',
          faction: row['Faction/Team'] || '',
          era: row.Era || '',
          status: row.Status || '',
          shortDescription: row['Short Description'] || '',
          longDescription: row['Long Description'] || '',
          stories: row.Stories || '',
          coverImage: images[0],
          galleryImages: images,
        };
      })
      .filter(Boolean);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.status(200).json({ characters });
  } catch (error) {
    console.error('Failed to load Loremaker spreadsheet', error);
    res.status(502).json({ error: 'Unable to load characters at this time.' });
  }
}
