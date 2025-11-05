# Scholarship Data

This directory contains scholarship data used by the scholarship gallery page.

## Updating Scholarship Data

To fetch the latest scholarship data from Google Sheets:

### Prerequisites

1. **Publish the Google Sheet to the web:**
   - Open: https://docs.google.com/spreadsheets/d/1N1kbNjScNxfj48X2HXDFFgSUPxnl22UeJl13O3a16is
   - Go to: `File` → `Share` → `Publish to web`
   - Select: "Entire Document" and "Comma-separated values (.csv)"
   - Click: "Publish"

### Running the Fetch Script

```bash
node scripts/fetch-scholarships.js
```

This will:
- Fetch the latest data from the published Google Sheet
- Parse and normalize the data (clean URLs, format dates, etc.)
- Save it to `data/scholarships.json`
- Show a summary of fetched scholarships

### Manual Data Format

The `scholarships.json` file follows this structure:

```json
[
  {
    "id": "1",
    "name": "Scholarship Name",
    "country": "Country Name(s)",
    "level": "PhD, Masters, etc.",
    "coverage": "Description of financial coverage",
    "deadline": "YYYY-MM-DD or 'Varies'",
    "link": "https://scholarship-website.com"
  }
]
```

### Data Source

- **Spreadsheet ID:** `1N1kbNjScNxfj48X2HXDFFgSUPxnl22UeJl13O3a16is`
- **Columns:** Scholarship Name, Country, Level, Coverage, Deadline, Link

## Notes

- The fetch script automatically cleans tracking parameters from URLs (fbclid, utm_*, etc.)
- Dates are normalized to ISO format (YYYY-MM-DD)
- "Varies" deadlines are preserved as-is
- Countries and levels with slashes are converted to comma-separated lists
