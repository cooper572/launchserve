
// Supabase database types
export interface OpportunityDB {
  id: string;
  organization: string;
  contact_email: string;
  contact_phone?: string;
  contact_website?: string;
  contact_facebook?: string;
  contact_instagram?: string;
  contact_twitter?: string;
  contact_linkedin?: string;
  title: string;
  short_description: string;
  full_description: string;
  age_min: number;
  age_max: number;
  time_commitment: string;
  time_commitment_unit: string;
  location?: string;
  type: 'In-Person' | 'Remote' | 'Hybrid';
  requirements: string[];
  icon_url?: string;
  thumbnail_url?: string;
  form_link?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

// Frontend display type (converted from DB format)
export interface Opportunity {
  id: string;
  organization: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  title: string;
  shortDescription: string;
  fullDescription: string;
  ageRange: {
    min: number;
    max: number;
  };
  timeCommitment: string;
  location: string;
  type: 'In-Person' | 'Remote' | 'Hybrid';
  requirements: string[];
  imageUrl: string;
  iconUrl?: string;
  formLink?: string;
  tags: string[];
}

// Helper function to convert DB format to frontend format
export const dbToFrontend = (db: OpportunityDB): Opportunity => ({
  id: db.id,
  organization: db.organization,
  contactEmail: db.contact_email,
  contactPhone: db.contact_phone,
  website: db.contact_website,
  socialMedia: {
    facebook: db.contact_facebook,
    instagram: db.contact_instagram,
    twitter: db.contact_twitter,
    linkedin: db.contact_linkedin,
  },
  title: db.title,
  shortDescription: db.short_description,
  fullDescription: db.full_description,
  ageRange: {
    min: db.age_min,
    max: db.age_max,
  },
  timeCommitment: `${db.time_commitment} ${db.time_commitment_unit}`,
  location: db.location || 'Online',
  type: db.type,
  requirements: db.requirements,
  imageUrl: db.thumbnail_url || '',
  iconUrl: db.icon_url,
  formLink: db.form_link,
  tags: db.tags,
});

// Helper function to convert frontend format to DB format
export const frontendToDb = (opp: Partial<Opportunity> & { timeCommitmentUnit?: string }): Partial<OpportunityDB> => ({
  organization: opp.organization,
  contact_email: opp.contactEmail,
  contact_phone: opp.contactPhone,
  contact_website: opp.website,
  contact_facebook: opp.socialMedia?.facebook,
  contact_instagram: opp.socialMedia?.instagram,
  contact_twitter: opp.socialMedia?.twitter,
  contact_linkedin: opp.socialMedia?.linkedin,
  title: opp.title,
  short_description: opp.shortDescription,
  full_description: opp.fullDescription,
  age_min: opp.ageRange?.min,
  age_max: opp.ageRange?.max,
  time_commitment: opp.timeCommitment?.split(' ')[0] || opp.timeCommitment,
  time_commitment_unit: opp.timeCommitmentUnit || 'hours/week',
  location: opp.location,
  type: opp.type,
  requirements: opp.requirements,
  icon_url: opp.iconUrl,
  thumbnail_url: opp.imageUrl,
  form_link: opp.formLink,
  tags: opp.tags,
});


// User Preferences Types
export interface UserPreferences {
  id: string;
  user_id: string;
  full_name?: string;
  age?: number;
  school?: string;
  grade_level?: string;
  interests: string[];
  causes: string[];
  skills: string[];
  availability_days: string[];
  time_commitment?: string;
  preferred_locations: string[];
  max_distance?: number;
  location_types: string[];
  experience_level?: string;
  previous_volunteer: boolean;
  volunteer_goals: string[];
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

// Matching Score Result
export interface MatchScore {
  opportunityId: string;
  score: number; // 0-100
  matchReasons: string[];
}

// Organization Profile Types
export interface OrganizationProfile {
  id: string;
  user_id: string;
  username: string;
  organization_name: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Account Type
export type AccountType = 'volunteer' | 'organization';
