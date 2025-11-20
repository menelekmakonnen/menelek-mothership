/**
 * Google Sheets API Integration
 * Fetches character data from Loremaker Universe Google Sheet
 */

// Loremaker Universe spreadsheet ID (public fallback)
const LOREMAKER_SPREADSHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';
const SHEET_NAME = 'Characters'; // Default sheet name

/**
 * Fetch data from a Google Sheet
 * Note: The sheet must be publicly accessible (set to "Anyone with the link can view")
 *
 * Column structure for Loremaker Universe:
 * A: Char_ID (empty)
 * B: Character
 * C: Alias
 * D: Gender
 * E: Alignment
 * F: Location
 * G: Powers
 * H: Faction/Team
 * I: Era
 * J: Status
 * K: Short Description
 * L: Long Description
 * M: Stories
 * N: Cover Image
 * O-AC: Gallery Image 1-15 (15 images)
 *
 * @param {string} spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} range - Sheet range (e.g., 'Sheet1!A1:AC100')
 * @returns {Promise<Array>} Array of row data
 */
export async function fetchGoogleSheet(spreadsheetId, range) {
  try {
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    console.log(`Fetching sheet: ${spreadsheetId} range: ${range}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Sheets API Error (${response.status}):`, errorText);
      console.error(`Spreadsheet ID: ${spreadsheetId}`);
      console.error(`Range: ${range}`);

      if (response.status === 403) {
        console.error('💡 Fix: Make sure the spreadsheet is set to "Anyone with the link can view"');
      } else if (response.status === 401) {
        console.error('💡 Fix: Check your API key in .env.local');
      } else if (response.status === 404) {
        console.error('💡 Fix: Verify the spreadsheet ID or sheet name is correct');
      }

      return [];
    }

    const data = await response.json();
    console.log(`✅ Found ${data.values?.length || 0} rows in sheet`);
    return data.values || [];
  } catch (error) {
    console.error('❌ Network error fetching Google Sheet:', error);
    return [];
  }
}

// Fetch sheet data through the public GViz endpoint (no API key required)
async function fetchSheetViaGViz(spreadsheetId, sheetNames = [SHEET_NAME, 'Sheet1', 'Sheet']) {
  for (const name of sheetNames) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(name)}&tq=`;
      console.log(`Fetching GViz feed for sheet "${name}"...`);

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`GViz request failed for sheet ${name} (${response.status})`);
        continue;
      }

      const text = await response.text();

      // Strip the leading function wrapper: google.visualization.Query.setResponse(...)
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);?/s);
      if (!jsonMatch) {
        console.warn('GViz payload missing expected wrapper');
        continue;
      }

      const payload = JSON.parse(jsonMatch[1]);
      const rows = payload.table?.rows || [];

      if (rows.length === 0) {
        console.warn(`GViz feed for ${name} returned no rows`);
        continue;
      }

      // Normalise GViz row cells to plain arrays
      const values = rows.map((row) => (row.c || []).map((cell) => cell?.v ?? ''));
      console.log(`✅ GViz returned ${values.length} rows from sheet ${name}`);
      return values;
    } catch (error) {
      console.error(`❌ GViz parsing failed for sheet ${name}:`, error);
    }
  }

  return [];
}

/**
 * Convert Google Drive link to direct image URL
 * Handles multiple Google Drive URL formats
 *
 * @param {string} driveLink - Google Drive link
 * @returns {string} Direct image URL
 */
export function convertDriveLinkToImageUrl(driveLink) {
  if (!driveLink || typeof driveLink !== 'string') return null;

  // Trim whitespace
  driveLink = driveLink.trim();

  // If it's already a direct URL (http/https), check if it's a Drive link
  if (!driveLink.includes('drive.google.com') && (driveLink.startsWith('http://') || driveLink.startsWith('https://'))) {
    return driveLink; // Direct URL, return as is
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = null;

  // Format: https://drive.google.com/file/d/FILE_ID/view
  if (driveLink.includes('/file/d/')) {
    const parts = driveLink.split('/file/d/')[1];
    if (parts) {
      fileId = parts.split('/')[0].split('?')[0];
    }
  }
  // Format: https://drive.google.com/open?id=FILE_ID
  else if (driveLink.includes('drive.google.com/open?id=')) {
    const parts = driveLink.split('id=')[1];
    if (parts) {
      fileId = parts.split('&')[0];
    }
  }
  // Format: https://drive.google.com/uc?id=FILE_ID
  else if (driveLink.includes('drive.google.com/uc?')) {
    const parts = driveLink.split('id=')[1];
    if (parts) {
      fileId = parts.split('&')[0];
    }
  }
  // Format: Just the file ID
  else if (driveLink.match(/^[a-zA-Z0-9_-]{25,}$/)) {
    fileId = driveLink;
  }

  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // If we can't extract file ID, return null
  console.warn('Could not extract file ID from Drive link:', driveLink);
  return null;
}

/**
 * Fetch and structure Loremaker character data from Google Sheets
 *
 * @returns {Promise<Object>} Structured character data
 */
export async function fetchLoremakerData() {
  try {
    console.log('Fetching Loremaker data from Google Sheets...');

    const spreadsheetId = process.env.NEXT_PUBLIC_LOREMAKER_SHEET_ID || LOREMAKER_SPREADSHEET_ID;

    // Try the public GViz endpoint first (no API key needed)
    let rows = await fetchSheetViaGViz(spreadsheetId);

    // If GViz fails, fall back to the official Sheets API when a key is present
    if ((!rows || rows.length === 0) && process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      rows = await fetchGoogleSheet(
        spreadsheetId,
        `${SHEET_NAME}!A2:AC1000`
      );
    }

    if (!rows || rows.length === 0) {
      console.warn('No data found in Loremaker sheet');
      return { items: [] };
    }

    console.log(`Found ${rows.length} rows in Loremaker sheet`);

    // Parse rows into character objects
    const characters = rows
      .filter(row => row[1]) // Filter out empty rows (must have character name in column B)
      .map((row, index) => {
        // Column mapping:
        // A: Char_ID (empty, skip)
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

        const characterName = row[1] || 'Unknown Character';
        const alias = row[2] || '';
        const gender = row[3] || '';
        const alignment = row[4] || '';
        const location = row[5] || '';
        const powers = row[6] || '';
        const faction = row[7] || '';
        const era = row[8] || '';
        const status = row[9] || '';
        const shortDescription = row[10] || '';
        const longDescription = row[11] || '';
        const stories = row[12] || '';
        const coverImage = row[13] || '';

        // Collect gallery images (columns O-AC, indices 14-28)
        const galleryImages = [];
        for (let i = 14; i <= 28; i++) {
          if (row[i]) {
            galleryImages.push(convertDriveLinkToImageUrl(row[i]));
          }
        }

        // Use cover image, or first gallery image, or placeholder
        const mainImageUrl = convertDriveLinkToImageUrl(coverImage) ||
                           galleryImages[0] ||
                           null;

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
          galleryImages: galleryImages,
          type: 'character',
        };
      })
      .filter((character) => !!character.coverUrl); // Only keep characters with an image

    console.log(`Successfully parsed ${characters.length} characters`);

    return {
      items: characters,
    };
  } catch (error) {
    console.error('Error fetching Loremaker data:', error);
    return { items: [] };
  }
}

/**
 * Create a fallback/placeholder structure when API is not available
 */
export function getLoremakerFallbackData() {
  return {
    items: [
      {
        id: 'loremaker-placeholder-1',
        character: 'Sample Character',
        description: 'Character from the Loremaker Universe',
        url: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+1',
        coverUrl: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+1',
        thumbnailUrl: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+1',
        externalLink: null,
        type: 'character',
      },
      {
        id: 'loremaker-placeholder-2',
        character: 'Another Character',
        description: 'Another character from the Loremaker Universe',
        url: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+2',
        coverUrl: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+2',
        thumbnailUrl: 'https://via.placeholder.com/600x900/6B46C1/ffffff?text=Character+2',
        externalLink: null,
        type: 'character',
      },
    ],
  };
}
