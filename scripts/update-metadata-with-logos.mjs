
import fs from 'fs';
import path from 'path';

const TEAM_METADATA_PATH = path.join(process.cwd(), 'app/data/team-metadata.ts');

async function go() {
  console.log('Fetching ESPN data...');
  const res = await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams?limit=1000');
  const data = await res.json();
  const espnTeams = data.sports[0].leagues[0].teams;

  const espnMap = new Map();
  espnTeams.forEach(item => {
    const t = item.team;
    espnMap.set(t.slug.toLowerCase(), t.logos?.[0]?.href);
    espnMap.set(t.displayName.toLowerCase(), t.logos?.[0]?.href);
    espnMap.set(t.shortDisplayName.toLowerCase(), t.logos?.[0]?.href);
    espnMap.set(t.name.toLowerCase(), t.logos?.[0]?.href);
  });

  let metaContent = fs.readFileSync(TEAM_METADATA_PATH, 'utf-8');

  // Manual Map from previous step
  const manualMap = {
    'abilene-christian': 'abilene christian',
    'albany-ny': 'albany',
    'am-corpus-chris': 'texas a&m-corpus christi',
    'cal-st-fullerton': 'cal state fullerton',
    'coastal-caro': 'coastal carolina',
    'col-of-charleston': 'charleston',
    'east-tenn-st': 'etsu',
    'eastern-ky': 'eastern kentucky',
    'eastern-wash': 'eastern washington',
    'fairleigh-dickinson': 'fairleigh dickinson',
    'fla-atlantic': 'fau',
    'george-washington': 'george washington',
    'hartford': 'hartford',
    'hawaii': "hawai'i",
    'jacksonville-st': 'jacksonville state',
    'la-lafayette': 'louisiana',
    'loyola-il': 'loyola chicago',
    'massachusetts': 'umass',
    'middle-tenn': 'middle tennessee',
    'mt-st-marys': "mount st. mary's",
    'nc-at': 'north carolina a&t',
    'neb-omaha': 'omaha',
    'north-carolina-st': 'nc state',
    'north-dakota-st': 'north dakota state',
    'northern-colo': 'northern colorado',
    'northern-ky': 'northern kentucky',
    'northwestern-st': 'northwestern state',
    'pittsburgh': 'pitt',
    'saint-josephs': "saint joseph's",
    'siu-edwardsville': 'siue',
    'south-dakota-st': 'south dakota state',
    'southern-california': 'usc',
    'southern-u': 'southern',
    'st-johns-ny': "st. john's",
    'st-marys-ca': "saint mary's",
    'st-peters': "saint peter's",
    'stephen-f-austin': 'stephen f. austin',
    'texas-am': 'texas a&m',
    'ualr': 'little rock',
    'uc-santa-barbara': 'ucsb',
    'uni': 'northern iowa',
    'western-mich': 'western michigan'
  };

  // Regex to find each line: "key": { ... },
  // We want to insert logo: "url", inside the brackets
  const lines = metaContent.split('\n');
  const newLines = lines.map(line => {
    const match = line.match(/^\s*"([\w-]+)": {(.*)},?$/);
    if (!match) return line;

    const seo = match[1];
    const content = match[2];

    let logo = espnMap.get(seo);
    if (!logo) logo = espnMap.get(seo.replace(/-/g, ' '));
    if (!logo) {
      if (seo.endsWith('-st')) logo = espnMap.get(seo.replace(/-st$/, ' state').replace(/-/g, ' '));
      if (seo === 'unc') logo = espnMap.get('north carolina');
      if (seo === 'miami-fl') logo = espnMap.get('miami');
      if (seo === 'uconn') logo = espnMap.get('connecticut');
      if (manualMap[seo]) logo = espnMap.get(manualMap[seo]);
    }

    if (logo) {
      // Check if logo already exists to avoid dupes if run multiple times
      if (content.includes('logo:')) return line;
      return `  "${seo}": {${content}, logo: "${logo}" },`;
    }
    return line;
  });

  fs.writeFileSync(TEAM_METADATA_PATH, newLines.join('\n'));
  console.log('Updated team-metadata.ts');

  // also update the type definition on line 2
  let updatedContent = fs.readFileSync(TEAM_METADATA_PATH, 'utf-8');
  updatedContent = updatedContent.replace(
    'export const TEAM_METADATA: Record<string, { city: string; state: string; mascot: string; colors: string[] }> = {',
    'export const TEAM_METADATA: Record<string, { city: string; state: string; mascot: string; colors: string[]; logo?: string }> = {'
  );
  fs.writeFileSync(TEAM_METADATA_PATH, updatedContent);
}

go();
