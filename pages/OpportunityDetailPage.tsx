import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { Opportunity, OpportunityDB } from '../types';
import { dbToFrontend } from '../types';
import '../editor.css';
import '../animations.css';

const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase fetch error:', error);
          setError('Opportunity not found');
          return;
        }

        if (data) {
          setOpportunity(dbToFrontend(data as OpportunityDB));
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="text-center py-20">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
        <h1 className="text-2xl font-bold mb-4">Opportunity not found</h1>
        <Link to="/opportunities" className="text-primary hover:underline font-semibold">
          Back to opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light page-transition">
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-wrap gap-2 py-4 mb-2 text-sm font-medium animate-fade-in">
          <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/opportunities" className="text-gray-500 hover:text-primary">Opportunities</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800">{opportunity.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  {opportunity.iconUrl ? (
                    <img src={opportunity.iconUrl} alt={`${opportunity.organization} logo`} className="h-24 w-24 md:h-32 md:w-32 rounded-xl object-cover bg-gray-100 border"/>
                  ) : (
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl bg-gray-100 border flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400">volunteer_activism</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{opportunity.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 mb-4">
                    <span className="font-semibold text-gray-800">{opportunity.organization}</span>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">{opportunity.type === 'Remote' ? 'public' : 'location_on'}</span>
                      <span>{opportunity.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{opportunity.shortDescription}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up animate-delay-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                About this opportunity
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed editor-content" dangerouslySetInnerHTML={{ __html: opportunity.fullDescription }} />
            </div>

            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up animate-delay-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">checklist</span>
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5">check_circle</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="sticky top-6 flex flex-col gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up animate-delay-300">
                <h3 className="text-lg font-bold mb-4">Quick Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Time Commitment</p>
                      <p className="text-gray-800 font-semibold">{opportunity.timeCommitment}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">group</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Age Range</p>
                      <p className="text-gray-800 font-semibold">
                        {opportunity.ageRange?.min && opportunity.ageRange?.max 
                          ? `${opportunity.ageRange.min}-${opportunity.ageRange.max} years old`
                          : 'All ages'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px]">{opportunity.type === 'Remote' ? 'laptop_chromebook' : 'location_on'}</span>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Type</p>
                      <p className="text-gray-800 font-semibold">{opportunity.type}</p>
                    </div>
                  </div>
                </div>

                {opportunity.tags && opportunity.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-50 text-primary text-xs font-semibold rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {opportunity.formLink && (
                  <a 
                    href={opportunity.formLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                  >
                    <span>Apply Now</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </a>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-fade-in-up animate-delay-400">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">contact_mail</span>
                  Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">email</span>
                    <a href={`mailto:${opportunity.contactEmail}`} className="text-primary hover:underline break-all">
                      {opportunity.contactEmail}
                    </a>
                  </div>
                  {opportunity.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">phone</span>
                      <a href={`tel:${opportunity.contactPhone}`} className="text-primary hover:underline">
                        {opportunity.contactPhone}
                      </a>
                    </div>
                  )}
                  {opportunity.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-gray-400 text-[18px]">language</span>
                      <a href={opportunity.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        Website
                      </a>
                    </div>
                  )}
                  {opportunity.socialMedia && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-2">Social Media</p>
                      <div className="flex gap-2">
                        {opportunity.socialMedia.facebook && (
                          <a href={opportunity.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <span className="text-blue-600 text-sm font-bold">f</span>
                          </a>
                        )}
                        {opportunity.socialMedia.instagram && (
                          <a href={opportunity.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-100 transition-colors">
                            <span className="text-pink-600 text-sm font-bold">ig</span>
                          </a>
                        )}
                        {opportunity.socialMedia.twitter && (
                          <a href={opportunity.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center hover:bg-sky-100 transition-colors">
                            <span className="text-sky-600 text-sm font-bold">𝕏</span>
                          </a>
                        )}
                        {opportunity.socialMedia.linkedin && (
                          <a href={opportunity.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
                            <span className="text-blue-700 text-sm font-bold">in</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
