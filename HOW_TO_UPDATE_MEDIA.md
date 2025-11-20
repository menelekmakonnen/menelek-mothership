# How to Update Your Media Content

## No API Setup Required! 🎉

All media is stored in simple JavaScript files that you can edit directly. No Google API, no authentication, no complex setup!

## Adding Your Content

### 📸 Photography Galleries

**File:** `lib/photographyData.js`

```javascript
{
  id: 'unique-id-here',
  name: 'Your Gallery Name',
  description: 'Beauty - Your Gallery Name',
  category: 'Beauty', // or 'Professional'
  date: '2024-03-15', // YYYY-MM-DD format for sorting
  coverUrl: 'https://your-image-url.com/cover.jpg',
  items: [
    {
      id: 'img-1',
      name: 'Photo Description',
      url: 'https://your-image-url.com/photo.jpg',
      thumbnailUrl: 'https://your-image-url.com/thumbnail.jpg',
      type: 'image',
      index: 0,
    },
    // Add more images...
  ],
}
```

### 🤖 AI Albums

**File:** `lib/aiAlbumsData.js`

```javascript
{
  id: 'ai-album-id',
  name: 'Album Name',
  description: 'AI-generated album: Album Name',
  coverUrl: 'https://your-image-url.com/cover.jpg',
  items: [
    {
      id: 'ai-img-1',
      name: 'Image Name',
      url: 'https://your-image-url.com/image.jpg',
      thumbnailUrl: 'https://your-image-url.com/thumbnail.jpg',
      type: 'image',
      index: 0,
    },
    // Add more images...
  ],
}
```

### 📚 Loremaker Characters

**File:** `lib/loremakerData.js`

```javascript
{
  id: 'character-id',
  character: 'Character Name',
  alias: 'The Cool Nickname',
  gender: 'Male/Female/Other',
  alignment: 'Lawful Good/Chaotic Evil/etc.',
  location: 'Where they live',
  powers: 'What they can do',
  faction: 'Their group/team',
  era: 'Time period',
  status: 'Active/Inactive/etc.',
  description: 'Short description',
  longDescription: 'Detailed backstory',
  stories: 'Which stories they appear in',
  url: 'https://your-image-url.com/character.jpg',
  coverUrl: 'https://your-image-url.com/character.jpg',
  thumbnailUrl: 'https://your-image-url.com/character.jpg',
  galleryImages: [
    'https://your-image-url.com/image1.jpg',
    'https://your-image-url.com/image2.jpg',
  ],
  type: 'character',
}
```

## Where to Host Your Images

You can use any of these services:

1. **Imgur** (Free, easy)
   - Upload image → Right click → Copy image address
   - Use direct link (ends with .jpg, .png, etc.)

2. **Google Drive** (Public links)
   - Upload file → Share → "Anyone with link" → Viewer
   - Get link: `https://drive.google.com/uc?export=view&id=FILE_ID`
   - Extract FILE_ID from share link

3. **GitHub** (If hosting on GitHub Pages)
   - Store in `public/images/` folder
   - Use: `/images/your-image.jpg`

4. **CDN Services** (Cloudinary, ImageKit, etc.)
   - Professional option for large collections

## Quick Start Examples

### Replace Placeholder Images

All data files currently use placeholder images. Replace them with your actual image URLs:

**Before:**
```javascript
coverUrl: 'https://via.placeholder.com/600x800/6B46C1/ffffff?text=Fashion+Editorial',
```

**After:**
```javascript
coverUrl: 'https://i.imgur.com/abc123.jpg',
```

### Add a New Photography Gallery

1. Open `lib/photographyData.js`
2. Copy an existing gallery object
3. Update the values:
   - Change `id` to something unique
   - Update `name` and `description`
   - Replace `coverUrl` with your image
   - Add your photos to `items` array
4. Save the file
5. Refresh your browser - changes appear instantly!

### Add a New Character

1. Open `lib/loremakerData.js`
2. Copy an existing character object
3. Update all the fields with your character's info
4. Replace image URLs
5. Save and refresh!

## File Structure

```
lib/
├── photographyData.js    ← Edit this for Photography
├── aiAlbumsData.js       ← Edit this for AI Albums
├── loremakerData.js      ← Edit this for Loremaker
└── realMediaData.js      ← Films & Epic Edits (already configured)
```

## Tips

### Image Sizes

- **Photography/AI Albums**: Landscape (16:9) or Portrait (3:4)
- **Loremaker Characters**: Portrait (2:3 or 3:4)
- **Thumbnails**: Smaller versions of the same image

### IDs

- Must be unique within each data file
- Use lowercase with hyphens: `my-gallery-name`
- Can use numbers: `gallery-1`, `gallery-2`

### Dates (Photography only)

- Format: `YYYY-MM-DD` (e.g., `2024-03-15`)
- Used for sorting (newest first)
- Optional - leave as `null` if you don't want date sorting

### Order

- Items appear in the order you add them to the array
- First item in array = First to display
- Photography galleries are sorted by date automatically

## Testing Your Changes

1. Edit the data file
2. Save the file
3. If dev server is running: Browser auto-refreshes
4. If not running: Start with `npm run dev`
5. Click on the section to see your new content!

## Console Messages

When the page loads, check the browser console (F12):

```
========================================
📦 LOADING MEDIA DATA
========================================

✅ Films: 6 videos loaded
✅ Epic Edits: 4 categories loaded
✅ Photography: 3 galleries loaded
✅ AI Albums: 3 galleries loaded
✅ Loremaker: 5 characters loaded

📝 To update media:
- Photography: Edit lib/photographyData.js
- AI Albums: Edit lib/aiAlbumsData.js
- Loremaker: Edit lib/loremakerData.js
========================================
```

This confirms all your content is loading!

## Common Issues

### Images not showing
- Check the URL is direct (ends with .jpg, .png, etc.)
- Make sure the link is public/accessible
- Try opening the URL in a new browser tab

### Gallery not appearing
- Check the ID is unique
- Make sure the object is inside the array `[]`
- Check for missing commas between objects

### Syntax errors
- Each object needs commas between properties
- Strings must be in quotes: `'like this'`
- URLs must be in quotes
- Last item in array shouldn't have a trailing comma

## Need Help?

1. Check the existing examples in the data files
2. Make sure your syntax matches the examples exactly
3. Look at browser console for error messages
4. Try copying an existing object and modifying it

---

**No API setup. No authentication. Just edit files and go!** 🚀
