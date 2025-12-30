// This file is no longer used - data is fetched from Supabase
// Keeping for reference only

export const OPPORTUNITY_TYPES = ['In-Person', 'Remote', 'Hybrid'] as const;
export const AGE_RANGES = [
  { label: '13-14', min: 13, max: 14 },
  { label: '15-16', min: 15, max: 16 },
  { label: '17-18', min: 17, max: 18 },
  { label: 'All Ages (13-18)', min: 13, max: 18 },
] as const;
