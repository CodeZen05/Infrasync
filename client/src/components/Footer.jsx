import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './common/Logo';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-400 py-14 lg:py-16 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-slate-800">
          
          {/* Left Column: Brand & Tagline */}
          <div className="max-w-md space-y-3">
            <Logo size="md" theme="dark" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Intelligent Planning-to-Execution Bridge for Infrastructure Projects
            </p>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-medium">
            <a 
              href="/#product" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Product
            </a>
            <a 
              href="/#how-it-works" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a 
              href="/#features" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <Link 
              to="/login" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="text-brand-blue hover:text-blue-400 transition-colors font-semibold"
            >
              Get Started
            </Link>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 InfraSync. All rights reserved.</p>
          <p className="text-slate-500">
            Enterprise Infrastructure Project Intelligence Platform • Phase 2 Auth Foundation
          </p>
        </div>
      </div>
    </footer>
  );
}
