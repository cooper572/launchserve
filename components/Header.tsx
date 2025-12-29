import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-4 sm:px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-3 sm:gap-4">
        <img src="/logo.png" alt="LaunchServe" className="w-8 h-8 sm:w-10 sm:h-10" />
        <h2 className="text-slate-900 text-lg sm:text-xl font-bold tracking-tight">LaunchServe</h2>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <Link 
          to="/" 
          className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
        >
          Home
        </Link>
        <Link 
          to="/opportunities" 
          className={`text-sm font-semibold transition-colors ${isActive('/opportunities') ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
        >
          Opportunities
        </Link>
        <Link 
          to="/submit" 
          className={`text-sm font-semibold transition-colors ${isActive('/submit') ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
        >
          Submit Opportunity
        </Link>
      </nav>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-2xl">
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden">
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Home
            </Link>
            <Link 
              to="/opportunities" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive('/opportunities') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Opportunities
            </Link>
            <Link 
              to="/submit" 
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive('/submit') ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Submit Opportunity
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
