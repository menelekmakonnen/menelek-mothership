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

function buildDriveImageUrls(id) {
  if (!id) return null;
  return {
    id,
    thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w1600-h1600`,
    view: `https://drive.google.com/uc?export=view&id=${id}`,
    download: `https://drive.google.com/uc?export=download&id=${id}`,
  };
}

function normaliseDriveEntry(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const idMatch = trimmed.match(/[-\w]{25,}/);
  if (!idMatch) {
    return {
      id: trimmed,
      thumb: trimmed,
      view: trimmed,
      download: trimmed,
    };
  }
  return buildDriveImageUrls(idMatch[0]);
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
        const images = IMAGE_COLUMNS.map((column) => normaliseDriveEntry(row[column])).filter(Boolean);
        if (!images.length) {
          return null;
        }

        const coverAsset = images[0];

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
          coverImage: coverAsset.view || coverAsset.thumb,
          coverImageFull: coverAsset.download || coverAsset.view || coverAsset.thumb,
          galleryImages: images.map((image) => ({
            id: image.id,
            thumb: image.thumb,
            view: image.view,
            download: image.download,
          })),
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
