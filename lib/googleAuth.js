import { google } from 'googleapis';

/**
 * Get authenticated Google Drive client
 * @returns {Promise<import('googleapis').drive_v3.Drive>}
 */
export async function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const authClient = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: authClient });

  return drive;
}

/**
 * Get authenticated Google Sheets client
 * @returns {Promise<import('googleapis').sheets_v4.Sheets>}
 */
export async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  return sheets;
}

/**
 * Validate Google API credentials
 * @returns {boolean}
 */
export function validateCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    console.error('Missing Google API credentials. Please check your .env.local file.');
    return false;
  }

  return true;
}
