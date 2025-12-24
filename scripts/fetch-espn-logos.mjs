
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

  const metaContent = fs.readFileSync(TEAM_METADATA_PATH, 'utf-8');
  const regex = /"([\w-]+)": {/g;
  let match;
  const myTeams = [];
  while ((match = regex.exec(metaContent)) !== null) {
    myTeams.push(match[1]);
  }

  const updates = {};
  const missing = [];
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

  myTeams.forEach(seo => {
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
      updates[seo] = logo;
    } else {
      missing.push(seo);
    }
  });

  console.log(JSON.stringify(updates, null, 2));
  console.log('--- MISSING ---');
  console.log(missing);
}

go();
