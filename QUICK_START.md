# 🚀 Quick Start - Get Your Site Working in 2 Minutes!

## Current Status

✅ **Working Now:**
- Loremaker Universe (loads from your Google Sheet automatically)
- Films & Music Videos
- Epic Video Edits

❌ **Needs Setup:**
- Photography
- AI Albums

---

## Fix in 2 Minutes

### Step 1: Get Your API Key (1 minute)

1. Open: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** button
3. Select **"API key"**
4. Copy your API key (looks like: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Add API Key to Your Project (30 seconds)

1. Open your project folder: `/home/user/menelek-mothership`
2. Create a file named `.env.local` (if it doesn't exist)
3. Add this line:
   ```
   NEXT_PUBLIC_GOOGLE_API_KEY=YOUR_API_KEY_HERE
   ```
4. Replace `YOUR_API_KEY_HERE` with your actual API key

**Example `.env.local` file:**
```
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Enable Required APIs (30 seconds)

1. Go to: https://console.cloud.google.com/apis/library
2. Search for and enable:
   - **Google Drive API**
   - **Google Sheets API**

### Step 4: Make Your Folders Public (if not already)

1. Open your Drive folder: https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4
2. Click **Share** (top right)
3. Change to **"Anyone with the link can view"**
4. Click **Done**

### Step 5: Restart Your Server

```bash
# Press Ctrl+C to stop the server
# Then run:
npm run dev
```

---

## ✅ Verification

Open http://localhost:3000 and check the browser console (press F12):

**You should see:**
```
========================================
📦 LOADING MEDIA DATA
========================================

🔍 Loremaker: Using GViz (no API key required)
✅ Loremaker: X characters with images

🔍 Photography & AI Albums: Using Drive API

✅ Photography: X galleries
✅ AI Albums: X galleries

✅ Films: X videos
✅ Epic Edits: 4 categories
========================================
```

---

## 🐛 Troubleshooting

### "API KEY MISSING" error
- Make sure `.env.local` file exists in the project root
- Check that the API key starts with `AIzaSy`
- Restart the dev server after creating/editing `.env.local`

### "403 Forbidden" error
- Make sure Drive/Sheets APIs are enabled in Google Cloud Console
- Make sure your Drive folder is set to "Anyone with the link can view"

### "No galleries found"
- Check your folder structure matches:
  ```
  Root Folder (1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4)
  ├── Beauty/
  │   ├── 2024-01-15 Shoot Name/
  │   │   ├── image1.jpg
  │   │   └── image2.jpg
  ├── Professional/
  │   ├── 2024-02-20 Event Name/
  │   │   ├── image1.jpg
  │   │   └── image2.jpg
  └── [Other folders for AI Albums]
  ```

### Images not loading
- Images will try multiple CDN URLs automatically
- Check that individual image files are also set to "Anyone with the link"
- Look for specific errors in browser console (F12)

---

## 📁 Project Structure

```
/home/user/menelek-mothership/
├── .env.local          ← Create this file with your API key
├── lib/
│   ├── googleDriveAPI.js      ← Photography & AI Albums
│   └── googleSheetsGViz.js    ← Loremaker (no API key needed)
└── pages/
    └── index.jsx       ← Homepage
```

---

## 🎯 What's Happening Behind the Scenes

1. **Loremaker**: Uses Google Sheets GViz public endpoint (no auth!)
   - Loads from: `1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM`
   - Only shows characters with images

2. **Photography**: Uses Drive API to scan your folder structure
   - Looks for "Beauty" and "Professional" subfolders
   - Each dated folder (YYYY-MM-DD) becomes a gallery
   - Sorts by date (newest first)

3. **AI Albums**: Uses Drive API to scan your folder structure
   - Every folder (except Beauty/Professional) becomes an album
   - All images in each folder are loaded

4. **ImageSafe**: Tries multiple CDN URLs for each image
   - Primary: `drive.google.com/uc?export=view&id={id}`
   - Fallback 1: `lh3.googleusercontent.com/d/{id}`
   - Fallback 2-4: Thumbnails at various sizes
   - Final fallback: Branded placeholder

---

## 💡 Pro Tips

- **Lazy Loading**: All images use lazy loading automatically
- **Responsive**: Works on mobile, tablet, desktop
- **Fast Updates**: Just add images to Drive folders, refresh page
- **No Rebuilds**: Changes to Drive folders don't require rebuilding

---

## 🆘 Still Having Issues?

Check the browser console (F12) for detailed error messages. The system logs exactly what it's trying to load and what's failing.
