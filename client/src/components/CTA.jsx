import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CTA() {
  const { isAuthenticated, user } = useAuth();
  const getStartedTarget = isAuthenticated
    ? (user?.role === 'PROJECT_MANAGER' ? '/pm/dashboard' : '/se/dashboard')
    : '/signup';

  return (
    <section id="get-started" className="py-20 lg:py-28 bg-brand-blue text-white relative overflow-hidden">
      {/* Subtle background geometric pattern / circles */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <h2 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-tight text-white leading-tight">
            Turn Site Data Into Better Decisions
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto leading-relaxed">
            Connect planning, execution and AI-powered insights with InfraSync.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={getStartedTarget}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-blue-700 bg-white hover:bg-blue-50 active:scale-95 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 text-blue-700 stroke-[2.5]" />
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-200" />
              Zero infrastructure overhead
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-200" />
              Standard Excel &amp; Primavera import
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-200" />
              Enterprise-grade data security
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
