/**
 * Fetch Scholarships Data from Google Sheets
 *
 * This script fetches scholarship data from the Google Sheet and saves it to data/scholarships.json
 *
 * Usage:
 *   node scripts/fetch-scholarships.js
 *
 * Requirements:
 *   - Google Sheet must be published to the web (File > Share > Publish to web)
 *   - Select "Comma-separated values (.csv)" option
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Google Sheets ID
const SHEET_ID = '1N1kbNjScNxfj48X2HXDFFgSUPxnl22UeJl13O3a16is';

// CSV export URL (requires sheet to be published to web)
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

// Clean URL by removing tracking parameters
function cleanUrl(url) {
  if (!url) return url;
  try {
    const urlObj = new URL(url);
    // Remove Facebook and other tracking parameters
    urlObj.searchParams.delete('fbclid');
    urlObj.searchParams.delete('utm_source');
    urlObj.searchParams.delete('utm_medium');
    urlObj.searchParams.delete('utm_campaign');
    return urlObj.toString();
  } catch {
    return url;
  }
}

// Parse CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '\t' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Parse date to ISO format
function parseDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('varies')) {
    return 'Varies';
  }

  try {
    // Try parsing common formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.warn(`Could not parse date: ${dateStr}`);
  }

  return dateStr;
}

// Normalize level text
function normalizeLevel(level) {
  if (!level) return '';
  return level
    .replace(/\//g, ', ')
    .split(',')
    .map(l => l.trim())
    .filter(Boolean)
    .join(', ');
}

// Normalize country text
function normalizeCountry(country) {
  if (!country) return '';

  // Handle special cases
  if (country.toLowerCase().includes('any university') ||
      country.toLowerCase().includes('any institution')) {
    return 'International (Any university or research institute)';
  }

  return country
    .replace(/\//g, ', ')
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)
    .join(', ');
}

// Fetch CSV data
function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    console.log('Fetching scholarship data...');
    console.log(`URL: ${url}`);
    console.log('\nNote: If you get a 403 error, you need to publish the sheet to the web:');
    console.log('  1. Open the Google Sheet');
    console.log('  2. Go to File > Share > Publish to web');
    console.log('  3. Select "Entire Document" and "Comma-separated values (.csv)"');
    console.log('  4. Click "Publish"\n');

    https.get(url, (res) => {
      if (res.statusCode === 403) {
        reject(new Error('403 Forbidden - Sheet is not published to the web. See instructions above.'));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Parse CSV to JSON
function csvToJson(csv) {
  const lines = csv.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  // Parse header (using tab-separated values as that's what Google Sheets exports)
  const headers = parseCSVLine(lines[0]);
  console.log('\nDetected columns:', headers);

  const scholarships = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    // Skip empty rows
    if (values.every(v => !v)) continue;

    const scholarship = {
      id: String(i),
      name: values[0] || '',
      country: normalizeCountry(values[1] || ''),
      level: normalizeLevel(values[2] || ''),
      coverage: values[3] || '',
      deadline: parseDate(values[4] || ''),
      link: cleanUrl(values[5] || ''),
    };

    // Only add if we have at least a name and link
    if (scholarship.name && scholarship.link) {
      scholarships.push(scholarship);
    }
  }

  return scholarships;
}

// Main function
async function main() {
  try {
    // Fetch CSV data
    const csv = await fetchCSV(CSV_URL);

    // Parse to JSON
    const scholarships = csvToJson(csv);

    console.log(`\n✓ Successfully parsed ${scholarships.length} scholarships`);

    // Save to file
    const outputPath = path.join(__dirname, '../data/scholarships.json');
    fs.writeFileSync(outputPath, JSON.stringify(scholarships, null, 2), 'utf-8');

    console.log(`✓ Saved to ${outputPath}`);

    // Print summary
    console.log('\nSummary:');
    const countries = new Set(scholarships.flatMap(s => s.country.split(', ')));
    const levels = new Set(scholarships.flatMap(s => s.level.split(', ')));
    console.log(`  - ${scholarships.length} scholarships`);
    console.log(`  - ${countries.size} countries/regions`);
    console.log(`  - ${levels.size} academic levels`);

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run
main();
