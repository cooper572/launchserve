import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { OpportunityDB } from '../types';

interface OrganizationProfile {
  username: string;
  organization_name: string;
  logo_url?: string;
}

interface DashboardStats {
  active_listings: number;
  pending_applications: number;
  total_views: number;
}

const OrganizationDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityDB[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ active_listings: 0, pending_applications: 0, total_views: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProfile();
    fetchOpportunities();
    fetchStats();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('organization_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      // If no profile exists, redirect to onboarding
      if (error.code === 'PGRST116') {
        navigate('/organization-onboarding');
      }
    } else {
      setProfile(data);
    }
  };

  const fetchOpportunities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('organization_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching opportunities:', error);
    } else {
      setOpportunities(data || []);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('organization_dashboard_stats')
      .select('*')
      .eq('organization_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching stats:', error);
    } else if (data) {
      setStats({
        active_listings: data.active_listings || 0,
        pending_applications: data.pending_applications || 0,
        total_views: data.total_views || 0,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white h-full flex flex-col border-r border-slate-200 hidden md:flex shrink-0">
        <div className="p-6">
          <div className="flex flex-col">
            <h1 className="text-primary text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>volunteer_activism</span>
              LaunchServe
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Organization Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2">
          <Link
            to="/organization-dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary"
          >
            <span className="material-symbols-outlined text-[24px] fill-1">checklist</span>
            <span className="text-sm font-bold">Opportunities</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-slate-900 text-lg font-bold leading-tight">
            Welcome, {profile?.organization_name || 'Organization'}
          </h2>
          <div className="flex items-center gap-4">
            {profile?.logo_url && (
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-slate-100"
                style={{ backgroundImage: `url(${profile.logo_url})` }}
              />
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8 pb-20">
          {/* Heading & CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Opportunities</h1>
              <p className="text-slate-500 text-base">Track and manage your volunteer listings.</p>
            </div>
            <Link
              to="/submit"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create New Opportunity</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">Active Listings</p>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">list_alt</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-slate-900">{stats.active_listings}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">Pending Applications</p>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-slate-900">{stats.pending_applications}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-sm font-medium">Total Views</p>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-slate-900">{stats.total_views}</p>
              </div>
            </div>
          </div>

          {/* Opportunities List Section */}
          <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
              <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search opportunities by title..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-500">Loading...</div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inbox</span>
                <p className="text-slate-500 text-lg font-medium">No opportunities yet</p>
                <p className="text-slate-400 text-sm mt-2">Create your first opportunity to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Opportunity Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Date Posted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Metrics
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredOpportunities.map((opp) => (
                      <tr key={opp.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="size-10 flex-shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              <span className="material-symbols-outlined">volunteer_activism</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-slate-900">{opp.title}</div>
                              <div className="text-xs text-slate-500">
                                {opp.type} • {opp.time_commitment} {opp.time_commitment_unit}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">{formatDate(opp.created_at!)}</div>
                          <div className="text-xs text-slate-400">{getTimeAgo(opp.created_at!)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-slate-600" title="Views">
                              <span className="material-symbols-outlined text-[18px] text-slate-400">visibility</span>
                              <span className="text-sm font-medium">0</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/opportunity/${opp.id}`}
                              className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
                              title="View"
                            >
                              <span className="material-symbols-outlined text-[20px]">visibility</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizationDashboardPage;
