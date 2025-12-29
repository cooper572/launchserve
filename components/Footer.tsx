import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="LaunchServe" className="w-10 h-10" />
              <h3 className="text-xl font-bold">LaunchServe</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting students with meaningful volunteer opportunities to make a difference.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                Home
              </Link>
              <Link to="/opportunities" className="text-slate-400 hover:text-white text-sm transition-colors">
                Find Opportunities
              </Link>
              <Link to="/submit" className="text-slate-400 hover:text-white text-sm transition-colors">
                Submit Opportunity
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Get in Touch</h4>
            <p className="text-slate-400 text-sm">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          <p>&copy; 2025 LaunchServe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
