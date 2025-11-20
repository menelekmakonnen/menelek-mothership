# Google Sheets Setup Guide (No API Key Required!)

This portfolio site uses **Google Sheets GViz** to load your media—no API key or authentication needed! Just create public Google Sheets to list your galleries and images.

## ✅ What Works Now

- **Loremaker Universe**: Already configured and working
  - Spreadsheet ID: `1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM`
  - Only shows characters with images
  - Uses multi-variant CDN URLs for reliable loading

## 🔧 What Needs Setup

You need to create two manifest Google Sheets:

1. **Photography Manifest** - Lists all your photography galleries
2. **AI Albums Manifest** - Lists all your AI-generated albums

---

## 📸 Photography Manifest Setup

### Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Photography Manifest"** or similar

### Step 2: Set Up Columns

Create these columns in Row 1 (header row):

| Column A | Column B | Column C | Column D | Column E | Column F | ... |
|----------|----------|----------|----------|----------|----------|-----|
| Category | Date | Gallery Name | Image 1 | Image 2 | Image 3 | ... |

### Step 3: Fill In Your Galleries

Each row represents one gallery:

**Example for Beauty shoot:**
```
Beauty | 2024-01-15 | Sarah Beauty Session | https://drive.google.com/file/d/ABC123/view | https://drive.google.com/file/d/DEF456/view | ...
```

**Example for Professional shoot:**
```
Professional | 2024-02-20 | Corporate Event NYC | https://drive.google.com/file/d/XYZ789/view | https://drive.google.com/file/d/QRS012/view | ...
```

**Column Details:**
- **Category**: Either "Beauty" or "Professional"
- **Date**: Format as YYYY-MM-DD (for proper sorting)
- **Gallery Name**: Display name for the gallery
- **Image columns**: Google Drive links to images (as many columns as you need)

### Step 4: Make It Public

1. Click **Share** button (top right)
2. Change to **"Anyone with the link can view"**
3. Click **Copy link**
4. Extract the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
                                          ^^^^^^^^^^^^^^^^^^^
   ```

### Step 5: Update the Code

Open `lib/googleSheetsGViz.js` and update line 10:

```javascript
const PHOTOGRAPHY_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your ID
```

---

## 🤖 AI Albums Manifest Setup

### Step 1: Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"AI Albums Manifest"** or similar

### Step 2: Set Up Columns

Create these columns in Row 1 (header row):

| Column A | Column B | Column C | Column D | Column E | ... |
|----------|----------|----------|----------|----------|-----|
| Album Name | Description | Image 1 | Image 2 | Image 3 | ... |

### Step 3: Fill In Your Albums

Each row represents one AI album:

**Example:**
```
Cyberpunk Dreams | AI-generated cyberpunk art | https://drive.google.com/file/d/ABC123/view | https://drive.google.com/file/d/DEF456/view | ...
Fantasy Landscapes | AI fantasy scenes | https://drive.google.com/file/d/XYZ789/view | https://drive.google.com/file/d/QRS012/view | ...
```

**Column Details:**
- **Album Name**: Display name for the album
- **Description**: Optional description (can leave blank)
- **Image columns**: Google Drive links to images (as many columns as you need)

### Step 4: Make It Public

1. Click **Share** button (top right)
2. Change to **"Anyone with the link can view"**
3. Click **Copy link**
4. Extract the **Spreadsheet ID** from the URL

### Step 5: Update the Code

Open `lib/googleSheetsGViz.js` and update line 11:

```javascript
const AI_ALBUMS_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your ID
```

---

## 📂 Getting Google Drive Image Links

You have a few options for getting image links:

### Option 1: Individual File Links

1. Right-click image in Google Drive
2. Select **Get link**
3. Make sure it's set to **"Anyone with the link can view"**
4. Copy the link (format: `https://drive.google.com/file/d/FILE_ID/view`)

### Option 2: Bulk Export (Recommended for many images)

Since your images are in organized folders, you can:

1. Open your folder: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. For each gallery folder (e.g., "2024-01-15 Sarah Beauty Session"):
   - Open the folder
   - For each image, right-click → Get link
   - Paste into your spreadsheet

### Option 3: Use Google Apps Script (Advanced)

Create a script to auto-generate the manifest from your folder structure. [See example script here](#google-apps-script-helper)

---

## 🔄 Image URL Formats Supported

The system automatically handles multiple Drive URL formats:

✅ `https://drive.google.com/file/d/{id}/view`
✅ `https://drive.google.com/open?id={id}`
✅ `https://drive.google.com/uc?id={id}`
✅ `https://drive.google.com/thumbnail?id={id}`

And automatically generates multiple CDN variants:
- `drive.google.com/uc?export=view&id={id}`
- `lh3.googleusercontent.com/d/{id}` (CDN)
- Multiple thumbnail sizes (w1000, w800, w600)

---

## 🚀 After Setup

1. Save your changes to `lib/googleSheetsGViz.js`
2. Restart your dev server (`npm run dev`)
3. Open http://localhost:3000
4. Navigate to Photography or AI Albums

You should see your galleries loaded!

---

## 🐛 Troubleshooting

### "No manifest sheet configured" warning

**Fix:** Make sure you updated `PHOTOGRAPHY_SPREADSHEET_ID` or `AI_ALBUMS_SPREADSHEET_ID` in `lib/googleSheetsGViz.js`

### "Could not access manifest sheet"

**Fix:** Make sure your sheet is set to **"Anyone with the link can view"**

### Images not loading

**Fix:**
1. Make sure each image file is set to **"Anyone with the link can view"**
2. Check browser console (F12) for specific error messages
3. The system tries multiple CDN URLs automatically

### Wrong sheet name error

The system tries these tab names automatically:
- For Photography: "Photography", "Galleries", "Sheet1"
- For AI Albums: "AI Albums", "Albums", "Sheet1"

Make sure your tab is named one of these, or add your tab name to the code.

---

## 📊 Example Spreadsheet Templates

### Photography Template

| Category | Date | Gallery Name | Image 1 | Image 2 | Image 3 |
|----------|------|--------------|---------|---------|---------|
| Beauty | 2024-01-15 | Sarah Beauty Session | https://drive.google.com/file/d/1a2b3c4d5e/view | https://drive.google.com/file/d/6f7g8h9i0j/view | ... |
| Professional | 2024-02-01 | NYC Corporate Event | https://drive.google.com/file/d/k1l2m3n4o/view | https://drive.google.com/file/d/5p6q7r8s9t/view | ... |

### AI Albums Template

| Album Name | Description | Image 1 | Image 2 | Image 3 |
|------------|-------------|---------|---------|---------|
| Cyberpunk Dreams | AI-generated cyberpunk art | https://drive.google.com/file/d/1a2b3c4d5e/view | https://drive.google.com/file/d/6f7g8h9i0j/view | ... |
| Fantasy Landscapes | AI fantasy world scenes | https://drive.google.com/file/d/k1l2m3n4o/view | https://drive.google.com/file/d/5p6q7r8s9t/view | ... |

---

## 🎯 Benefits of This Approach

✅ **No API key required** - Uses public GViz endpoint
✅ **No authentication** - Just make sheets public
✅ **No quotas** - GViz has very generous limits
✅ **Easy updates** - Just edit the spreadsheet
✅ **Automatic retries** - Multiple CDN URLs tried automatically
✅ **Graceful fallbacks** - Shows placeholder if images fail

---

## 🔐 Google Apps Script Helper

Want to auto-generate manifests from your folder structure? Here's a script:

```javascript
function generatePhotographyManifest() {
  const ROOT_FOLDER_ID = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';
  const rootFolder = DriveApp.getFolderById(ROOT_FOLDER_ID);

  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();

  // Header row
  sheet.appendRow(['Category', 'Date', 'Gallery Name', 'Image 1', 'Image 2', 'Image 3', 'Image 4', 'Image 5', 'Image 6', 'Image 7', 'Image 8', 'Image 9', 'Image 10']);

  // Process Beauty and Professional folders
  const categories = ['Beauty', 'Professional'];

  categories.forEach(category => {
    const categoryFolders = rootFolder.getFoldersByName(category);
    if (categoryFolders.hasNext()) {
      const categoryFolder = categoryFolders.next();
      const galleryFolders = categoryFolder.getFolders();

      while (galleryFolders.hasNext()) {
        const galleryFolder = galleryFolders.next();
        const galleryName = galleryFolder.getName();

        // Extract date (YYYY-MM-DD) from folder name
        const dateMatch = galleryName.match(/^(\d{4}-\d{2}-\d{2})/);
        const date = dateMatch ? dateMatch[1] : '';
        const name = galleryName.replace(/^\d{4}-\d{2}-\d{2}\s*/, '');

        // Get image files
        const files = galleryFolder.getFiles();
        const row = [category, date, name];

        while (files.hasNext()) {
          const file = files.next();
          if (file.getMimeType().startsWith('image/')) {
            row.push(file.getUrl());
          }
        }

        if (row.length > 3) { // Has images
          sheet.appendRow(row);
        }
      }
    }
  });

  Logger.log('Manifest generated!');
}
```

To use:
1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. Paste the code above
4. Update `ROOT_FOLDER_ID` with your folder ID
5. Click **Run** (you'll need to authorize once)
6. Your manifest will be auto-populated!

---

## 📞 Need Help?

Check the browser console (F12) for detailed logging about what's loading and what's failing.
