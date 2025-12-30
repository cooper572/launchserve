import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Opportunity, OpportunityDB } from '../types';
import { dbToFrontend } from '../types';
import '../animations.css';

const OpportunitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState(0); // 0 for 'All ages'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch opportunities from Supabase
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error);
          setError('Failed to load opportunities');
          return;
        }

        // Convert DB format to frontend format
        const convertedData = (data as OpportunityDB[]).map(dbToFrontend);
        setOpportunities(convertedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const searchLower = searchTerm.toLowerCase();
      // Search term filter
      const searchMatch = searchTerm === '' ||
        opp.title.toLowerCase().includes(searchLower) ||
        opp.organization.toLowerCase().includes(searchLower) ||
        opp.shortDescription.toLowerCase().includes(searchLower) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchLower));

      // Location filter
      const locationMatch = locationFilter === 'All' || opp.type === locationFilter;

      // Age filter
      const ageMatch = ageFilter === 0 || 
        (opp.ageRange?.min !== undefined && opp.ageRange?.max !== undefined && 
         opp.ageRange.min <= ageFilter && opp.ageRange.max >= ageFilter);

      return searchMatch && locationMatch && ageMatch;
    });
  }, [opportunities, searchTerm, locationFilter, ageFilter]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, ageFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Opportunities</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full page-transition">
      {/* Hero & Filter Section */}
      <section className="w-full bg-white border-b border-[#f0f2f4] py-12 px-4 md:px-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="text-center space-y-3 animate-fade-in-up">
            <h1 className="text-[#111418] text-3xl md:text-5xl font-extrabold tracking-tight">
              Find your next impact project
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Connect with small nonprofits and start volunteering today. Gain experience, help your community.
            </p>
            {user && (
              <div className="pt-4">
                <Link
                  to="/tailored-for-me"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  View Tailored For Me
                </Link>
              </div>
            )}
          </div>
          {/* SearchBar */}
          <div className="relative w-full max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
            <div className="flex items-center w-full h-14 rounded-2xl bg-[#f0f2f4] px-4 shadow-sm border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-md transition-all">
              <span className="material-symbols-outlined text-gray-500 mr-3">search</span>
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-[#111418] placeholder:text-gray-400 text-base font-medium h-full" 
                placeholder="Search for graphic design, tutoring, fundraising..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up animate-delay-200">
            <div className="relative">
              <select 
                className="appearance-none h-10 pl-4 pr-10 rounded-full bg-white border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary focus:border-primary focus:ring-0 transition-all cursor-pointer"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="All">All Locations</option>
                <option value="In-Person">In-Person</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
            <div className="relative">
              <select 
                className="appearance-none h-10 pl-4 pr-10 rounded-full bg-white border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:border-primary focus:border-primary focus:ring-0 transition-all cursor-pointer"
                value={ageFilter}
                onChange={(e) => setAgeFilter(Number(e.target.value))}
              >
                <option value={0}>All Ages</option>
                <option value={13}>13+</option>
                <option value={14}>14+</option>
                <option value={15}>15+</option>
                <option value={16}>16+</option>
                <option value={17}>17+</option>
                <option value={18}>18</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[18px]">expand_more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full bg-background-light py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600 font-medium">
              {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'} found
            </p>
          </div>

          {currentOpportunities.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No opportunities found</h3>
              <p className="text-gray-500">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentOpportunities.map((opp, index) => (
                  <div 
                    key={opp.id} 
                    className="animate-fade-in-up" 
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <OpportunityCard opportunity={opp} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>

                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page as number)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-primary text-white shadow-md'
                            : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default OpportunitiesPage;
