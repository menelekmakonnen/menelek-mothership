# Google API Integration Setup Guide

This guide will help you set up Google Drive and Google Sheets API integration for your portfolio website.

## Prerequisites

- Google Account
- Google Drive folder with your photos (already created: `1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4`)
- Google Sheets with Loremaker character data (already created: `1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM`)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project name: `Menelek Portfolio`
4. Click **Create**

## Step 2: Enable Required APIs

1. In your new project, go to **APIs & Services** → **Library**
2. Search for and enable:
   - **Google Drive API**
   - **Google Sheets API**

## Step 3: Create API Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy the generated API key
4. Click **Edit API key** (pencil icon)
5. Under **API restrictions**, select **Restrict key**
6. Check:
   - Google Drive API
   - Google Sheets API
7. Click **Save**

## Step 4: Make Your Files Publicly Accessible

### For Google Drive (Photography & AI Albums):

1. Open your Google Drive folder: `https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4`
2. Right-click the folder → **Share**
3. Click **Change to anyone with the link**
4. Set permission to **Viewer**
5. Click **Done**
6. Repeat for any subfolders (Beauty, Professional, etc.)

### For Google Sheets (Loremaker):

1. Open your spreadsheet: `https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM`
2. Click **Share** button (top right)
3. Click **Change to anyone with the link**
4. Set permission to **Viewer**
5. Click **Done**

## Step 5: Configure Your Environment Variables

1. In your project root, create a file named `.env.local`
2. Copy the contents from `.env.local.example`:

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your_actual_api_key_here
```

3. Replace `your_actual_api_key_here` with your API key from Step 3
4. Save the file

## Step 6: Organize Your Google Drive Folder

Your Photography folder should have this structure:

```
Photography (1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4)
├── Beauty/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
└── Professional/
    ├── image1.jpg
    ├── image2.jpg
    └── ...
```

## Step 7: Format Your Google Sheet

Your Loremaker spreadsheet should have these columns (Row 1 = Headers):

| A: Character Name | B: Description | C: Image URL | D: External Link (optional) |
|-------------------|----------------|--------------|----------------------------|
| Character 1       | Description... | Google Drive link or direct URL | https://... |
| Character 2       | Description... | Google Drive link or direct URL | https://... |

**Important Notes:**
- Column C can contain:
  - Google Drive links (e.g., `https://drive.google.com/file/d/FILE_ID/view`)
  - Direct image URLs (e.g., `https://i.imgur.com/image.jpg`)
- The images linked in Column C must also be publicly accessible

## Step 8: Test Your Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your website
3. Click on **Photography**, **AI Albums**, or **Loremaker Universe**
4. Your content should now load from Google Drive and Sheets!

## Troubleshooting

### API Key Not Working

- Make sure the API key is correctly copied to `.env.local`
- Ensure there are no extra spaces or quotes around the key
- Verify the APIs are enabled in Google Cloud Console
- Check that API restrictions are properly set

### Images Not Loading

- Confirm the Google Drive folder/files are set to "Anyone with the link can view"
- Check that image files are in supported formats (JPG, PNG, GIF, etc.)
- Verify the folder IDs in the code match your actual folder IDs

### Sheet Data Not Loading

- Ensure the spreadsheet is publicly accessible
- Verify the sheet name is "Characters" (or update `SHEET_NAME` in `googleSheetsAPI.js`)
- Check that Column A (Character Name) is not empty for rows you want to display

### Console Errors

Open your browser's console (F12) and check for error messages. Common issues:
- `403 Forbidden`: Files are not publicly accessible
- `401 Unauthorized`: API key is invalid or not properly configured
- `404 Not Found`: Folder/Sheet ID is incorrect

## Fallback Behavior

If the API integration fails or is not configured:
- The website will automatically fall back to using static data from `realMediaData.js`
- A warning will appear in the console indicating the API is not configured
- The site will continue to work normally with the fallback data

## Security Notes

- Never commit your `.env.local` file to Git (it's already in `.gitignore`)
- The API key is safe to use client-side because:
  - It's restricted to only Google Drive and Sheets APIs
  - It can only read publicly accessible files
  - Usage quotas prevent abuse
- For production, consider using Cloud Functions or API routes for additional security

## Next Steps

Once your integration is working:
1. Add more photos to your Google Drive folders
2. Update your Loremaker character database in Google Sheets
3. Changes will automatically appear on your website without code updates!

---

**Need Help?**
- Google Drive API docs: https://developers.google.com/drive/api/v3/about-sdk
- Google Sheets API docs: https://developers.google.com/sheets/api/guides/concepts
