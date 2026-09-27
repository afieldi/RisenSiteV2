// Edit league info here. Values marked "placeholder" still need real numbers.
export const DISCORD_URL = 'https://discord.gg/risen'; // placeholder
export const STATS_URL = 'https://www.risenstats.com/';

export const TIERS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'] as const;

export interface FormatSummary {
  name: string;
  ranks: string;
  format: string;
  nights: string;
  fee: string;
  pool: string;
  season: string;
}

export interface Division {
  name: string;
  capType: 'Points cap' | 'Hard cap' | 'Soft cap';
  cap: string;
  note: string;
  when: string;
  fee: string;
  pool: string;
  /** Fall split key dates, [label, date] */
  schedule: Pair[];
}

/** [label, value] */
export type Pair = [string, string];
/** [league, cap / ranks, match night, entry] */
export type CompareRow = [string, string, string, string];

interface FormatBase {
  name: string;
  title: string;
  kicker: string;
  nights: string;
  desc: string;
  ranks: string;
  /** [lowest tier index, highest tier index] into TIERS */
  range: [number, number];
  rankNote: string;
  facts: Pair[];
  steps: string[];
}

/** A format either has divisions (shown as cards, one compare row and one schedule each) or a single schedule and explicit compare rows. */
export type Format = FormatBase & (
  | { divs: Division[]; divTitle: string; divNote: string; compare?: never; schedule?: never }
  | { divs: []; compare: CompareRow[]; schedule: Pair[]; divTitle?: never; divNote?: never }
);

// Home page summary rows (one per format)
export const FORMAT_SUMMARY: FormatSummary[] = [
  { name: 'Draft League', ranks: 'Gold – Master 250 LP', format: 'Solo sign-up · drafted by captains', nights: 'Fridays · 8 PM ET', fee: '$10 / player', pool: '$500', season: 'Oct 9 – Dec 18' },
  { name: 'Teambuilder', ranks: 'Iron – Master 700 LP', format: 'Full team · four points-capped divisions', nights: 'Mon & Tue · 8:30 PM ET', fee: '$25 / team', pool: '$1,600', season: 'Oct 5 – Dec 22' },
  { name: 'Premade', ranks: 'Emerald 4 – Master 250 LP caps', format: 'Four rank-capped leagues · 200+ ranked games', nights: 'Thu · Sat · Sun', fee: 'From $50 / team', pool: 'Up to $2,500', season: 'Oct 8 – Dec 19' },
  { name: 'Franchise', ranks: 'Emerald – M/GM 800 LP', format: 'GMs draft and manage a team of 5', nights: 'Wednesdays · 8:30 PM ET', fee: '$15 / player', pool: '$1,200', season: 'Oct 7 – Dec 16' },
];

// Leagues page. range = [lowest tier index, highest tier index] into TIERS.
export const FORMATS: Format[] = [
  {
    name: 'Draft', title: 'Draft League', kicker: 'Most casual', nights: 'Fridays',
    desc: "Draft League is Risen's most casual league. Players sign up solo and are drafted onto teams by captains.",
    ranks: 'Gold – Master 250 LP', range: [3, 7],
    rankNote: 'No ranked game requirement. Accounts must be level 100.',
    facts: [['Match night', 'Fridays · 8 PM ET'], ['Eligible ranks', 'Gold – Master 250 LP'], ['Sign up', 'Solo'], ['Requirements', 'Level 100 account'], ['Entry fee', '$10 / player'], ['Prize pool', '$500']],
    steps: ['Sign up solo in the Discord.', 'Captains draft players onto teams.', 'Play your matches Fridays at 8 PM ET.'],
    schedule: [['Sign-ups close', 'Oct 2'], ['Captains draft', 'Oct 6'], ['Regular season', 'Oct 9'], ['Playoffs', 'Dec 4'], ['Grand final', 'Dec 18']],
    divs: [],
    compare: [['Draft League', 'Gold – Master 250 LP', 'Fri · 8 PM', '$10 / player']],
  },
  {
    name: 'Teambuilder', title: 'Teambuilder', kicker: 'Points-based', nights: 'Mon & Tue',
    desc: 'Teambuilder allows you to sign up with a full team, with a points-based system and different divisions that allow some flexibility for groups with mismatched ranks.',
    ranks: 'Iron – Master 700 LP', range: [0, 7],
    rankNote: 'No ranked game requirement. Accounts must be level 100. Each player is worth points based on rank; your roster must fit under the division cap.',
    facts: [['Match nights', 'Mon & Tue · 8:30 PM ET'], ['Eligible ranks', 'Iron – Master 700 LP'], ['Sign up', 'Full team'], ['Requirements', 'Level 100 account'], ['Entry fee', '$25 / team'], ['Prize pool', '$400 / division']],
    divTitle: 'Four divisions', divNote: 'Pick the division whose points cap fits your roster.',
    steps: ['Build a roster and add up your players’ points.', 'Register in the division that fits your total.', 'Play Mondays or Tuesdays at 8:30 PM ET.'],
    divs: [
      { name: 'Doran’s', capType: 'Points cap', cap: '14 points', note: 'Low Platinum average', when: 'Mondays · 8:30 PM', fee: '$25 / team', pool: '$300',
        schedule: [['Registration closes', 'Sep 28'], ['Regular season', 'Oct 5'], ['Playoffs', 'Nov 30'], ['Grand final', 'Dec 14']] },
      { name: 'Bami’s', capType: 'Points cap', cap: '20 points', note: 'Mid-Emerald average', when: 'Tuesdays · 8:30 PM', fee: '$25 / team', pool: '$400',
        schedule: [['Registration closes', 'Sep 29'], ['Regular season', 'Oct 6'], ['Playoffs', 'Dec 1'], ['Grand final', 'Dec 15']] },
      { name: 'Mejai’s', capType: 'Points cap', cap: '26 points', note: 'High Emerald average', when: 'Tuesdays · 8:30 PM', fee: '$25 / team', pool: '$400',
        schedule: [['Registration closes', 'Sep 29'], ['Regular season', 'Oct 13'], ['Playoffs', 'Dec 8'], ['Grand final', 'Dec 22']] },
      { name: 'Rylai’s', capType: 'Points cap', cap: '36 points', note: 'High Diamond average', when: 'Mondays · 8:30 PM', fee: '$25 / team', pool: '$500',
        schedule: [['Registration closes', 'Oct 5'], ['Regular season', 'Oct 12'], ['Playoffs', 'Dec 7'], ['Grand final', 'Dec 21']] },
    ],
  },
  {
    name: 'Premade', title: 'Premade Leagues', kicker: 'Most competitive', nights: 'Thu · Sat · Sun',
    desc: "Premade Leagues are Risen's most competitive offerings. They have entry fees and require at least 200 ranked solo/duo queue games in order to be eligible. Each Premade League has a rank cap, and all players in that league must be below the cap.",
    ranks: 'Up to Master 500 LP', range: [0, 7],
    rankNote: 'At least 200 ranked solo/duo games required. Every player must be below their league’s cap; soft-cap leagues allow exception players.',
    facts: [['Match nights', 'Thu · Sat · Sun'], ['Rank caps', 'Emerald 4 – Master 250 LP'], ['Sign up', 'Full team'], ['Requirements', '200+ ranked solo/duo games'], ['Entry fee', 'From $50 / team'], ['Prize pool', 'Up to $2,500']],
    divTitle: 'Four leagues', divNote: 'Hard cap: every player must be below it. Soft cap: a limited number of exception players are allowed.',
    steps: ['Register a full team and pay the entry fee.', 'Staff verify ranks and the 200-game minimum.', 'Play your league’s match night each week.'],
    divs: [
      { name: 'Rampage', capType: 'Hard cap', cap: 'Emerald 4 · 99 LP', note: 'There is no longer an exception player for this league.', when: 'Saturdays · 8 PM', fee: '$50 / team', pool: '$750',
        schedule: [['Registration closes', 'Oct 3'], ['Regular season', 'Oct 10'], ['Playoffs', 'Nov 28'], ['Semifinals', 'Dec 5'], ['Grand final', 'Dec 12']] },
      { name: 'Unstoppable', capType: 'Hard cap', cap: 'Diamond 4 · 99 LP', note: 'All players must be below the cap.', when: 'Saturdays · 8 PM', fee: '$50 / team', pool: '$1,000',
        schedule: [['Registration closes', 'Oct 3'], ['Regular season', 'Oct 17'], ['Playoffs', 'Dec 5'], ['Semifinals', 'Dec 12'], ['Grand final', 'Dec 19']] },
      { name: 'Dominate', capType: 'Soft cap', cap: 'Diamond 1 · 99 LP', note: 'Teams may have one exception player up to Master 100 LP.', when: 'Sundays · 4 PM', fee: '$75 / team', pool: '$1,500',
        schedule: [['Registration closes', 'Oct 4'], ['Regular season', 'Oct 11'], ['Playoffs', 'Nov 29'], ['Semifinals', 'Dec 6'], ['Grand final', 'Dec 13']] },
      { name: 'Mythical', capType: 'Soft cap', cap: 'Master 250 LP', note: 'Up to two exception players up to Master 500 LP.', when: 'Thursdays · 8 PM', fee: '$100 / team', pool: '$2,500',
        schedule: [['Registration closes', 'Oct 1'], ['Regular season', 'Oct 8'], ['Playoffs', 'Nov 26'], ['Semifinals', 'Dec 3'], ['Grand final', 'Dec 10']] },
    ],
  },
  {
    name: 'Franchise', title: 'Franchise League', kicker: 'Competitive draft', nights: 'Wednesdays',
    desc: 'Franchise League is a competitive draft format, where General Managers will draft and manage a team of 5 players for a split. Teams will compete in seasons, and GMs will have the ability to retain players across splits.',
    ranks: 'Emerald – M/GM 800 LP', range: [5, 8],
    rankNote: 'Players up to Master/Grandmaster 800 LP are eligible.',
    facts: [['Match night', 'Wednesdays · 8:30 PM ET'], ['Eligible ranks', 'Emerald – M/GM 800 LP'], ['Sign up', 'Solo, drafted by GMs'], ['Rosters', '5 players per GM'], ['Entry fee', '$15 / player'], ['Prize pool', '$1,200']],
    steps: ['Sign up as a player, or apply to be a General Manager.', 'GMs draft and manage a team of 5 for the split.', 'Compete in seasons; GMs can retain players across splits.'],
    schedule: [['Sign-ups close', 'Sep 30'], ['GM draft', 'Oct 4'], ['Regular season', 'Oct 7'], ['Playoffs', 'Nov 25'], ['Grand final', 'Dec 16']],
    divs: [],
    compare: [['Franchise League', 'Emerald – M/GM 800 LP', 'Wed · 8:30 PM', '$15 / player']],
  },
];
