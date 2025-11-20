# Testing Google API Integration

## Quick Test - Open Browser Console

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the website in browser** (usually http://localhost:3000)

3. **Open Developer Tools** (Press F12 or Ctrl+Shift+I)

4. **Go to Console tab**

5. **Look for these messages when page loads:**

### ✅ SUCCESS - API Key Configured:
```
API Key configured: YES
✅ Fetching data from Google APIs...
Fetching folder: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
✅ Found 3 items in folder 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
Found category folders: ['Beauty', 'Professional']
Fetching folder: [Beauty folder ID]
✅ Found 5 items in folder [Beauty folder ID]
Found 5 galleries in Beauty
...
✅ Photography: 12 galleries loaded
✅ AI Albums: 3 galleries loaded
✅ Loremaker: 8 characters loaded
```

### ❌ ERROR - No API Key:
```
API Key configured: NO
❌ GOOGLE API KEY NOT CONFIGURED!
Create .env.local file and add: NEXT_PUBLIC_GOOGLE_API_KEY=your_key_here
```

**Fix:** Create `.env.local` file with your API key

### ❌ ERROR - Folder Not Public (403):
```
API Key configured: YES
✅ Fetching data from Google APIs...
Fetching folder: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
❌ Drive API Error (403): [error details]
Folder ID: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
💡 Fix: Make sure the folder is set to "Anyone with the link can view"
```

**Fix:**
1. Open folder: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. Click Share button
3. Change to "Anyone with the link"
4. Permission: Viewer
5. Click Done
6. Repeat for Beauty and Professional subfolders

### ❌ ERROR - Bad API Key (401):
```
❌ Drive API Error (401): [error details]
💡 Fix: Check your API key in .env.local
```

**Fix:**
1. Verify API key in `.env.local` is correct
2. Check no extra spaces or quotes
3. Verify Drive API is enabled in Google Cloud Console
4. Try generating a new API key

## Test API Directly in Browser

Replace `YOUR_API_KEY` with your actual API key:

### Test 1: Root Folder
```
https://www.googleapis.com/drive/v3/files?q='1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4'+in+parents&key=YOUR_API_KEY&fields=files(id,name,mimeType)
```

**Expected:** JSON with Beauty and Professional folders

### Test 2: Loremaker Sheet
```
https://sheets.googleapis.com/v4/spreadsheets/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/values/Characters!A2:AC10?key=YOUR_API_KEY
```

**Expected:** JSON with character data

## Navigate to Sections and Check Console

### Photography:
1. Click "Photography" on homepage
2. Check console for:
   ```
   Fetching Photography data from Google Drive...
   Found category folders: ['Beauty', 'Professional']
   Successfully fetched X photography galleries
   ✅ Photography: X galleries loaded
   ```

### AI Albums:
1. Click "AI Albums" on homepage
2. Check console for:
   ```
   Fetching AI Albums data from Google Drive...
   Found AI Album folders: [...]
   ✅ AI Albums: X galleries loaded
   ```

### Loremaker:
1. Click "Loremaker Universe" on homepage
2. Check console for:
   ```
   Fetching Loremaker data from Google Sheets...
   Fetching sheet: 1nbAsU... range: Characters!A2:AC1000
   ✅ Found X rows in sheet
   Successfully parsed X characters
   ✅ Loremaker: X characters loaded
   ```

## Common Issues

### "0 galleries loaded" but no errors
- Folder structure might be wrong
- Check folder names are exactly "Beauty" and "Professional"
- Check subfolders exist with images

### Images not loading in Loremaker
- Check image links in spreadsheet column N (Cover Image)
- Make sure those images are also publicly accessible
- Check console for "Could not extract file ID from Drive link"
- Verify image URL format: `https://drive.google.com/file/d/FILE_ID/view`

### Network errors
- Check internet connection
- Try disabling browser extensions (especially ad blockers)
- Try a different browser

## Verification Checklist

- [ ] `.env.local` file exists with `NEXT_PUBLIC_GOOGLE_API_KEY=...`
- [ ] Restarted dev server after creating `.env.local`
- [ ] Root folder (1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4) is public
- [ ] "Beauty" folder inside root is public
- [ ] "Professional" folder inside root is public
- [ ] All subfolders inside Beauty/Professional are public
- [ ] Loremaker spreadsheet (1nbAsU...) is public
- [ ] Images linked in Loremaker spreadsheet are public
- [ ] Google Drive API is enabled in Cloud Console
- [ ] Google Sheets API is enabled in Cloud Console
- [ ] API key has correct restrictions (Drive + Sheets only)

## Success Indicators

When everything works:
- Console shows "API Key configured: YES"
- Console shows gallery/character counts
- Photography page shows your actual photo galleries
- AI Albums page shows your AI-generated albums
- Loremaker page shows your characters with images
- No red error messages in console

## Still Not Working?

1. Copy ALL console output and check for errors
2. Test the API URLs directly in browser
3. Verify every folder/file is set to public
4. Double-check API key has no typos
5. Make sure you restarted the dev server
6. Clear browser cache (Ctrl+Shift+Del)

Remember: Console logging now shows EXACTLY what's happening with the API calls. Use it to diagnose issues!
