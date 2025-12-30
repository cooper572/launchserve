import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  // Determine dashboard link based on account type
  const dashboardLink = user?.user_metadata?.account_type === 'organization' 
    ? '/organization-dashboard' 
    : '/dashboard';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-4 sm:px-6 py-4 lg:px-12">
      <Link to="/" className="flex items-center gap-3 sm:gap-4">
        <img src="/logo.png" alt="LaunchServe" className="w-8 h-8 sm:w-10 sm:h-10" />
        <h2 className="text-slate-900 text-lg sm:text-xl font-bold tracking-tight">LaunchServe</h2>
      </Link>

      {/* Desktop Navigation - Centered */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
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
        {user && (
          <Link 
            to={dashboardLink}
            className={`text-sm font-semibold transition-colors ${isActive(dashboardLink) ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
          >
            Dashboard
          </Link>
        )}
      </nav>

      {/* Auth Section */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-600">
              {user.user_metadata?.full_name || user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

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
            {user && (
              <Link 
                to={dashboardLink}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive(dashboardLink) ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 text-left"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
