
import React, { useState, useMemo } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import { OPPORTUNITIES_DATA } from '../constants';
import type { Opportunity } from '../types';
import '../animations.css';

const OpportunitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState(0); // 0 for 'All ages'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredOpportunities = useMemo(() => {
    return OPPORTUNITIES_DATA.filter(opp => {
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
      const ageMatch = ageFilter === 0 || (opp.ageRange.min <= ageFilter && opp.ageRange.max >= ageFilter);

      return searchMatch && locationMatch && ageMatch;
    });
  }, [searchTerm, locationFilter, ageFilter]);

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
                value={locationFilter} 
                onChange={e => setLocationFilter(e.target.value)}
                className="appearance-none h-9 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors cursor-pointer pr-8"
                aria-label="Filter by location"
              >
                <option value="All">Location: All</option>
                <option value="In-Person">In-Person</option>
                <option value="Remote">Remote</option>
              </select>
              <span className="material-symbols-outlined text-base absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">keyboard_arrow_down</span>
            </div>
            <div className="relative">
              <select
                value={ageFilter}
                onChange={e => setAgeFilter(Number(e.target.value))}
                className="appearance-none h-9 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors cursor-pointer pr-8"
                aria-label="Filter by age"
              >
                <option value={0}>Age: Any</option>
                {[...Array(6)].map((_, i) => {
                    const age = 13 + i;
                    return <option key={age} value={age}>I am {age}</option>
                })}
              </select>
              <span className="material-symbols-outlined text-base absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">keyboard_arrow_down</span>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Cards Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Opportunities</h2>
          <span className="text-sm font-medium text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOpportunities.length)} of {filteredOpportunities.length}
          </span>
        </div>
        {currentOpportunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentOpportunities.map((opp, index) => (
                <div 
                  key={opp.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
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
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>

                {/* Page numbers */}
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800">No opportunities found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search term or filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default OpportunitiesPage;
