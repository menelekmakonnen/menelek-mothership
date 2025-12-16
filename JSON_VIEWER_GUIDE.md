# JSON Viewer - User Guide

The JSON Viewer is a powerful tool for importing, viewing, and managing JSON data - especially Chrome browser history exports.

## 🎯 Purpose

- **View Chrome History**: Import and search through your Chrome browser history JSON exports
- **Display JSON Data**: View any JSON file with proper formatting
- **Handle Long URLs**: Automatically truncates long URLs and text to prevent layout breaking
- **Search & Filter**: Find specific pages in your history
- **Copy & Export**: Copy URLs or download processed data

---

## 🚀 How to Access

### Method 1: Navigation Bar
1. Look for the **JSON icon** (📄) in the top navigation bar
2. Click it to open the JSON Viewer

### Method 2: Direct URL
Navigate to: `http://localhost:3000/json-viewer` or `yoursite.com/json-viewer`

---

## 📥 Importing Chrome History

### Step 1: Export from Chrome

There are two ways to get your Chrome history as JSON:

#### Option A: Using Chrome's History Export Extension
1. Install a Chrome history export extension from Chrome Web Store
2. Export your history as JSON
3. Save the file

#### Option B: Using Google Takeout
1. Go to [Google Takeout](https://takeout.google.com/)
2. Select "Chrome" data
3. Choose JSON format
4. Download your data archive
5. Extract the `Browser History` JSON file

### Step 2: Import into Viewer

**Option 1 - File Upload:**
1. Click "Upload JSON File" button
2. Select your Chrome history JSON file
3. Data will load automatically

**Option 2 - Paste from Clipboard:**
1. Copy your JSON data to clipboard
2. Click "Paste from Clipboard" button
3. Data will parse and display

---

## 🔍 Using the Viewer

### Chrome History View

When you import Chrome history, you'll see:

#### Stats Bar
- **Total Items**: Number of history entries
- **Filtered**: Items matching current search

#### Search Bar
- Type to search by **title** or **URL**
- Results update in real-time
- Case-insensitive search

#### History Items

Each entry shows:

```
┌─────────────────────────────────────────┐
│ Page Title (truncated to 2 lines)      │ [🔗] [📋]
├─────────────────────────────────────────┤
│ https://example.com/long-url...         │
├─────────────────────────────────────────┤
│ [Date/Time] [Transition Type] [Favicon] │
└─────────────────────────────────────────┘
```

**Icons:**
- 🔗 - Open URL in new tab
- 📋 - Copy URL to clipboard (changes to ✓ when copied)

---

## ✨ Features

### Text Overflow Handling

All long text is handled automatically:

- **Titles**: Truncate after 2 lines with "..."
- **URLs**: Display in code block, truncate if too long
- **Metadata**: Badges truncate individual items

### Metadata Display

Each history entry shows:

1. **Timestamp**: When you visited the page
2. **Page Transition**: How you navigated (LINK, CLIENT_REDIRECT, etc.)
3. **Favicon**: Site icon (if available)

### Actions

**Per Item:**
- Click URL icon to open page
- Click copy icon to copy URL

**Global:**
- Download entire JSON as file
- Clear data to import new file
- Close viewer to return to main site

---

## 🔧 Supported JSON Formats

### Chrome History Format

```json
{
  "Browser History": [
    {
      "title": "Page Title",
      "url": "https://example.com",
      "timestamp_msec": 1765860078742,
      "page_transition": "LINK",
      "favicon_url": "https://example.com/favicon.ico"
    }
  ]
}
```

**Required fields:**
- `Browser History` array
- Each item should have `title` and `url`

**Optional fields:**
- `timestamp_msec` - Show visit time
- `page_transition` - Show navigation type
- `favicon_url` - Show site icon
- `time_usec` - Alternative timestamp format

### Generic JSON

Any valid JSON file will display in a formatted code view:

```json
{
  "key": "value",
  "nested": {
    "data": "here"
  }
}
```

---

## 📱 Mobile Support

The JSON Viewer is fully responsive:

- **Touch-friendly**: Large tap targets
- **Scroll optimization**: Smooth scrolling through large datasets
- **Text wrapping**: All URLs and text wrap properly on small screens

---

## ⚡ Performance

### Large Files

The viewer can handle large JSON files:

- **Items displayed**: Up to 10,000 entries
- **Search**: Filters client-side for instant results
- **Memory**: Efficient rendering prevents browser slowdown

### Optimization Features

1. **Lazy animations**: Only animate visible items
2. **Truncated display**: Long text doesn't render full length
3. **Debounced search**: Search updates smoothly

---

## 🎨 Visual Design

The JSON Viewer uses the same camera-themed design:

- **Glass morphism**: Translucent panels
- **Accent colors**: Green highlights for interactive elements
- **Dark theme**: Easy on the eyes
- **Smooth animations**: Framer Motion transitions

---

## 🐛 Troubleshooting

### "Invalid JSON file" Error

**Problem**: File won't parse

**Solutions:**
1. Ensure file is valid JSON (use [JSONLint](https://jsonlint.com/))
2. Check file encoding (should be UTF-8)
3. Remove any BOM (Byte Order Mark) from file start

### Long URLs Breaking Layout

**Problem**: Text extends beyond container

**Solution**: This is automatically handled! If you still see issues:
1. Check that you're on the latest version
2. Try clearing browser cache
3. Report the specific URL causing issues

### Search Not Working

**Problem**: Search returns no results

**Solutions:**
1. Ensure you're searching for text that exists
2. Check spelling
3. Try partial searches (e.g., "google" instead of "google.com")

### No Data Showing

**Problem**: File uploaded but nothing displays

**Check:**
1. Is the `Browser History` key present?
2. Is the array populated?
3. Open browser console for error messages

---

## 💡 Tips & Tricks

### Quick Search Shortcuts

- Search by **domain**: `youtube.com`
- Search by **date**: `2025-01-16`
- Search by **keyword**: `tutorial`

### Keyboard Shortcuts

- `Ctrl/Cmd + F`: Browser find (searches visible text)
- `Escape`: Close viewer (when on page)

### Data Management

1. **Export filtered results**: Search, then download to save subset
2. **Merge files**: Upload multiple files sequentially
3. **Privacy**: All processing is client-side, no data sent to server

---

## 🔒 Privacy & Security

### Client-Side Processing

- **No uploads to server**: Files processed in your browser
- **No tracking**: No analytics on viewed data
- **No storage**: Data cleared when you close/clear

### Data Handling

1. JSON files stay in browser memory
2. No cookies set
3. No external API calls (except favicon loads)

---

## 🚀 Future Enhancements

Planned features:

- [ ] Export filtered results
- [ ] Date range filtering
- [ ] Visit frequency heatmap
- [ ] Domain statistics
- [ ] Bookmark import support
- [ ] Timeline view
- [ ] Merge multiple history files

---

## 📋 Example Use Cases

### 1. Finding Lost Pages

You remember visiting a site but can't find it:

1. Export Chrome history
2. Import to JSON Viewer
3. Search by keywords
4. Click link to revisit

### 2. Analyzing Browsing Patterns

See where you spend time:

1. Import history
2. Note timestamp patterns
3. Review page transitions
4. Export analysis

### 3. Data Migration

Moving to new browser:

1. Export from Chrome
2. View and verify data
3. Process for import to new browser
4. Download cleaned JSON

---

## 🆘 Getting Help

### Report Issues

If you encounter problems:

1. Note the error message
2. Check browser console (F12)
3. Try with a smaller JSON file
4. Report to developer with:
   - Browser version
   - JSON structure (anonymized)
   - Error messages

### Feature Requests

Have an idea? Suggest:
- Additional metadata to display
- New search/filter options
- Export formats
- Visualization types

---

## 📊 Technical Details

### Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

### Dependencies

- React (UI)
- Framer Motion (animations)
- Lucide React (icons)
- Next.js (routing)

### File Size Limits

- **Recommended**: < 50MB JSON files
- **Maximum**: Limited by browser memory (~500MB)
- **Practical**: 10,000-50,000 entries work smoothly

---

## 🎓 JSON Structure Reference

### Minimal Chrome History Entry

```json
{
  "Browser History": [
    {
      "title": "Example Page",
      "url": "https://example.com"
    }
  ]
}
```

### Full Chrome History Entry

```json
{
  "Browser History": [
    {
      "favicon_url": "https://example.com/favicon.ico",
      "page_transition": "LINK",
      "page_transition_qualifier": "CLIENT_REDIRECT",
      "title": "Example Page - Information",
      "url": "https://example.com/page?query=value",
      "time_usec": 1765860078742007,
      "timestamp_msec": 1765860078742,
      "client_id": "uniqueclientid=="
    }
  ]
}
```

---

## 🎉 Success Stories

The JSON Viewer helps you:

- ✅ Find that article you can't remember
- ✅ Track your research journey
- ✅ Audit your browsing habits
- ✅ Recover lost bookmarks
- ✅ Export and backup history
- ✅ Search years of data instantly

---

**Built with precision. Designed for privacy. Optimized for speed.** 🚀
