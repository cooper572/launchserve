
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
  type: 'In-Person' | 'Remote';
  requirements: string[];
  imageUrl: string;
  iconUrl?: string;
  formLink?: string;
  tags: string[];
}
