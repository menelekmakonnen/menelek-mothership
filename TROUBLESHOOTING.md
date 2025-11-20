# Troubleshooting Google API Integration

If your Photography, AI Albums, or Loremaker data is not loading, follow this guide to diagnose and fix the issue.

## Quick Checklist

- [ ] Google API key is created and added to `.env.local`
- [ ] Google Drive folder is set to "Anyone with the link can view"
- [ ] Google Sheets is set to "Anyone with the link can view"
- [ ] Images in Google Sheets are also publicly accessible
- [ ] Development server has been restarted after adding `.env.local`

## Step 1: Check if API Key is Configured

Open your browser console (F12) and look for these messages:

### ✅ Good Signs:
```
Fetching Photography data from Google Drive...
Found category folders: ['Beauty', 'Professional']
Successfully fetched X photography galleries
```

### ❌ Problem Signs:
```
Google API key not configured. Using static data.
Failed to fetch Google Drive folder: 403 Forbidden
Failed to fetch Google Sheet: 401 Unauthorized
```

## Step 2: Verify API Key Setup

1. **Check `.env.local` exists**:
   ```bash
   ls -la .env.local
   ```

2. **Verify API key is set** (in `.env.local`):
   ```
   NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyC...your-actual-key
   ```

3. **Restart development server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

## Step 3: Verify Folder/Sheet Permissions

### For Google Drive (Photography & AI Albums):

1. Go to: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. Click Share button (top right)
3. Under "General access" it should say: **Anyone with the link** - Viewer
4. If it says "Restricted", click "Change" and select "Anyone with the link"

**Also check subfolders:**
- Click into "Beauty" folder → Check sharing settings
- Click into "Professional" folder → Check sharing settings
- Check any AI Album folders

### For Google Sheets (Loremaker):

1. Go to: https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM
2. Click Share button (top right)
3. Under "General access" it should say: **Anyone with the link** - Viewer

**Important:** Images linked in the spreadsheet must ALSO be publicly accessible!

## Step 4: Test API Directly

Open these URLs in your browser (replace `YOUR_API_KEY`):

### Test Drive API:
```
https://www.googleapis.com/drive/v3/files?q='1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4'+in+parents&key=YOUR_API_KEY&fields=files(id,name,mimeType)
```

**Expected result:** JSON with list of folders (Beauty, Professional, etc.)

**If you see an error:**
- 403 Forbidden = Folder is not public
- 401 Unauthorized = API key is invalid
- 404 Not Found = Folder ID is wrong

### Test Sheets API:
```
https://sheets.googleapis.com/v4/spreadsheets/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/values/Characters!A2:AC10?key=YOUR_API_KEY
```

**Expected result:** JSON with character data from rows 2-10

## Step 5: Check Console for Detailed Errors

1. Open your website in Chrome/Firefox
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Click on **Photography** or **AI Albums** or **Loremaker**
5. Look for error messages:

### Common Errors and Solutions:

#### Error: "Failed to fetch Google Drive folder: 403 Forbidden"
**Solution:** Folder is not publicly accessible
- Go to Drive folder → Share → "Anyone with the link"
- Check ALL subfolders (Beauty, Professional, etc.)

#### Error: "Failed to fetch Google Sheet: 401 Unauthorized"
**Solution:** API key is invalid or not configured
- Verify API key in `.env.local`
- Check API key has correct restrictions in Google Cloud Console
- Make sure Drive API and Sheets API are enabled

#### Error: "Could not extract file ID from Drive link: ..."
**Solution:** Image URL format in spreadsheet is incorrect
- Use format: `https://drive.google.com/file/d/FILE_ID/view`
- Or: `https://drive.google.com/open?id=FILE_ID`
- Make sure image files are also publicly accessible

#### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:** This is expected for browser-based requests
- The API calls should work despite CORS warnings
- If blocking requests, the folder might not be public

## Step 6: Verify Folder Structure

Your Google Drive should be organized like this:

```
Mmm Media Albums (1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4)
├── Beauty/                           ← Must be named exactly "Beauty"
│   ├── 2024-01-15 Fashion Shoot/    ← Format: YYYY-MM-DD Name
│   │   ├── IMG001.jpg
│   │   ├── IMG002.jpg
│   │   └── ...
│   └── 2024-02-20 Another Shoot/
│       └── ...
├── Professional/                     ← Must be named exactly "Professional"
│   ├── 2024-03-10 Corporate Event/
│   │   └── ...
│   └── ...
└── AI Fantasy Album/                 ← Any other folder = AI Album
    ├── image1.jpg                    ← Images directly in folder
    └── image2.jpg
```

**Key Points:**
- Beauty and Professional folders must be named EXACTLY that (case-sensitive)
- Photography galleries should be in format: `YYYY-MM-DD Name`
- AI Albums are any other folders at root level (not Beauty/Professional)
- Images should be directly in the leaf folders

## Step 7: Check Network Tab

If data still not loading:

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Filter by "XHR" or "Fetch"
4. Click on Photography/AI Albums/Loremaker
5. Look for requests to `googleapis.com`

**What to check:**
- Status Code: Should be `200 OK`
- If `403`: Permission issue
- If `401`: Authentication issue
- If `404`: Wrong folder/sheet ID
- Preview tab: Should show JSON data

## Step 8: Still Not Working?

### Check Google Cloud Console:

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your API key
5. Verify:
   - **Application restrictions**: None (or HTTP referrers with your domain)
   - **API restrictions**: Google Drive API and Google Sheets API are selected
   - Key is not disabled

### Check API Quotas:

1. In Google Cloud Console
2. Go to **APIs & Services** → **Dashboard**
3. Click on **Google Drive API**
4. Check **Quotas** tab
5. Make sure you haven't exceeded daily limits

## Testing with Static Data

To verify the website works without Google API:

1. Remove or comment out `.env.local`
2. Restart dev server: `npm run dev`
3. The site should load with placeholder data
4. This confirms the issue is with API integration, not the website itself

## Common Mistakes

1. ❌ **Forgetting to restart dev server** after adding `.env.local`
2. ❌ **API key has quotes around it** (should be: `NEXT_PUBLIC_GOOGLE_API_KEY=AIza...` not `"AIza..."`)
3. ❌ **Subfolder not public** (Beauty, Professional must also be shared)
4. ❌ **Images in Sheet not public** (linked images must be publicly accessible)
5. ❌ **Wrong folder name** (must be "Beauty" and "Professional" exactly)
6. ❌ **API restrictions too strict** (should allow Drive API and Sheets API)

## Success Indicators

When everything works correctly, you should see:

**In Console:**
```
Fetching Photography data from Google Drive...
Found category folders: ['Beauty', 'Professional']
Found X galleries in Beauty
Found Y galleries in Professional
Successfully fetched Z photography galleries

Fetching AI Albums data from Google Drive...
Found AI Album folders: ['Album1', 'Album2', ...]
Successfully fetched N AI album galleries

Fetching Loremaker data from Google Sheets...
Found M rows in Loremaker sheet
Successfully parsed M characters
```

**On Website:**
- Photography section shows your actual galleries
- AI Albums section shows your AI-generated albums
- Loremaker shows your characters with images

## Getting Help

If you're still stuck:

1. Check the browser console for error messages
2. Test the API URLs directly in browser
3. Verify all sharing permissions
4. Make sure API key is correctly configured
5. Check the `GOOGLE_API_SETUP.md` file for detailed setup instructions

Remember: The website works fine without the API (using static data). The Google integration is optional but provides dynamic content updates.
