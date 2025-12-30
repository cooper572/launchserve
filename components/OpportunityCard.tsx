
import React from 'react';
import { Link } from 'react-router-dom';
import type { Opportunity } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchScore?: number;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, matchScore }) => {
  return (
    <Link to={`/opportunity/${opportunity.id}`} className="block h-full">
        <article className="flex flex-col bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {opportunity.imageUrl ? (
                    <img src={opportunity.imageUrl} alt={opportunity.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300">volunteer_activism</span>
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"
                    style={{ color: opportunity.type === 'Remote' ? '#137fec' : '#f97316' }}
                >
                    <span className="material-symbols-outlined text-[16px]">
                        {opportunity.type === 'Remote' ? 'public' : 'location_on'}
                    </span>
                    {opportunity.type}
                </div>
                {matchScore !== undefined && matchScore >= 50 && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-green-600">bolt</span>
                        <span className={matchScore >= 90 ? 'text-green-700' : matchScore >= 70 ? 'text-green-600' : 'text-blue-600'}>
                            {matchScore}% Match
                        </span>
                    </div>
                )}
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{opportunity.organization}</div>
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2 group-hover:text-primary transition-colors">{opportunity.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{opportunity.shortDescription}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5" title="Time Commitment">
                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                            <span>{opportunity.timeCommitment}</span>
                        </div>
                        {opportunity.ageRange?.min && (
                            <div className="flex items-center gap-1.5" title="Age Requirement">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span>{opportunity.ageRange.min}+</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full bg-gray-100 group-hover:bg-primary text-gray-800 group-hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-sm text-center">
                        Learn More
                    </div>
                </div>
            </div>
        </article>
    </Link>
  );
};

export default OpportunityCard;
