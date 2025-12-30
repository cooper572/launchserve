import type { Opportunity, UserPreferences, MatchScore } from '../types';

/**
 * Calculate match score between user preferences and an opportunity
 * Returns a score from 0-100 and reasons for the match
 * Now with safety checks to handle missing data
 */
export const calculateMatchScore = (
  opportunity: Opportunity,
  preferences: UserPreferences
): MatchScore => {
  let score = 0;
  const matchReasons: string[] = [];
  const maxScore = 100;

  // Safety checks - return low score if data is missing
  if (!opportunity || !preferences) {
    return {
      opportunityId: opportunity?.id || '',
      score: 0,
      matchReasons: ['Unable to calculate match'],
    };
  }

  // 1. Location Type Match (20 points)
  if (preferences.location_types && preferences.location_types.length > 0 && opportunity.type) {
    if (preferences.location_types.includes(opportunity.type)) {
      score += 20;
      matchReasons.push(`${opportunity.type} matches your preference`);
    }
  }

  // 2. Tags/Interests Match (25 points)
  if (opportunity.tags && opportunity.tags.length > 0 && 
      (preferences.interests?.length > 0 || preferences.causes?.length > 0)) {
    const matchingTags = opportunity.tags.filter(tag =>
      preferences.interests?.some(interest =>
        interest.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(interest.toLowerCase())
      ) ||
      preferences.causes?.some(cause =>
        cause.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(cause.toLowerCase())
      )
    );
    
    if (matchingTags.length > 0) {
      const tagScore = Math.min(25, (matchingTags.length / opportunity.tags.length) * 25);
      score += tagScore;
      matchReasons.push(`Matches your interests: ${matchingTags.slice(0, 3).join(', ')}`);
    }
  }

  // 3. Age Range Match (15 points)
  if (preferences.age && opportunity.ageRange?.min !== undefined && opportunity.ageRange?.max !== undefined) {
    if (preferences.age >= opportunity.ageRange.min && preferences.age <= opportunity.ageRange.max) {
      score += 15;
      matchReasons.push('Perfect age fit');
    } else if (
      Math.abs(preferences.age - opportunity.ageRange.min) <= 1 ||
      Math.abs(preferences.age - opportunity.ageRange.max) <= 1
    ) {
      score += 10;
      matchReasons.push('Close age match');
    }
  } else if (preferences.age) {
    // Give partial credit if age range is not specified
    score += 5;
  }

  // 4. Time Commitment Match (15 points)
  if (preferences.time_commitment && opportunity.timeCommitment) {
    const prefHours = extractHours(preferences.time_commitment);
    const oppHours = extractHours(opportunity.timeCommitment);
    
    if (prefHours && oppHours) {
      const diff = Math.abs(prefHours - oppHours);
      if (diff === 0) {
        score += 15;
        matchReasons.push('Exact time commitment match');
      } else if (diff <= 2) {
        score += 10;
        matchReasons.push('Similar time commitment');
      } else if (diff <= 5) {
        score += 5;
      }
    }
  }

  // 5. Location Match (15 points)
  if (opportunity.type === 'Remote') {
    if (preferences.location_types?.includes('Remote')) {
      score += 15;
      matchReasons.push('Remote work matches your preference');
    }
  } else if (opportunity.type === 'In-Person' && opportunity.location) {
    if (preferences.preferred_locations && preferences.preferred_locations.length > 0) {
      const matchingLocation = preferences.preferred_locations.some(prefLoc =>
        opportunity.location.toLowerCase().includes(prefLoc.toLowerCase()) ||
        prefLoc.toLowerCase().includes(opportunity.location.toLowerCase())
      );
      
      if (matchingLocation) {
        score += 15;
        matchReasons.push('In your preferred area');
      }
    } else {
      score += 5; // Partial credit if no preference set
    }
  }

  // 6. Skills Match (10 points)
  if (preferences.skills && preferences.skills.length > 0 && 
      opportunity.requirements && opportunity.requirements.length > 0) {
    const matchingSkills = opportunity.requirements.filter(req =>
      preferences.skills.some(skill =>
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );
    
    if (matchingSkills.length > 0) {
      score += 10;
      matchReasons.push(`Your skills match: ${matchingSkills.slice(0, 2).join(', ')}`);
    }
  }

  // Normalize score to 0-100
  score = Math.min(maxScore, Math.round(score));

  // If no specific reasons, add a generic one
  if (matchReasons.length === 0) {
    matchReasons.push('Opportunity available in your area');
  }

  return {
    opportunityId: opportunity.id,
    score,
    matchReasons: matchReasons.slice(0, 3), // Limit to top 3 reasons
  };
};

/**
 * Extract hours from time commitment string
 * Examples: "2-4 hours/week" -> 3, "5 hours/month" -> 5
 */
const extractHours = (timeStr: string): number | null => {
  if (!timeStr) return null;
  
  const match = timeStr.match(/(\d+)(?:-(\d+))?/);
  if (!match) return null;
  
  const min = parseInt(match[1]);
  const max = match[2] ? parseInt(match[2]) : min;
  
  return (min + max) / 2; // Return average
};

/**
 * Sort opportunities by match score
 */
export const sortByMatchScore = (
  opportunities: Opportunity[],
  preferences: UserPreferences
): Array<Opportunity & { matchScore: MatchScore }> => {
  return opportunities
    .map(opp => ({
      ...opp,
      matchScore: calculateMatchScore(opp, preferences),
    }))
    .sort((a, b) => b.matchScore.score - a.matchScore.score);
};

/**
 * Get match level label based on score
 */
export const getMatchLevel = (score: number): {
  label: string;
  color: string;
  bgColor: string;
} => {
  if (score >= 80) {
    return {
      label: 'Excellent Match',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
    };
  } else if (score >= 60) {
    return {
      label: 'Great Match',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
    };
  } else if (score >= 40) {
    return {
      label: 'Good Match',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
    };
  } else {
    return {
      label: 'Potential Match',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    };
  }
};
