import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendPositive, 
  subtitle, 
  accentColor = 'blue' 
}) {
  const accentStyles = {
    blue: {
      bg: 'bg-blue-50/80 text-brand-blue border-blue-200/80',
      glow: 'from-blue-500/10 to-transparent',
      hoverBorder: 'hover:border-blue-300',
    },
    purple: {
      bg: 'bg-purple-50/80 text-brand-purple border-purple-200/80',
      glow: 'from-purple-500/10 to-transparent',
      hoverBorder: 'hover:border-purple-300',
    },
    green: {
      bg: 'bg-emerald-50/80 text-emerald-600 border-emerald-200/80',
      glow: 'from-emerald-500/10 to-transparent',
      hoverBorder: 'hover:border-emerald-300',
    },
    red: {
      bg: 'bg-rose-50/80 text-brand-danger border-rose-200/80',
      glow: 'from-rose-500/10 to-transparent',
      hoverBorder: 'hover:border-rose-300',
    },
    amber: {
      bg: 'bg-amber-50/80 text-amber-600 border-amber-200/80',
      glow: 'from-amber-500/10 to-transparent',
      hoverBorder: 'hover:border-amber-300',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.blue;

  return (
    <div className={`group relative bg-white bg-gradient-to-br from-white via-white to-slate-50/60 rounded-2xl p-5 sm:p-6 border border-slate-200/85 shadow-card hover:shadow-card-hover-xl hover-lift ${style.hoverBorder} transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-default`}>
      {/* Ambient Gradient Glow Flare */}
      <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-br ${style.glow} blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`} />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.bg} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0 shadow-2xs`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight group-hover:text-slate-900 transition-colors">
          {value}
        </div>
        
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium">
            {trend && (
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                trendPositive 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {trendPositive ? (
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                )}
                <span>{trend}</span>
              </span>
            )}
            {subtitle && <span className="truncate text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>

      {/* Micro Bottom Highlight Stripe on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
