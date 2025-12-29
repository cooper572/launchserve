
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { OPPORTUNITIES_DATA } from '../constants';
import '../editor.css';
import '../animations.css';

const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opportunity = OPPORTUNITIES_DATA.find((opp) => opp.id === id);

  if (!opportunity) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Opportunity not found</h1>
        <Link to="/opportunities" className="text-primary hover:underline mt-4 inline-block">
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
                    <img src={opportunity.imageUrl} alt={`${opportunity.organization} logo`} className="h-24 w-24 md:h-32 md:w-32 rounded-xl object-cover bg-gray-100 border"/>
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
                  <div className="flex gap-2 flex-wrap">
                     {opportunity.tags.map(tag => (
                       <div key={tag} className="flex h-7 items-center justify-center gap-x-1.5 rounded-lg bg-blue-100 text-primary px-3">
                           <span className="text-xs font-semibold">{tag}</span>
                       </div>
                     ))}
                     <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-lg bg-gray-100 px-3">
                         <span className="material-symbols-outlined text-[16px]">{opportunity.type === 'Remote' ? 'laptop_mac' : 'group'}</span>
                         <span className="text-gray-800 text-xs font-semibold">{opportunity.type}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 animate-fade-in-up animate-delay-100">
              <h2 className="text-2xl font-bold mb-4">About the Role</h2>
              <div 
                className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: opportunity.fullDescription }}
              />
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5 sticky top-24 animate-fade-in-up animate-delay-200">
               <a 
                href={opportunity.formLink || `mailto:${opportunity.contactEmail}?subject=Volunteering Inquiry: ${opportunity.title}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center rounded-xl h-11 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center">
                   Apply Now
               </a>
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex gap-3 items-start">
                  <div className="bg-blue-50 text-primary p-2 rounded-lg shrink-0"><span className="material-symbols-outlined text-[20px]">schedule</span></div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Time Commitment</p>
                    <p className="text-gray-800 font-semibold text-sm">{opportunity.timeCommitment}</p>
                  </div>
                </div>
                 <div className="flex gap-3 items-start">
                  <div className="bg-blue-50 text-primary p-2 rounded-lg shrink-0"><span className="material-symbols-outlined text-[20px]">cake</span></div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Age Requirement</p>
                    <p className="text-gray-800 font-semibold text-sm">{opportunity.ageRange.min} - {opportunity.ageRange.max} years old</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-800 font-bold mb-3">Skills & Requirements</p>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="flex gap-2 items-start text-sm text-gray-700">
                      <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
