# Quick Setup - Get Your Media Loading

## Step 1: Get Google API Key (2 minutes)

1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it: "Portfolio Website"
4. Click "Create"
5. Wait for project to be created
6. Go to: https://console.cloud.google.com/apis/library
7. Search for "Google Drive API" → Click it → Click "Enable"
8. Search for "Google Sheets API" → Click it → Click "Enable"
9. Go to: https://console.cloud.google.com/apis/credentials
10. Click "+ CREATE CREDENTIALS" → "API key"
11. **COPY THE API KEY**

## Step 2: Add API Key to Your Project (30 seconds)

1. Open `.env.local` file in your project root
2. Replace `ADD_YOUR_GOOGLE_API_KEY_HERE` with your actual API key
3. Save the file

**Example:**
```
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyDExampleKey123456789
```

## Step 3: Make Your Files Public (2 minutes)

### Photography & AI Albums Folder:

1. Open: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. Click the Share button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

**Important:** Do this for:
- The main folder
- The "Beauty" folder inside it
- The "Professional" folder inside it
- ALL gallery subfolders inside Beauty and Professional

### Loremaker Spreadsheet:

1. Open: https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM
2. Click the Share button (top right)
3. Click "Change to anyone with the link"
4. Set permission to "Viewer"
5. Click "Done"

**Also make sure:** All images linked in the spreadsheet (columns N, O-AC) are also publicly accessible

## Step 4: Restart Dev Server (10 seconds)

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Step 5: Check Console (verify it's working)

1. Open your website in browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. You should see:

```
========================================
📦 LOADING MEDIA FROM GOOGLE DRIVE & SHEETS
========================================

API Key configured: YES ✅
Fetching from Google APIs...

✅ Photography: X galleries
✅ AI Albums: X galleries
✅ Loremaker: X characters
```

## If You See Errors:

### "API Key configured: NO ❌"
- Check .env.local file exists
- Check you replaced the placeholder with your real key
- Restart dev server

### "403 Forbidden" errors
- Folders/sheets are not public
- Go back to Step 3 and make sure EVERYTHING is set to "Anyone with the link"
- Check ALL subfolders

### "0 galleries" but no errors
- Check folder structure:
  - Main folder should have "Beauty" and "Professional" folders
  - Those should have dated subfolders (YYYY-MM-DD Name)
  - Those should have image files

### Images not loading in Loremaker
- Check image URLs in spreadsheet column N
- Make sure those Drive files are also public
- Try opening an image URL in a new browser tab

## That's It!

Once you complete these steps:
- Photography will show your actual photo galleries
- AI Albums will show your AI-generated images
- Loremaker will show your characters from the spreadsheet

All organized and sorted automatically!

---

**Total time: About 5 minutes**

The console will guide you if anything goes wrong!
