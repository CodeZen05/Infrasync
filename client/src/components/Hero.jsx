import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductPreview from './ProductPreview';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isAuthenticated, user } = useAuth();

  const getStartedTarget = isAuthenticated
    ? (user?.role === 'PROJECT_MANAGER' ? '/pm/dashboard' : '/se/dashboard')
    : '/signup';

  return (
    <section id="product" className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Ambient background lighting orbs */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-500/15 to-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/2 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-brand-blue border border-blue-200/80 shadow-xs hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span className="tracking-wider uppercase font-bold text-[11px]">AI-POWERED PROJECT INTELLIGENCE</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[36px] sm:text-[44px] lg:text-[58px] font-extrabold text-brand-navy leading-[1.12] tracking-tight">
              Bridge the Gap Between{' '}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Planning &amp; Execution
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl font-normal">
              InfraSync connects project schedules with real-time site progress, helping infrastructure teams capture evidence, track actual work, identify delays, and make faster decisions.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                to={getStartedTarget}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 bg-white hover:bg-slate-50 active:scale-95 border border-slate-300 rounded-xl shadow-xs hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Explore How It Works</span>
              </a>
            </div>

            {/* Micro Trust Sub-caption */}
            <div className="pt-3 flex items-center gap-2 text-xs text-brand-muted font-medium">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <span>Built for smarter infrastructure project execution & AI verification</span>
            </div>
          </div>

          {/* Right Column: Hero Product Visual Mockup */}
          <div className="lg:col-span-6 w-full mt-4 lg:mt-0">
            <ProductPreview />
          </div>

        </div>
      </div>
    </section>
  );
}
