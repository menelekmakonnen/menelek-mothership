import { getSheetsClient, validateCredentials } from '@/lib/googleAuth';

/**
 * API endpoint to fetch Loremaker characters from Google Sheets
 * GET /api/sheets/characters?count=20&random=true
 * Returns list of characters with all their data
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate credentials
  if (!validateCredentials()) {
    return res.status(500).json({
      error: 'Google API credentials not configured',
      message: 'Please set up .env.local with your service account credentials'
    });
  }

  const { count = '20', random = 'true' } = req.query;
  const requestedCount = parseInt(count, 10);
  const shouldRandomize = random === 'true';

  const sheetId = process.env.LOREMAKER_SHEET_ID;

  if (!sheetId) {
    return res.status(500).json({
      error: 'Loremaker Sheet ID not configured',
      message: 'Please set LOREMAKER_SHEET_ID in .env.local'
    });
  }

  try {
    const sheets = await getSheetsClient();

    // Fetch all data from the sheet (assuming first sheet/tab)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:Z', // Adjust if your sheet has a different name
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.status(200).json({ characters: [], count: 0 });
    }

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Find column indices
    const getColumnIndex = (headerName) => {
      const index = headers.findIndex(h => h.toLowerCase().includes(headerName.toLowerCase()));
      return index !== -1 ? index : null;
    };

    const columnIndices = {
      charId: getColumnIndex('Char_ID'),
      character: getColumnIndex('Character'),
      alias: getColumnIndex('Alias'),
      gender: getColumnIndex('Gender'),
      alignment: getColumnIndex('Alignment'),
      location: getColumnIndex('Location'),
      powers: getColumnIndex('Powers'),
      faction: getColumnIndex('Faction'),
      era: getColumnIndex('Era'),
      status: getColumnIndex('Status'),
      shortDesc: getColumnIndex('Short Description'),
      longDesc: getColumnIndex('Long Description'),
      stories: getColumnIndex('Stories'),
      coverImage: getColumnIndex('Cover Image'),
    };

    // Gallery images (1-15)
    const galleryImageIndices = [];
    for (let i = 1; i <= 15; i++) {
      const index = getColumnIndex(`Gallery Image ${i}`);
      if (index !== null) {
        galleryImageIndices.push(index);
      }
    }

    // Transform rows to character objects
    const characters = dataRows
      .map((row) => {
        const coverImage = columnIndices.coverImage !== null ? row[columnIndices.coverImage] : null;

        // Only include characters with cover images
        if (!coverImage || coverImage.trim() === '') {
          return null;
        }

        // Extract Google Drive file ID from URL
        const extractDriveId = (url) => {
          if (!url) return null;
          const match = url.match(/\/d\/([^/]+)/);
          return match ? match[1] : null;
        };

        const coverImageId = extractDriveId(coverImage);
        const coverImageUrl = coverImageId
          ? `https://drive.google.com/uc?export=view&id=${coverImageId}`
          : coverImage;

        // Get gallery images
        const galleryImages = galleryImageIndices
          .map(index => row[index])
          .filter(url => url && url.trim() !== '')
          .map(url => {
            const id = extractDriveId(url);
            return id ? `https://drive.google.com/uc?export=view&id=${id}` : url;
          });

        return {
          id: row[columnIndices.character]?.toLowerCase().replace(/\s+/g, '-') || '',
          name: row[columnIndices.character] || '',
          alias: row[columnIndices.alias] || '',
          gender: row[columnIndices.gender] || '',
          alignment: row[columnIndices.alignment] || '',
          location: row[columnIndices.location] || '',
          powers: row[columnIndices.powers] || '',
          faction: row[columnIndices.faction] || '',
          era: row[columnIndices.era] || '',
          status: row[columnIndices.status] || '',
          shortDescription: row[columnIndices.shortDesc] || '',
          longDescription: row[columnIndices.longDesc] || '',
          stories: row[columnIndices.stories] || '',
          coverUrl: coverImageUrl,
          galleryImages: galleryImages,
          url: `https://loremaker.cloud/characters/${row[columnIndices.character]?.toLowerCase().replace(/\s+/g, '-')}`,
        };
      })
      .filter(char => char !== null); // Remove null entries

    // Randomize if requested
    let finalCharacters = characters;
    if (shouldRandomize) {
      finalCharacters = [...characters].sort(() => Math.random() - 0.5);
    }

    // Limit to requested count
    finalCharacters = finalCharacters.slice(0, requestedCount);

    return res.status(200).json({
      characters: finalCharacters,
      count: finalCharacters.length,
      total: characters.length
    });
  } catch (error) {
    console.error('Error fetching characters from Google Sheets:', error);
    return res.status(500).json({
      error: 'Failed to fetch characters',
      message: error.message
    });
  }
}
