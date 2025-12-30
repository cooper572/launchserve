import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { UserPreferences } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefsData) {
        setPreferences(prefsData);
      }

      // Fetch saved opportunities count
      const { count: savedCountData } = await supabase
        .from('saved_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setSavedCount(savedCountData || 0);

      // Fetch applications count
      const { count: appsCountData } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setApplicationsCount(appsCountData || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="text-slate-600">Here's your volunteer activity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">bookmark</span>
              </div>
              <span className="text-3xl font-bold text-slate-900">{savedCount}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 mb-1">Saved Opportunities</h3>
            <p className="text-xs text-slate-500">Opportunities you're interested in</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-full bg-green-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 text-2xl">send</span>
              </div>
              <span className="text-3xl font-bold text-slate-900">{applicationsCount}</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 mb-1">Applications</h3>
            <p className="text-xs text-slate-500">Opportunities you've applied to</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600 text-2xl">star</span>
              </div>
              <span className="text-3xl font-bold text-slate-900">0</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 mb-1">Hours Completed</h3>
            <p className="text-xs text-slate-500">Total volunteer hours</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/tailored-for-me"
            className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Tailored For You</h3>
            <p className="text-blue-100 text-sm">Discover opportunities matched to your interests and skills</p>
          </Link>

          <Link
            to="/opportunities"
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-600 text-2xl">explore</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Browse All Opportunities</h3>
            <p className="text-slate-600 text-sm">Explore all available volunteer positions</p>
          </Link>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Profile</h2>
            <Link
              to="/onboarding"
              className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Preferences
            </Link>
          </div>

          {preferences ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.interests?.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-1">Preferred Locations</h3>
                  <p className="text-sm text-slate-900">{preferences.preferred_locations?.join(', ') || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-1">Preferred Type</h3>
                  <p className="text-sm text-slate-900">{preferences.location_types?.join(', ') || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-1">Time Commitment</h3>
                  <p className="text-sm text-slate-900">{preferences.time_commitment || 'Not set'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">Complete your profile to get personalized recommendations</p>
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Complete Profile
                <span className="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
