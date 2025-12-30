import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Opportunity, UserPreferences, MatchScore } from '../types';
import { calculateMatchScore } from '../utils/matchingAlgorithm';
import OpportunityCard from '../components/OpportunityCard';

const TailoredForMePage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matchScores, setMatchScores] = useState<Map<string, MatchScore>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!prefsData) {
        setLoading(false);
        return;
      }

      setPreferences(prefsData);

      // Fetch all opportunities
      const { data: oppsData, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (oppsData) {
        // Calculate match scores for each opportunity
        const scores = new Map<string, MatchScore>();
        oppsData.forEach((opp) => {
          try {
            const score = calculateMatchScore(opp, prefsData);
            scores.set(opp.id, score);
          } catch (err) {
            console.error('Error calculating match score for opportunity:', opp.id, err);
            // Set a default low score if calculation fails
            scores.set(opp.id, {
              opportunityId: opp.id,
              score: 0,
              matchReasons: ['Unable to calculate match']
            });
          }
        });

        // Sort opportunities by match score
        const sortedOpps = oppsData.sort((a, b) => {
          const scoreA = scores.get(a.id)?.score || 0;
          const scoreB = scores.get(b.id)?.score || 0;
          return scoreB - scoreA;
        });

        setOpportunities(sortedOpps);
        setMatchScores(scores);
      }
    } catch (error) {
      console.error('Error fetching tailored opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">tune</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h2>
          <p className="text-slate-600 mb-6">
            Tell us about your interests and preferences to get personalized opportunity recommendations.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Set Up Profile
            <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  const topMatches = opportunities.filter(opp => {
    const score = matchScores.get(opp.id);
    return score && score.score >= 70;
  }).slice(0, 10);

  const goodMatches = opportunities.filter(opp => {
    const score = matchScores.get(opp.id);
    return score && score.score >= 50 && score.score < 70;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Heading */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> Verified Student
              </span>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                Personalized
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Tailored for You
            </h1>
            <p className="text-lg text-slate-600 font-normal leading-normal">
              Hi {user?.user_metadata?.full_name || 'there'}, we found great matches based on your interests in{' '}
              {preferences.interests?.slice(0, 2).map((interest, idx) => (
                <span key={interest}>
                  <span className="font-bold text-primary">{interest}</span>
                  {idx < Math.min(preferences.interests!.length, 2) - 1 && ' and '}
                </span>
              ))}.
            </p>
          </div>
          <Link
            to="/onboarding"
            className="flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Edit Preferences</span>
          </Link>
        </section>

        {/* Feature / Explanation Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white shadow-sm border border-transparent hover:border-primary/20 transition-all">
            <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">star</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-slate-900 text-base font-bold">High Match Score</h3>
              <p className="text-slate-600 text-sm">We highlight roles with 70%+ compatibility with your profile.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white shadow-sm border border-transparent hover:border-primary/20 transition-all">
            <div className="size-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-slate-900 text-base font-bold">Verified Nonprofits</h3>
              <p className="text-slate-600 text-sm">Every organization is vetted for student safety and impact.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white shadow-sm border border-transparent hover:border-primary/20 transition-all">
            <div className="size-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-slate-900 text-base font-bold">Skill Building</h3>
              <p className="text-slate-600 text-sm">Gain real-world experience in your top career fields.</p>
            </div>
          </div>
        </section>

        {/* Top Matches Section */}
        {topMatches.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Top Matches</h2>
              <span className="text-sm text-slate-500">{topMatches.length} opportunities</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topMatches.map((opportunity) => {
                const matchScore = matchScores.get(opportunity.id);
                return (
                  <div key={opportunity.id} className="relative">
                    {matchScore && matchScore.score >= 90 && (
                      <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        {matchScore.score}% Match
                      </div>
                    )}
                    <OpportunityCard opportunity={opportunity} matchScore={matchScore?.score} />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Good Matches Section */}
        {goodMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">More Opportunities</h2>
              <span className="text-sm text-slate-500">{goodMatches.length} opportunities</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goodMatches.slice(0, 9).map((opportunity) => {
                const matchScore = matchScores.get(opportunity.id);
                return (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    matchScore={matchScore?.score}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* No Matches */}
        {topMatches.length === 0 && goodMatches.length === 0 && (
          <div className="text-center py-12">
            <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-slate-400 text-3xl">search_off</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No matches found</h3>
            <p className="text-slate-600 mb-6">
              We couldn't find opportunities matching your preferences. Try updating your profile or browse all opportunities.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Update Preferences
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
              >
                Browse All
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TailoredForMePage;
