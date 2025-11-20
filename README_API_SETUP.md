# ⚠️ IMPORTANT: Google API Setup Required

## Current Status

Your website is **ALMOST READY** but shows "Loading Albums..." because the Google API key needs to be configured.

### What's Working ✅
- ✅ Boot screen (animated, shows once per day)
- ✅ Power off screen (with social media links, once per day)
- ✅ Camera HUD with histogram, battery, toggles
- ✅ Films & Music Videos section
- ✅ Epic Video Edits section
- ✅ Dynamic animated favicon
- ✅ All UI components and animations

### What Needs Setup ❌
- ❌ Photography section (needs Google API key)
- ❌ AI Albums section (needs Google API key)
- ❌ Loremaker Universe section (needs Google API key)

## Quick Fix (5 Minutes)

### Step 1: Get Google API Key

1. Go to https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable these APIs:
   - Google Drive API
   - Google Sheets API
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key

### Step 2: Configure API Key

1. Open `.env.local` file in your project root
2. Find this line:
   ```
   NEXT_PUBLIC_GOOGLE_API_KEY=REPLACE_WITH_YOUR_ACTUAL_API_KEY
   ```
3. Replace `REPLACE_WITH_YOUR_ACTUAL_API_KEY` with your actual API key
4. Save the file

### Step 3: Make Files Public

Your media is already uploaded but needs to be publicly accessible:

**Google Drive Folder:**
1. Open: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. Click Share button
3. Change to "Anyone with the link" → Viewer
4. Do this for ALL subfolders:
   - Beauty folder
   - Professional folder
   - All gallery folders inside them
   - All AI album folders

**Google Sheets:**
1. Open: https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM
2. Click Share button
3. Change to "Anyone with the link" → Viewer

**Image Files in Sheets:**
- All image URLs in column N (Cover Image) must also be public
- All gallery images (columns O-AC) must be public

### Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Step 5: Check Console

Open browser console (F12) and you should see:

```
========================================
🔍 GOOGLE API INTEGRATION STATUS
========================================
API Key present: YES
API Key value: AIzaSyC...
API Key valid: YES ✅
✅ Fetching data from Google APIs...

Fetching folder: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
✅ Found 3 items in folder...
Found category folders: ['Beauty', 'Professional']
✅ Photography: 12 galleries loaded
✅ AI Albums: 3 galleries loaded
✅ Loremaker: 8 characters loaded
```

## If Still Not Working

### Check Console Errors

Common issues and solutions:

**403 Forbidden:**
- Folder/sheet is not public
- Go to Drive/Sheets and set to "Anyone with the link"

**401 Unauthorized:**
- API key is invalid
- Generate a new API key
- Make sure it's enabled for Drive & Sheets APIs

**0 galleries loaded (but no errors):**
- Check folder structure matches documentation
- Folders must be named exactly "Beauty" and "Professional"
- Check subfolders contain images

**Images not showing in Loremaker:**
- Image URLs in spreadsheet must be publicly accessible
- Check console for "Could not extract file ID" errors
- Make sure image files are also set to public

## Testing Your Setup

Run these URLs in browser (replace YOUR_API_KEY):

**Test Drive API:**
```
https://www.googleapis.com/drive/v3/files?q='1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4'+in+parents&key=YOUR_API_KEY&fields=files(id,name)
```

**Test Sheets API:**
```
https://sheets.googleapis.com/v4/spreadsheets/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/values/Characters!A2:B10?key=YOUR_API_KEY
```

If these return JSON = ✅ Working!
If these return errors = ❌ Need to fix permissions/API key

## New Features Added

### Power Management
- **Boot Screen**: Shows animated boot sequence on first visit each day
- **Power Off Screen**: Shows with social media links once per day
- **Memory Saving**: All camera settings preserved between sessions
- **Social Media**: LinkedIn, Twitter, Instagram, GitHub, Email buttons

### Social Links (Update These!)
Currently set to:
- LinkedIn: /in/menelekmakonnen
- Twitter: @menelekmakonnen
- Instagram: @menelekmakonnen
- GitHub: /menelekmakonnen
- Email: contact@menelekmakonnen.com

Update in: `components/camera/PowerOffScreen.jsx`

## Documentation Files

- **GOOGLE_API_SETUP.md** - Complete setup guide
- **TROUBLESHOOTING.md** - Detailed troubleshooting
- **TEST_API.md** - Testing and validation guide

## Support

If you're stuck:
1. Check browser console for detailed error messages
2. Follow the error instructions (they tell you exactly what to fix)
3. Verify all folders/sheets are public
4. Test API directly with URLs above
5. Check documentation files for detailed help

The console will guide you through any issues!
