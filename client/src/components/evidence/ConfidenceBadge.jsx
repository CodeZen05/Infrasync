import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function ConfidenceBadge({ score, size = 'md', showLabel = true }) {
  if (score === null || score === undefined) return null;

  const num = Math.round(Number(score));

  let tier = {
    label: 'HIGH CONFIDENCE',
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-xs',
    bar: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    dot: 'bg-emerald-500',
    icon: ShieldCheck,
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
  };

  if (num >= 90) {
    tier = {
      label: 'HIGH CONFIDENCE',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 shadow-xs',
      bar: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
      dot: 'bg-emerald-500 animate-pulse',
      icon: ShieldCheck,
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
    };
  } else if (num >= 75) {
    tier = {
      label: 'GOOD CONFIDENCE',
      bg: 'bg-blue-500/10 border-blue-500/30 text-brand-blue shadow-xs',
      bar: 'bg-brand-blue shadow-[0_0_8px_rgba(37,99,235,0.6)]',
      dot: 'bg-brand-blue',
      icon: CheckCircle2,
      glow: 'shadow-[0_0_12px_rgba(37,99,235,0.25)]'
    };
  } else if (num >= 50) {
    tier = {
      label: 'REVIEW REQUIRED',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-800 shadow-xs',
      bar: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]'
    };
  } else {
    tier = {
      label: 'LOW CONFIDENCE',
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-700 shadow-xs',
      bar: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
      dot: 'bg-rose-500',
      icon: AlertOctagon,
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]'
    };
  }

  const Icon = tier.icon;
  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border backdrop-blur-xs transition-all duration-200 hover:scale-[1.03] ${tier.bg} ${tier.glow} ${isSmall ? 'px-2.5 py-1' : 'px-3.5 py-1.5'}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${tier.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${tier.dot}`} />
      </span>
      <Icon className={isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <div className="flex items-center gap-1.5">
        <span className={`font-extrabold tracking-tight ${isSmall ? 'text-xs' : 'text-sm'}`}>
          {num}%
        </span>
        {showLabel && (
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
            {tier.label}
          </span>
        )}
      </div>
      <div className="w-12 h-1.5 bg-slate-200/80 rounded-full overflow-hidden ml-1 hidden sm:block">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${tier.bar}`} 
          style={{ width: `${Math.max(8, num)}%` }} 
        />
      </div>
    </div>
  );
}
