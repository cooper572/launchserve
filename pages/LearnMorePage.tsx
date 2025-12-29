import React from 'react';
import { Link } from 'react-router-dom';
import '../animations.css';

const LearnMorePage: React.FC = () => {
  return (
    <div className="bg-background-light page-transition">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background-light py-16 sm:py-24">
        <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-48 -left-24 h-[300px] w-[300px] rounded-full bg-accent-green/10 blur-3xl"></div>
        
        <div className="layout-container mx-auto px-6 lg:px-20 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 flex flex-col gap-6 text-left z-10 animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">For Students & Nonprofits</span>
              </div>
              <h1 className="text-[#111418] text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Empowering the Next Generation of <span className="text-primary">Changemakers</span>
              </h1>
              <p className="text-[#617589] text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
                LaunchServe bridges the gap between ambitious students and local nonprofits needing a helping hand. Connect with real opportunities in your community.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link to="/opportunities" className="flex items-center justify-center rounded-xl h-12 px-8 bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]">
                  I'm a Student
                </Link>
                <Link to="/submit" className="flex items-center justify-center rounded-xl h-12 px-8 bg-white border border-[#dbe0e6] hover:bg-[#f8f9fa] text-[#111418] text-base font-bold transition-all hover:shadow-md">
                  I'm a Nonprofit
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full z-10 animate-slide-in-right">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                <img alt="Volunteers working together outside" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEskrnDRTvnlqq4Ihc-Hyv4mkkte4gGgfYhAQCJ_0kh3yTkfh_ha7ZwHWKLq2_1YTHdJivrX8KkHmEgxP2XyECVtXqOQGFeWGzlI_Wb1akAmoZ2vkTGq46dZGT6oQGQ_R62gMRN6j9w48C5A1Ve4A67FOaIJ49kAvI3Nka8ZyzabJcPz0RS_jZ8IxazYQpUXReadXuG_ff9Z0o5bdvDD1L8Wcakz4q0g1QcPAzyOFExcDZSAzKa787Z-JyV38MzWv3J3rhjSkeiNx7" />
                
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/50 flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <span className="material-symbols-outlined">volunteer_activism</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111418]">500+ Hours Volunteered</p>
                    <p className="text-xs text-[#617589]">This month alone across our partner network</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-background-off py-20">
        <div className="layout-container mx-auto px-6 lg:px-20 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
            <h2 className="text-[#111418] text-3xl font-bold leading-tight mb-4">Why Choose LaunchServe?</h2>
            <p className="text-[#617589] text-lg">We focus on creating meaningful connections that benefit everyone involved, fostering a community of trust and growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col items-center text-center group animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl">location_on</span>
              </div>
              <h3 className="text-xl font-bold text-[#111418] mb-3">Local Impact</h3>
              <p className="text-[#617589] leading-relaxed">
                Make a difference in your own backyard by connecting with verified organizations right in your neighborhood.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col items-center text-center group animate-fade-in-up animate-delay-100">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl">sentiment_satisfied</span>
              </div>
              <h3 className="text-xl font-bold text-[#111418] mb-3">Youth-Friendly</h3>
              <p className="text-[#617589] leading-relaxed">
                Curated opportunities specifically designed for ages 13-18, ensuring safety, relevance, and age-appropriate tasks.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e5e7eb] hover:shadow-md transition-shadow flex flex-col items-center text-center group animate-fade-in-up animate-delay-200">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined !text-3xl">star</span>
              </div>
              <h3 className="text-xl font-bold text-[#111418] mb-3">Meaningful Work</h3>
              <p className="text-[#617589] leading-relaxed">
                Real work that matters. We prioritize roles that offer genuine experience and skill-building, not just busy work.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Benefits Section */}
      <div className="bg-background-off py-24">
        <div className="layout-container mx-auto px-6 lg:px-20 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* For Students */}
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h2 className="text-3xl font-bold text-[#111418]">For Students</h2>
              <p className="text-[#617589] text-lg">LaunchServe isn't just about giving back; it's about growing forward. Build your future while helping others.</p>
              <ul className="flex flex-col gap-4 mt-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Earn Service Hours</h4>
                    <p className="text-sm text-[#617589]">Track and verify hours easily for school requirements or clubs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Build Your Resume</h4>
                    <p className="text-sm text-[#617589]">Gain real-world experience to stand out on college applications.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Leadership Skills</h4>
                    <p className="text-sm text-[#617589]">Take ownership of projects and learn to lead within a team.</p>
                  </div>
                </li>
              </ul>
              <Link to="/opportunities" className="mt-4 w-fit text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Learn more about student benefits <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            {/* For Nonprofits */}
            <div className="flex flex-col gap-6 md:border-l md:pl-12 border-gray-200 animate-fade-in-up animate-delay-100">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600 mb-2">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <h2 className="text-3xl font-bold text-[#111418]">For Nonprofits</h2>
              <p className="text-[#617589] text-lg">Connect with a passionate, energetic volunteer base ready to support your mission with modern skills.</p>
              <ul className="flex flex-col gap-4 mt-2">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Energetic Volunteers</h4>
                    <p className="text-sm text-[#617589]">Access a pool of motivated youth eager to make a difference.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Tech-Savvy Help</h4>
                    <p className="text-sm text-[#617589]">Utilize digital natives for social media, data entry, and tech support.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                  <div>
                    <h4 className="font-bold text-[#111418]">Community Engagement</h4>
                    <p className="text-sm text-[#617589]">Build lasting relationships with the next generation of donors and advocates.</p>
                  </div>
                </li>
              </ul>
              <Link to="/submit" className="mt-4 w-fit text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Partner with us today <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="layout-container mx-auto px-6 lg:px-20 max-w-4xl">
          <h2 className="text-[#111418] text-3xl font-bold leading-tight mb-10 text-center animate-fade-in-up">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-4">
            <details className="group bg-background-off rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden animate-fade-in-up">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#111418]">
                <h3 className="text-lg font-bold">Is LaunchServe free for students?</h3>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-[#617589]">
                Yes! LaunchServe is completely free for students looking for volunteer opportunities. Our mission is to make service accessible to everyone.
              </p>
            </details>
            
            <details className="group bg-background-off rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden animate-fade-in-up animate-delay-100">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#111418]">
                <h3 className="text-lg font-bold">How old do I have to be to join?</h3>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-[#617589]">
                LaunchServe is designed specifically for students aged 13-18. Some opportunities may have specific age requirements (e.g., 16+), which will be clearly listed.
              </p>
            </details>
            
            <details className="group bg-background-off rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden animate-fade-in-up animate-delay-200">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#111418]">
                <h3 className="text-lg font-bold">How do nonprofits verify hours?</h3>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-[#617589]">
                After completing a volunteer shift, the nonprofit supervisor can digitally sign off on your hours directly through the LaunchServe platform, generating a verified certificate for you.
              </p>
            </details>
            
            <details className="group bg-background-off rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden animate-fade-in-up animate-delay-300">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-[#111418]">
                <h3 className="text-lg font-bold">What kind of organizations are on the platform?</h3>
                <span className="material-symbols-outlined transition duration-300 group-open:-rotate-180">expand_more</span>
              </summary>
              <p className="mt-4 leading-relaxed text-[#617589]">
                We partner with verified 501(c)(3) nonprofits, schools, and community organizations. This ranges from food banks and animal shelters to libraries and environmental groups.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20 text-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 animate-scale-in">
          <h2 className="text-white text-3xl md:text-4xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-white/90 text-lg max-w-xl">Join hundreds of students and local organizations building a better community together.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Link to="/opportunities" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-xl shadow-lg transition-colors w-full sm:w-auto">
              Sign Up as Student
            </Link>
            <Link to="/submit" className="bg-primary border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-xl transition-colors w-full sm:w-auto">
              Register Nonprofit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;
