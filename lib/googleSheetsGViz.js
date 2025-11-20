/**
 * Google Sheets via GViz (No API Key Required!)
 * Uses public GViz JSON endpoint for publicly shared sheets
 */

const LOREMAKER_SPREADSHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';

// Try multiple possible sheet names
const POSSIBLE_SHEET_NAMES = ['Characters', 'Sheet1', 'Character Data', 'Loremaker'];

/**
 * Fetch Google Sheet data via GViz (no auth needed for public sheets)
 */
async function fetchSheetViaGViz(spreadsheetId, sheetName) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tq=SELECT *`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const text = await response.text();

    // GViz returns JSONP, extract the JSON
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if (!jsonMatch) return null;

    const data = JSON.parse(jsonMatch[1]);
    if (!data.table || !data.table.rows) return null;

    return data.table;
  } catch (error) {
    console.warn(`Failed to fetch sheet "${sheetName}":`, error.message);
    return null;
  }
}

/**
 * Normalize Google Drive links to consistent format
 */
export function normalizeDriveUrl(url) {
  if (!url || typeof url !== 'string') return null;

  url = url.trim();

  // Extract file ID from various Drive URL formats
  let fileId = null;
  let resourceKey = null;

  // Pattern: /file/d/{id}/
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Pattern: ?id={id}
  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) fileId = idMatch[1];
  }

  // Pattern: /thumbnail?id={id}
  if (!fileId) {
    const thumbMatch = url.match(/\/thumbnail\?.*id=([a-zA-Z0-9_-]+)/);
    if (thumbMatch) fileId = thumbMatch[1];
  }

  // Extract resource key if present (for restricted files)
  const keyMatch = url.match(/[?&]resourcekey=([a-zA-Z0-9_-]+)/);
  if (keyMatch) resourceKey = keyMatch[1];

  if (!fileId) {
    // Maybe it's already a direct URL
    if (url.startsWith('http')) return url;
    return null;
  }

  // Return normalized view URL
  let viewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
  if (resourceKey) {
    viewUrl += `&resourcekey=${resourceKey}`;
  }

  return viewUrl;
}

/**
 * Generate multiple Drive image URL variants for fallback
 */
export function getDriveImageVariants(url) {
  const normalized = normalizeDriveUrl(url);
  if (!normalized) return [];

  // Extract file ID
  const idMatch = normalized.match(/id=([a-zA-Z0-9_-]+)/);
  if (!idMatch) return [normalized];

  const fileId = idMatch[1];
  const resourceKey = normalized.match(/resourcekey=([a-zA-Z0-9_-]+)/)?.[1];

  const variants = [
    // Primary: uc export=view
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    // Googleusercontent (CDN)
    `https://lh3.googleusercontent.com/d/${fileId}`,
    // Thumbnail variants (different sizes)
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
    // Direct file link
    `https://drive.google.com/file/d/${fileId}/view`,
  ];

  // Add resource key to all if present
  if (resourceKey) {
    return variants.map(v => v.includes('?') ? `${v}&resourcekey=${resourceKey}` : `${v}?resourcekey=${resourceKey}`);
  }

  return variants;
}

/**
 * Fetch Loremaker data from Google Sheets (no API key needed!)
 */
export async function fetchLoremakerData() {
  console.log('📊 Fetching Loremaker from Google Sheets (GViz)...');

  // Try each possible sheet name
  let table = null;
  for (const sheetName of POSSIBLE_SHEET_NAMES) {
    table = await fetchSheetViaGViz(LOREMAKER_SPREADSHEET_ID, sheetName);
    if (table) {
      console.log(`✅ Found sheet: "${sheetName}"`);
      break;
    }
  }

  if (!table) {
    console.error('❌ Could not access any sheet tab');
    return { items: [] };
  }

  const rows = table.rows;
  console.log(`📋 Found ${rows.length} rows`);

  // Parse rows into characters
  const characters = rows
    .filter((row, idx) => {
      // Skip header row and empty rows
      if (idx === 0) return false;
      const charName = row.c[1]?.v; // Column B (Character)
      return charName && charName.trim();
    })
    .map((row, index) => {
      // Column mapping:
      // A: Char_ID (skip)
      // B: Character
      // C: Alias
      // D: Gender
      // E: Alignment
      // F: Location
      // G: Powers
      // H: Faction/Team
      // I: Era
      // J: Status
      // K: Short Description
      // L: Long Description
      // M: Stories
      // N: Cover Image
      // O-AC: Gallery Images 1-15

      const getValue = (colIdx) => row.c[colIdx]?.v || '';

      const characterName = getValue(1);
      const alias = getValue(2);
      const gender = getValue(3);
      const alignment = getValue(4);
      const location = getValue(5);
      const powers = getValue(6);
      const faction = getValue(7);
      const era = getValue(8);
      const status = getValue(9);
      const shortDescription = getValue(10);
      const longDescription = getValue(11);
      const stories = getValue(12);
      const coverImage = getValue(13);

      // Collect gallery images (columns 14-28 = O-AC)
      const galleryImages = [];
      for (let i = 14; i <= 28; i++) {
        const imgUrl = getValue(i);
        if (imgUrl) {
          const normalized = normalizeDriveUrl(imgUrl);
          if (normalized) galleryImages.push(normalized);
        }
      }

      // Normalize cover image
      const mainImageUrl = normalizeDriveUrl(coverImage) || galleryImages[0] || null;

      return {
        id: `loremaker-${index}`,
        character: characterName,
        alias: alias,
        gender: gender,
        alignment: alignment,
        location: location,
        powers: powers,
        faction: faction,
        era: era,
        status: status,
        description: shortDescription || longDescription,
        longDescription: longDescription,
        stories: stories,
        url: mainImageUrl,
        coverUrl: mainImageUrl,
        thumbnailUrl: mainImageUrl,
        imageVariants: mainImageUrl ? getDriveImageVariants(coverImage || galleryImages[0]) : [],
        galleryImages: galleryImages,
        type: 'character',
      };
    });

  console.log(`✅ Parsed ${characters.length} characters`);

  return {
    items: characters,
  };
}
