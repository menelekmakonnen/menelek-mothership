/**
 * Google Sheets API Integration
 * Fetches character data from Loremaker Universe Google Sheet
 */

// Loremaker Universe spreadsheet ID
const LOREMAKER_SPREADSHEET_ID = '1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM';
const SHEET_NAME = 'Characters'; // Default sheet name

/**
 * Fetch data from a Google Sheet
 * Note: The sheet must be publicly accessible (set to "Anyone with the link can view")
 *
 * Column structure expected:
 * - A: Character Name
 * - B: Description
 * - C: Image URL (Google Drive link or direct URL)
 * - D: External Link (optional)
 *
 * @param {string} spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} range - Sheet range (e.g., 'Sheet1!A1:D100')
 * @returns {Promise<Array>} Array of row data
 */
export async function fetchGoogleSheet(spreadsheetId, range) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      console.error('Failed to fetch Google Sheet:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    return [];
  }
}

/**
 * Convert Google Drive link to direct image URL
 * Handles both /file/d/ and /open?id= formats
 *
 * @param {string} driveLink - Google Drive link
 * @returns {string} Direct image URL
 */
export function convertDriveLinkToImageUrl(driveLink) {
  if (!driveLink) return null;

  // Extract file ID from various Google Drive URL formats
  let fileId = null;

  if (driveLink.includes('/file/d/')) {
    fileId = driveLink.split('/file/d/')[1].split('/')[0];
  } else if (driveLink.includes('id=')) {
    fileId = driveLink.split('id=')[1].split('&')[0];
  } else if (driveLink.includes('drive.google.com/uc?')) {
    fileId = driveLink.split('id=')[1].split('&')[0];
  }

  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // If not a Drive link, return as is (might be direct URL)
  return driveLink;
}

/**
 * Fetch and structure Loremaker character data from Google Sheets
 *
 * @returns {Promise<Object>} Structured character data
 */
export async function fetchLoremakerData() {
  try {
    // Fetch all data from the sheet (adjust range as needed)
    const rows = await fetchGoogleSheet(
      LOREMAKER_SPREADSHEET_ID,
      `${SHEET_NAME}!A2:D100` // Skip header row
    );

    if (!rows || rows.length === 0) {
      console.warn('No data found in Loremaker sheet');
      return { items: [] };
    }

    // Parse rows into character objects
    const characters = rows
      .filter(row => row[0]) // Filter out empty rows (must have name)
      .map((row, index) => {
        const [name, description, imageUrl, externalLink] = row;

        return {
          id: `loremaker-${index}`,
          character: name || 'Unknown Character',
          description: description || '',
          url: convertDriveLinkToImageUrl(imageUrl),
          coverUrl: convertDriveLinkToImageUrl(imageUrl),
          thumbnailUrl: convertDriveLinkToImageUrl(imageUrl),
          externalLink: externalLink || null,
          type: 'character',
        };
      });

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
