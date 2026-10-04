// Edit league info here. Synced with the Risen Discord (#risen-info and #announcements) on Oct 3, 2026.
// Dates come from the Risen master calendar: https://docs.google.com/spreadsheets/d/1QSRqzcjYERVyEnxZursckLmDarBaZ-DcW51rPxfWCGk
// "TBA" = not yet announced in the Discord.
export const DISCORD_URL = 'https://discord.gg/risenesports';
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
  { name: 'Draft League', ranks: 'Gold 4 – Master 500 LP', format: 'Solo sign-up · drafted by captains', nights: 'Fridays · 8 PM ET', fee: 'Free', pool: 'TBA', season: 'Oct 2 – Dec 18' },
  { name: 'Teambuilder', ranks: 'Iron – Master 700 LP', format: 'Full team · four points-capped divisions', nights: 'Mon & Tue · 8:30 PM ET', fee: 'TBA', pool: 'TBA', season: 'Oct 12 – Dec 15' },
  { name: 'Premade', ranks: 'Emerald 4 – Master 450 LP caps', format: 'Four rank-capped leagues · 200+ ranked games', nights: 'Thu · Sat · Sun', fee: 'From $10 / team', pool: 'Up to $400 per 8 teams', season: 'Started Sep 5' },
  { name: 'Franchise', ranks: 'Emerald – M/GM 800 LP', format: 'GMs draft and manage a team of 5', nights: 'Wednesdays · 8:30 PM ET', fee: 'TBA', pool: 'TBA', season: 'TBA' },
];

/** URL slug for a format, used as ?league=<slug> on the leagues page. */
export const leagueSlug = (f: { name: string }) => f.name.toLowerCase();

// Leagues page. range = [lowest tier index, highest tier index] into TIERS.
export const FORMATS: Format[] = [
  {
    name: 'Draft', title: 'Draft League', kicker: 'Most casual', nights: 'Fridays',
    desc: "Draft League is Risen's most casual league and our entry league, focused on community and meeting new people. It's free: players sign up solo and are drafted onto teams by captains.",
    ranks: 'Gold 4 – Master 500 LP', range: [3, 7],
    rankNote: 'Roughly Gold 4 to Master 500 LP peak. No ranked game requirement. Accounts must be level 100.',
    facts: [['Match night', 'Fridays · 8 PM ET'], ['Eligible ranks', 'Gold 4 – Master 500 LP'], ['Sign up', 'Solo'], ['Requirements', 'Level 100 account'], ['Entry fee', 'Free'], ['Prize pool', 'TBA']],
    steps: ['Sign up solo through the form in the Discord.', 'Play in the Scouting Grounds (mandatory for everyone).', 'Captains draft players onto teams, then play Fridays at 8 PM ET.'],
    schedule: [['Sign-ups open', 'Sep 4'], ['Scouting Grounds', 'Sep 25'], ['Regular season', 'Oct 2'], ['Tiebreakers', 'Nov 13'], ['Playoffs', 'Nov 20'], ['Playoffs end', 'Dec 18']],
    divs: [],
    compare: [['Draft League', 'Gold 4 – Master 500 LP', 'Fri · 8 PM', 'Free']],
  },
  {
    name: 'Teambuilder', title: 'Teambuilder', kicker: 'Points-based', nights: 'Mon & Tue',
    desc: 'Teambuilder is our rec league: sign up with a full team of friends at different ranks. Each rank is worth points and each division has a points cap, which gives groups with mismatched ranks some flexibility.',
    ranks: 'Iron – Master 700 LP', range: [0, 7],
    rankNote: 'No ranked game requirement. Accounts must be level 100. Each player is worth points based on rank; your roster must fit under the division cap. Matches are Bo3 with fearless draft.',
    facts: [['Match nights', 'Mon & Tue · 8:30 PM ET'], ['Eligible ranks', 'Iron – Master 700 LP'], ['Sign up', 'Full team'], ['Requirements', 'Level 100 account'], ['Entry fee', 'TBA'], ['Prize pool', 'TBA']],
    divTitle: 'Four divisions', divNote: 'Pick the division whose points cap fits your roster.',
    steps: ['Build a roster and add up your players’ points.', 'Register in the division that fits your total.', 'Play Mondays or Tuesdays at 8:30 PM ET.'],
    divs: [
      { name: 'Doran’s', capType: 'Points cap', cap: '14 points', note: 'Low Platinum average', when: 'Mondays · 8:30 PM', fee: 'TBA', pool: 'TBA',
        schedule: [['Sign-ups open', 'Sep 14'], ['Sign-ups close', 'Sep 28'], ['Regular season', 'Oct 12'], ['Playoffs', 'Nov 16'], ['Playoffs end', 'Nov 30']] },
      { name: 'Bami’s', capType: 'Points cap', cap: '20 points', note: 'Mid-Emerald average', when: 'Tuesdays · 8:30 PM', fee: 'TBA', pool: 'TBA',
        schedule: [['Sign-ups open', 'Sep 14'], ['Sign-ups close', 'Sep 28'], ['Regular season', 'Oct 13'], ['Playoffs', 'Nov 24'], ['Playoffs end', 'Dec 15']] },
      { name: 'Mejai’s', capType: 'Points cap', cap: '26 points', note: 'High Emerald average', when: 'Tuesdays · 8:30 PM', fee: 'TBA', pool: 'TBA',
        schedule: [['Sign-ups open', 'Sep 14'], ['Sign-ups close', 'Sep 28'], ['Regular season', 'Oct 13'], ['Playoffs', 'Nov 24'], ['Playoffs end', 'Dec 15']] },
      { name: 'Rylai’s', capType: 'Points cap', cap: '36 points', note: 'High Diamond average', when: 'Mondays · 8:30 PM', fee: 'TBA', pool: 'TBA',
        schedule: [['Sign-ups open', 'Sep 14'], ['Sign-ups close', 'Sep 28'], ['Regular season', 'Oct 12'], ['Playoffs', 'Nov 30'], ['Playoffs end', 'Dec 14']] },
    ],
  },
  {
    name: 'Premade', title: 'Premade Leagues', kicker: 'Most competitive', nights: 'Thu · Sat · Sun',
    desc: "Premade Leagues are Risen's most competitive offerings. They have entry fees and require at least 200 ranked solo/duo queue games in order to be eligible. Each Premade League has a rank cap, and all players in that league must be below the cap.",
    ranks: 'Up to Master 700 LP', range: [0, 7],
    rankNote: 'At least 200 ranked solo/duo games required; this is firm and cannot be waived. Every player must be below their league’s cap; soft-cap leagues allow exception players.',
    facts: [['Match nights', 'Thu · Sat · Sun'], ['Rank caps', 'Emerald 4 – Master 450 LP'], ['Sign up', 'Full team'], ['Requirements', '200+ ranked solo/duo games'], ['Entry fee', 'From $10 / team'], ['Prize pool', 'Up to $400 per 8 teams']],
    divTitle: 'Four leagues', divNote: 'Hard cap: every player must be below it. Soft cap: a limited number of exception players are allowed. Cash prize pools grow with every 8 teams accepted and pay 70% to the winner, 30% to the runner-up.',
    steps: ['Register a full team and pay the entry fee.', 'Staff verify ranks and the 200-game minimum.', 'Play your league’s match night each week.'],
    divs: [
      { name: 'Rampage', capType: 'Hard cap', cap: 'Emerald 4 · 99 LP', note: 'There is no longer an exception player for this league.', when: 'Saturdays · 8 PM', fee: '$10 / team', pool: 'Mystery skin for each starter',
        schedule: [['Sign-ups closed', 'Aug 29'], ['Regular season', 'Sep 5'], ['Playoffs', 'TBA']] },
      { name: 'Unstoppable', capType: 'Hard cap', cap: 'Diamond 4 · 99 LP', note: 'All players must be below the cap.', when: 'Saturdays · 8 PM', fee: '$55 / team', pool: '$280 per 8 teams',
        schedule: [['Sign-ups closed', 'Aug 29'], ['Regular season', 'Sep 5'], ['Playoffs', 'TBA']] },
      { name: 'Dominate', capType: 'Soft cap', cap: 'Diamond 1 · 99 LP', note: 'Teams may have one exception player up to Master 100 LP.', when: 'Sundays · 4 PM', fee: '$70 / team', pool: '$400 per 8 teams',
        schedule: [['Sign-ups closed', 'Aug 29'], ['Regular season', 'Sep 6'], ['Playoffs', 'TBA']] },
      { name: 'Mythical', capType: 'Soft cap', cap: 'Master 450 LP', note: 'Exception players (above 450 LP) allowed up to Master 700 LP; peaks above 700 LP are ineligible.', when: 'Thursdays · 8 PM', fee: 'TBA', pool: 'TBA',
        schedule: [['Sign-ups open', 'Sep 11'], ['Sign-ups close', 'Oct 1'], ['Week 1', 'Oct 8'], ['Playoffs', 'TBA']] },
    ],
  },
  {
    name: 'Franchise', title: 'Franchise League', kicker: 'Competitive draft', nights: 'Wednesdays',
    desc: 'Franchise League is a competitive draft format, where General Managers will draft and manage a team of 5 players for a split. Teams will compete in seasons, and GMs will have the ability to retain players across splits. Trading and a free agency pool let GMs tune their teams over the season.',
    ranks: 'Emerald – M/GM 800 LP', range: [5, 8],
    rankNote: 'Players from Emerald up to Master/Grandmaster 800 LP are eligible. Requires 200 solo queue games across the last two splits, with at least 150 in one of them.',
    facts: [['Match night', 'Wednesdays · 8:30 PM ET'], ['Eligible ranks', 'Emerald – M/GM 800 LP'], ['Sign up', 'Solo, drafted by GMs'], ['Requirements', '200 games in last 2 splits'], ['Entry fee', 'TBA'], ['Prize pool', 'TBA']],
    steps: ['Sign up as a player, or apply to be a General Manager.', 'GMs draft and manage a team of 5 for the split.', 'Compete in seasons; GMs can retain, trade and sign free agents.'],
    schedule: [['Sign-ups', 'TBA'], ['GM draft', 'TBA'], ['Regular season', 'TBA']],
    divs: [],
    compare: [['Franchise League', 'Emerald – M/GM 800 LP', 'Wed · 8:30 PM', 'TBA']],
  },
];
