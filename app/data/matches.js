import teams from "./teams";
const matches = [
  { region: 1, matchup: 1, tt: teams.r1_s01, tb: teams.r1_s16, updates: [33,'tt']  },
  { region: 1, matchup: 2, tt: teams.r1_s08, tb: teams.r1_s09, updates: [33,'tb']  },
  { region: 1, matchup: 3, tt: teams.r1_s05, tb: teams.r1_s12, updates: [34,'tt'] },
  { region: 1, matchup: 4, tt: teams.r1_s04, tb: teams.r1_s13, updates: [34,'tb'] },
  { region: 1, matchup: 5, tt: teams.r1_s06, tb: teams.r1_s11, updates: [35,'tt'] },
  { region: 1, matchup: 6, tt: teams.r1_s03, tb: teams.r1_s14, updates: [35,'tb'] },
  { region: 1, matchup: 7, tt: teams.r1_s07, tb: teams.r1_s10, updates: [36,'tt'] },
  { region: 1, matchup: 8, tt: teams.r1_s02, tb: teams.r1_s15, updates: [36,'tb'] },
  {region: 1,matchup: 33,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [49,'tt']},
  {region: 1,matchup: 34,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [49,'tb']},
  {region: 1,matchup: 35,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [50,'tt']},
  {region: 1,matchup: 36,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [50,'tb']},
  {region: 1,matchup: 49,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [57,'tt']},
  {region: 1,matchup: 50,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [57,'tb']},
  {region: 1,matchup: 57,tt: { seed: null, name: "" },tb: { seed: null, name: "" }},

  { region: 2, matchup: 9, tt: teams.r2_s01, tb: teams.r2_s16 , updates: [37,'tt']},
  { region: 2, matchup: 10, tt: teams.r2_s08, tb: teams.r2_s09, updates: [37,'tb'] },
  { region: 2, matchup: 11, tt: teams.r2_s05, tb: teams.r2_s12, updates: [38,'tt'] },
  { region: 2, matchup: 12, tt: teams.r2_s04, tb: teams.r2_s13, updates: [38,'tb'] },
  { region: 2, matchup: 13, tt: teams.r2_s06, tb: teams.r2_s11, updates: [39,'tt'] },
  { region: 2, matchup: 14, tt: teams.r2_s03, tb: teams.r2_s14, updates: [39,'tb'] },
  { region: 2, matchup: 15, tt: teams.r2_s07, tb: teams.r2_s10, updates: [40,'tt'] },
  { region: 2, matchup: 16, tt: teams.r2_s02, tb: teams.r2_s15, updates: [40,'tb'] },
  {region: 2,matchup: 37,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [51,'tt']},
  {region: 2,matchup: 38,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [51,'tb']},
  {region: 2,matchup: 39,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [52,'tt']},
  {region: 2,matchup: 40,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [52,'tb']},
  {region: 2,matchup: 51,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [58,'tt']},
  {region: 2,matchup: 52,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [58,'tb']},
  {region: 2,matchup: 58,tt: { seed: null, name: "" },tb: { seed: null, name: "" }},

  { region: 3, matchup: 17, tt: teams.r3_s01, tb: teams.r3_s16, updates: [41,'tt'] },
  { region: 3, matchup: 18, tt: teams.r3_s08, tb: teams.r3_s09, updates: [41,'tb'] },
  { region: 3, matchup: 19, tt: teams.r3_s05, tb: teams.r3_s12, updates: [42,'tt'] },
  { region: 3, matchup: 20, tt: teams.r3_s04, tb: teams.r3_s13, updates: [42,'tb'] },
  { region: 3, matchup: 21, tt: teams.r3_s06, tb: teams.r3_s11, updates: [43,'tt'] },
  { region: 3, matchup: 22, tt: teams.r3_s03, tb: teams.r3_s14, updates: [43,'tb'] },
  { region: 3, matchup: 23, tt: teams.r3_s07, tb: teams.r3_s10, updates: [44,'tt'] },
  { region: 3, matchup: 24, tt: teams.r3_s02, tb: teams.r3_s15, updates: [44,'tb'] },
  {region: 3,matchup: 41,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [53,'tt']},
  {region: 3,matchup: 42,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [53,'tb']},
  {region: 3,matchup: 43,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [54,'tt']},
  {region: 3,matchup: 44,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [54,'tb']},
  {region: 3,matchup: 53,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [59,'tt']},
  {region: 3,matchup: 54,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [59,'tb']},
  {region: 3,matchup: 59,tt: { seed: null, name: "" },tb: { seed: null, name: "" }},

  { region: 4, matchup: 25, tt: teams.r4_s01, tb: teams.r4_s16, updates: [45,'tt'] },
  { region: 4, matchup: 26, tt: teams.r4_s08, tb: teams.r4_s09, updates: [45,'tb'] },
  { region: 4, matchup: 27, tt: teams.r4_s05, tb: teams.r4_s12, updates: [46,'tt'] },
  { region: 4, matchup: 28, tt: teams.r4_s04, tb: teams.r4_s13, updates: [46,'tb'] },
  { region: 4, matchup: 29, tt: teams.r4_s06, tb: teams.r4_s11, updates: [47,'tt'] },
  { region: 4, matchup: 30, tt: teams.r4_s03, tb: teams.r4_s14, updates: [47,'tb'] },
  { region: 4, matchup: 31, tt: teams.r4_s07, tb: teams.r4_s10, updates: [48,'tt'] },
  { region: 4, matchup: 32, tt: teams.r4_s02, tb: teams.r4_s15, updates: [48,'tb'] },
  {region: 4,matchup: 45,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [55,'tt']},
  {region: 4,matchup: 46,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [55,'tb']},
  {region: 4,matchup: 47,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [56,'tt']},
  {region: 4,matchup: 48,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [56,'tb']},
  {region: 4,matchup: 55,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [60,'tt']},
  {region: 4,matchup: 56,tt: { seed: null, name: "" },tb: { seed: null, name: "" }, updates: [60,'tb']},
  {region: 4,matchup: 60,tt: { seed: null, name: "" },tb: { seed: null, name: "" }},
];

export default matches;
