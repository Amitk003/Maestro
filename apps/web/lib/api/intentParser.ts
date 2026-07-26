export interface ParsedIntent {
  timeBudget: number | null;
  dietaryConstraints: string[];
  cuisineVibe: string;
  partySize: number | null;
  occasion: string;
}

export interface DiningSequence {
  starter: { name: string; station: string; timing: string };
  main: { name: string; station: string; timing: string };
  drink: { name: string; timing: string };
  tableTime: string;
  recoveryPerk: string | null;
}

const TIME_PATTERNS = [
  { re: /(\d+)\s*min/i, key: 'min' },
  { re: /(\d+)\s*hour/i, key: 'hour' },
  { re: /quick|rush|fast|speed/i, key: 'quick' },
];

const DIET_KEYWORDS: Record<string, string[]> = {
  high_protein: ['protein', 'high protein', 'keto', 'paleo', 'meat'],
  vegetarian: ['vegetarian', 'veggie', 'no meat', 'plant'],
  vegan: ['vegan', 'plant based', 'no dairy'],
  gluten_free: ['gluten', 'celiac', 'wheat free'],
  light: ['light', 'low cal', 'healthy', 'salad', 'small'],
};

const VIBE_KEYWORDS: Record<string, string[]> = {
  cozy: ['cozy', 'intimate', 'romantic', 'candlelight', 'quiet'],
  energetic: ['energetic', 'lively', 'upbeat', 'vibrant', 'buzz'],
  celebratory: ['celebration', 'party', 'group', 'birthday', 'anniversary'],
  business: ['business', 'meeting', 'formal', 'professional'],
};

const OCCASION_KEYWORDS: Record<string, string[]> = {
  date_night: ['date', 'romantic', 'anniversary'],
  celebration: ['celebration', 'birthday', 'party', 'group'],
  business_meeting: ['business', 'meeting', 'client'],
  pre_show: ['show', 'concert', 'theatre', 'movie', 'pre-show'],
};

export function parseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase();

  let timeBudget: number | null = null;
  for (const p of TIME_PATTERNS) {
    const match = lower.match(p.re);
    if (match) {
      if (p.key === 'min') timeBudget = parseInt(match[1], 10);
      else if (p.key === 'hour') timeBudget = parseInt(match[1], 10) * 60;
      else if (p.key === 'quick') timeBudget = 20;
      break;
    }
  }

  const dietaryConstraints: string[] = [];
  for (const [key, keywords] of Object.entries(DIET_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      dietaryConstraints.push(key);
    }
  }

  let cuisineVibe = 'casual';
  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      cuisineVibe = vibe;
      break;
    }
  }

  let partySize: number | null = null;
  const sizeMatch = lower.match(/(\d+)\s*(people|person|guests?|pax|of us)/i);
  if (sizeMatch) partySize = parseInt(sizeMatch[1], 10);

  let occasion = 'casual_dining';
  for (const [occ, keywords] of Object.entries(OCCASION_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      occasion = occ;
      break;
    }
  }

  return { timeBudget, dietaryConstraints, cuisineVibe, partySize, occasion };
}

const STARTERS: Record<string, { name: string; station: string; timing: string }> = {
  cozy: { name: 'Truffle Mushroom Soup', station: 'Saute Station', timing: '6 mins' },
  energetic: { name: 'Chilled Citrus Salmon Tartare', station: 'Cold Prep Bar', timing: '4 mins' },
  celebratory: { name: 'Oysters Rockefeller', station: 'Cold Prep Bar', timing: '8 mins' },
  business: { name: 'Heirloom Tomato Salad', station: 'Cold Prep Bar', timing: '5 mins' },
  casual: { name: 'Roasted Garlic Bread with Herbs', station: 'Pastry & Dessert', timing: '4 mins' },
};

const MAINS: Record<string, { name: string; station: string; timing: string }> = {
  cozy: { name: 'Truffle Mushroom Risotto', station: 'Saute Station', timing: '14 mins' },
  energetic: { name: 'Pan-Seared Atlantic Salmon', station: 'Saute Station', timing: '12 mins' },
  celebratory: { name: 'Charred Wagyu Ribeye Steak', station: 'Grill Station', timing: '18 mins' },
  business: { name: 'Herb-Crusted Chicken Breast', station: 'Grill Station', timing: '14 mins' },
  casual: { name: 'Pan-Seared Atlantic Salmon', station: 'Saute Station', timing: '12 mins' },
};

const DRINKS: Record<string, { name: string; timing: string }> = {
  cozy: { name: 'Spiced Chai Latte', timing: '3 mins' },
  energetic: { name: 'Sparkling Yuzu Botanical Tonic', timing: 'Immediate' },
  celebratory: { name: 'Champagne Flight', timing: '3 mins' },
  business: { name: 'Still Mineral Water', timing: 'Immediate' },
  casual: { name: 'Sparkling Yuzu Botanical Tonic', timing: 'Immediate' },
};

const PROTEIN_MAIN = { name: 'Pan-Seared Atlantic Salmon', station: 'Saute Station', timing: '12 mins' };
const LIGHT_STARTER = { name: 'Heirloom Tomato Salad', station: 'Cold Prep Bar', timing: '5 mins' };

export function generateSequence(intent: ParsedIntent): DiningSequence {
  const vibe = intent.cuisineVibe || 'casual';
  const isQuick = intent.timeBudget !== null && intent.timeBudget <= 20;
  const isHighProtein = intent.dietaryConstraints.includes('high_protein');
  const isLight = intent.dietaryConstraints.includes('light');

  const starter = isLight ? LIGHT_STARTER : (isQuick ? { name: 'Chilled Citrus Salmon Tartare', station: 'Cold Prep Bar', timing: '4 mins' } : STARTERS[vibe] || STARTERS.casual);
  const main = isHighProtein ? PROTEIN_MAIN : (MAINS[vibe] || MAINS.casual);
  const drink = DRINKS[vibe] || DRINKS.casual;

  const totalTime = intent.timeBudget ? `${intent.timeBudget} minutes total` : '25 minutes total';

  return { starter, main, drink, tableTime: totalTime, recoveryPerk: null };
}
