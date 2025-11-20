# Menelek Makonnen Portfolio - Setup Guide

This guide will help you set up the Google Drive and Google Sheets integration for the portfolio website.

## Prerequisites

- A Google Cloud account (free tier is sufficient)
- Access to the Google Drive folders containing your photography and AI albums
- Access to the Loremaker Universe Google Sheet

## Step 1: Google Cloud Project Setup

### 1.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it something like "Menelek Portfolio API"
5. Click "Create"

### 1.2 Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Google Drive API**
   - **Google Sheets API**

## Step 2: Service Account Creation

### 2.1 Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - **Service account name**: `portfolio-service-account`
   - **Service account ID**: (auto-generated)
   - **Description**: "Service account for portfolio website API access"
4. Click "Create and Continue"
5. **Skip** the optional permission steps (we'll grant permissions at the folder/sheet level)
6. Click "Done"

### 2.2 Generate Private Key

1. Find your newly created service account in the list
2. Click on it to view details
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Click "Create"
7. **Save this JSON file securely** - you'll need it for environment variables

## Step 3: Grant Access to Google Drive & Sheets

### 3.1 Find Your Service Account Email

Open the JSON key file you just downloaded. Look for the `client_email` field:

```json
{
  "client_email": "portfolio-service-account@your-project.iam.gserviceaccount.com",
  ...
}
```

Copy this email address.

### 3.2 Share Google Drive Folders

1. Open Google Drive and navigate to your folders:
   - **Photography Root**: `Mmm Media Albums` (ID: `1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4`)
   - **AI Albums Root**: (same or different folder)

2. For each folder:
   - Right-click > "Share"
   - Paste the service account email
   - Set permission to **Viewer**
   - **Uncheck** "Notify people"
   - Click "Share"

### 3.3 Share Loremaker Spreadsheet

1. Open the [Loremaker Universe Spreadsheet](https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/edit)
2. Click "Share" button
3. Paste the service account email
4. Set permission to **Viewer**
5. **Uncheck** "Notify people"
6. Click "Share"

## Step 4: Environment Variables Setup

### 4.1 Create `.env.local` File

In the root of your project, create a file named `.env.local`:

```bash
touch .env.local
```

### 4.2 Fill in Credentials

Open the JSON key file and copy the values to `.env.local`:

```env
# Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Google Drive Folder IDs
PHOTOGRAPHY_ROOT_FOLDER_ID=1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
AI_ALBUMS_ROOT_FOLDER_ID=1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4

# Google Sheets ID
LOREMAKER_SHEET_ID=1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM
```

**Important Notes:**

1. **GOOGLE_PRIVATE_KEY**: Copy the entire `private_key` value from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts. Keep the `\n` characters as-is.

2. **Folder IDs**: Get these from the Google Drive URL:
   ```
   https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
                                            ↑ This is the folder ID
   ```

3. **Sheet ID**: Get this from the Google Sheets URL:
   ```
   https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/edit
                                          ↑ This is the sheet ID
   ```

## Step 5: Test the Integration

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test API Endpoints

Open these URLs in your browser:

1. **Test Drive Folders:**
   ```
   http://localhost:3000/api/drive/folders?parentId=1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
   ```
   Should return a list of folders (Beauty, Professional, etc.)

2. **Test Drive Images** (replace FOLDER_ID with one from step 1):
   ```
   http://localhost:3000/api/drive/images?folderId=FOLDER_ID
   ```
   Should return a list of images from that folder

3. **Test Loremaker Characters:**
   ```
   http://localhost:3000/api/sheets/characters
   ```
   Should return 20 random characters from the spreadsheet

### 5.3 Check for Errors

If you see errors:

- **"Missing Google API credentials"**: Check your `.env.local` file exists and has correct values
- **"Failed to fetch folders"**: Ensure the service account email has been shared with the Drive folders
- **"Failed to fetch characters"**: Ensure the service account email has been shared with the Sheets document
- **401/403 errors**: Verify the service account has Viewer access to all resources

## Step 6: Folder Structure Requirements

### Photography Folders

Your Google Drive structure should look like:

```
Mmm Media Albums/
├── Beauty/
│   ├── 2024-11-15 Lagos/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   └── 2024-10-20 Studio/
│       └── ...
└── Professional/
    └── ...
```

**Important:**
- Each subfolder under Beauty/Professional represents one album
- Use format: `YYYY-MM-DD Name of Shoot`
- Empty folders are automatically filtered out

### Loremaker Spreadsheet

Your sheet should have these columns:
- Char_ID (can be empty)
- Character
- Alias
- Gender
- Alignment
- Location
- Powers
- Faction/Team
- Era
- Status
- Short Description
- Long Description
- Stories
- **Cover Image** (Google Drive link - REQUIRED)
- Gallery Image 1-15 (Google Drive links)

**Important:**
- Only characters with a Cover Image will be displayed
- Drive links should be in format: `https://drive.google.com/file/d/FILE_ID/view`

## Step 7: Deployment (Vercel)

### 7.1 Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable from `.env.local`:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `PHOTOGRAPHY_ROOT_FOLDER_ID`
   - `AI_ALBUMS_ROOT_FOLDER_ID`
   - `LOREMAKER_SHEET_ID`
4. Make sure to select all environments (Production, Preview, Development)

### 7.2 Redeploy

After adding environment variables, trigger a new deployment.

## Troubleshooting

### Issue: "No files found"

**Solution:**
- Check that the folders contain actual image files (JPG, PNG, etc.)
- Verify folder IDs are correct
- Ensure service account has Viewer access

### Issue: "Private key error"

**Solution:**
- Make sure the private key in `.env.local` includes the full key with header/footer
- Keep the `\n` characters (don't replace with actual newlines)
- Ensure the key is wrapped in quotes

### Issue: "Characters not loading"

**Solution:**
- Check that characters have Cover Image links
- Verify service account has access to the images in Drive
- Make sure the sheet name is correct (default is "Sheet1")

### Issue: "Rate limit errors"

**Solution:**
- Google Drive API has quotas (10,000 requests per 100 seconds)
- Add caching on the frontend to reduce API calls
- Consider implementing server-side caching in the API routes

## Security Notes

1. **Never commit `.env.local`** to version control (it's already in `.gitignore`)
2. **Don't share the service account JSON key** publicly
3. **Use read-only (Viewer) permissions** for the service account
4. **Rotate keys periodically** for security
5. **Monitor API usage** in Google Cloud Console

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api/guides/concepts)
- [Service Account Authentication](https://cloud.google.com/iam/docs/service-accounts)

---

## Quick Reference

### Get Folder ID from URL
```
https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
                                        ↑ Folder ID
```

### Get Sheet ID from URL
```
https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/edit
                                      ↑ Sheet ID
```

### Get File ID from Drive Link
```
https://drive.google.com/file/d/1abcd1234efgh5678/view
                                ↑ File ID
```

---

**Need help?** Check the [README.md](./README.md) for general project information or open an issue.
