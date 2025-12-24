
import fs from 'fs';
import path from 'path';

const TEAM_METADATA_PATH = path.join(process.cwd(), 'app/data/team-metadata.ts');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function go() {
  console.log('Reading metadata...');
  let metaContent = fs.readFileSync(TEAM_METADATA_PATH, 'utf-8');

  // Extract keys and locations
  const regex = /"([\w-]+)":\s*{\s*city:\s*"([^"]+)",\s*state:\s*"([^"]+)"/g;
  let match;
  const teamsToGeocode = [];

  // Reset regex index just in case, though usually fresh
  while ((match = regex.exec(metaContent)) !== null) {
    teamsToGeocode.push({
      seo: match[1],
      city: match[2],
      state: match[3],
      fullMatch: match[0]
    });
  }

  console.log(`Found ${teamsToGeocode.length} teams to geocode.`);

  const updates = new Map(); // seo -> {lat, lng}

  // Process sequentially to be nice to the API
  for (const team of teamsToGeocode) {
    // Check if already has lat/lng to skip re-fetching if re-run
    // Only simpler way is to check the file content line which is hard with regex
    // We'll just check if the line in file already has 'lat:'
    // Actually simpler: iterate and fetch.

    console.log(`Geocoding ${team.city}, ${team.state} (${team.seo})...`);

    try {
      const query = `${team.city}, ${team.state}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'MarchMayhemEducationProject/1.0 (seth.broweleit_dev_test@nomail.com)'
        }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.length > 0) {
        updates.set(team.seo, {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      } else {
        console.warn(`  No results for ${query}`);
      }

    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }

    await sleep(1100); // 1.1s delay for rate limits
  }

  // Rewrite file
  // We go line by line again or use regex replacement
  const lines = metaContent.split('\n');
  const newLines = lines.map(line => {
    const lineMatch = line.match(/^\s*"([\w-]+)": {(.*)},?$/);
    if (!lineMatch) return line;

    const seo = lineMatch[1];
    const content = lineMatch[2];

    const coords = updates.get(seo);
    if (coords && !content.includes('lat:')) {
      return `  "${seo}": {${content}, lat: ${coords.lat}, lng: ${coords.lng} },`;
    }
    return line;
  });

  fs.writeFileSync(TEAM_METADATA_PATH, newLines.join('\n'));
  console.log('Updated team-metadata.ts with coordinates.');

  // Update type definition
  let updatedContent = fs.readFileSync(TEAM_METADATA_PATH, 'utf-8');
  updatedContent = updatedContent.replace(
    'colors: string[]; logo?: string }> = {',
    'colors: string[]; logo?: string; lat?: number; lng?: number }> = {'
  );
  fs.writeFileSync(TEAM_METADATA_PATH, updatedContent);
}

go();
