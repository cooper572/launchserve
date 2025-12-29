
import React from 'react';
import { Link } from 'react-router-dom';
import '../animations.css';

const LandingPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-white py-12 lg:py-20 page-transition">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex flex-col gap-6 flex-1 text-center lg:text-left animate-slide-in-left">
              <h1 className="text-[#111418] text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight">
                Youth Volunteering <br className="hidden lg:block" />
                <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-[#617589] text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                LaunchServe connects students aged 13-18 with meaningful volunteer opportunities from local nonprofits. Start making a difference today.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                <Link to="/opportunities" className="flex items-center justify-center rounded-full h-12 px-8 bg-primary hover:bg-primary-hover text-white text-base font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5">
                  Find Opportunities
                </Link>
                <Link to="/submit" className="flex items-center justify-center rounded-full h-12 px-8 border-2 border-primary text-primary hover:bg-blue-50 text-base font-bold transition-all">
                  Submit an Opportunity
                </Link>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-4 pt-4 border-t border-gray-100 lg:border-none lg:pt-0">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/person1/40" alt="Student avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/person2/40" alt="Student avatar" />
                  <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://picsum.photos/seed/person3/40" alt="Student avatar" />
                </div>
                <p className="text-sm text-[#617589] font-medium"><span className="text-[#111418] font-bold">500+</span> students joined this month</p>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center animate-slide-in-right">
              <div className="relative w-full max-w-[600px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 hover-lift">
                <img src="https://i.cbc.ca/1.3209819.1441050661!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_780/back-to-school-2015-mandatory-volunteer-hours.jpg" alt="Group of diverse teenagers working together on a community garden project" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-background-light py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111418] text-3xl sm:text-4xl font-bold tracking-tight mb-4">Why LaunchServe?</h2>
            <p className="text-[#617589] text-lg max-w-2xl mx-auto">We bridge the gap between eager students and local organizations to create lasting community impact.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-green-light text-accent-green flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <div>
                <h3 className="text-[#111418] text-xl font-bold mb-2">Local Opportunities</h3>
                <p className="text-[#617589] leading-relaxed">Discover nonprofits right in your neighborhood needing your help. No long commutes, just local impact.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-3xl">verified_user</span>
              </div>
              <div>
                <h3 className="text-[#111418] text-xl font-bold mb-2">Youth-Friendly</h3>
                <p className="text-[#617589] leading-relaxed">Every listed opportunity is verified as safe, educational, and appropriate for teens ages 13-18.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-4">
               <div className="w-14 h-14 rounded-2xl bg-accent-green-light text-accent-green flex items-center justify-center mb-2">
                 <span className="material-symbols-outlined text-3xl">bar_chart</span>
               </div>
               <div>
                 <h3 className="text-[#111418] text-xl font-bold mb-2">Impactful</h3>
                 <p className="text-[#617589] leading-relaxed">Track your volunteer hours and visualize the real-world difference you are making over time.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full py-16 px-4">
        <div className="max-w-[1280px] mx-auto bg-primary rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)", backgroundSize: "32px 32px" }}></div>
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 relative z-10">Ready to make a difference?</h2>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mb-10 relative z-10">Join thousands of students and nonprofits building stronger communities together.</p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link to="/opportunities" className="flex items-center justify-center rounded-full h-14 px-8 bg-white text-primary hover:bg-gray-50 text-lg font-bold transition-all shadow-lg">
              Find Opportunities
            </Link>
            <Link to="/learn-more" className="flex items-center justify-center rounded-full h-14 px-8 border-2 border-white/30 bg-primary hover:bg-white/10 text-white text-lg font-bold transition-all">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
