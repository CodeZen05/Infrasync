import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut, Briefcase, HardHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './common/Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardUrl = () => {
    if (user?.role === 'PROJECT_MANAGER') return '/pm/dashboard';
    if (user?.role === 'SITE_ENGINEER') return '/se/dashboard';
    return '/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="/#product" 
              className="text-[15px] font-medium text-brand-muted hover:text-brand-navy transition-colors"
            >
              Product
            </a>
            <a 
              href="/#how-it-works" 
              className="text-[15px] font-medium text-brand-muted hover:text-brand-navy transition-colors"
            >
              How It Works
            </a>
            <a 
              href="/#features" 
              className="text-[15px] font-medium text-brand-muted hover:text-brand-navy transition-colors"
            >
              Features
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-brand-navy border border-brand-border">
                  {user?.role === 'PROJECT_MANAGER' ? (
                    <>
                      <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
                      <span>PM: {user?.name?.split(' ')[0]}</span>
                    </>
                  ) : (
                    <>
                      <HardHat className="w-3.5 h-3.5 text-brand-purple" />
                      <span>SE: {user?.name?.split(' ')[0]}</span>
                    </>
                  )}
                </span>

                <Link 
                  to={getDashboardUrl()}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md cursor-pointer"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-brand-danger hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors rounded-xl cursor-pointer"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-navy hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2">
            <a
              href="/#product"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:text-brand-navy hover:bg-slate-50 transition-colors"
            >
              Product
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:text-brand-navy hover:bg-slate-50 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-base font-medium text-brand-muted hover:text-brand-navy hover:bg-slate-50 transition-colors"
            >
              Features
            </a>
          </div>
          <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                  <span className="font-semibold text-brand-navy">{user?.name}</span>
                  <span className="text-brand-blue font-bold">{user?.role}</span>
                </div>
                <Link
                  to={getDashboardUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2.5 text-base font-medium text-brand-danger bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-base font-medium text-brand-navy border border-brand-border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
