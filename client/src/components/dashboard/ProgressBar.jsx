import React from 'react';

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  showLabel = false, 
  size = 'md',
  variant = 'default' 
}) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const getGradientColor = () => {
    if (variant === 'danger') {
      return 'bg-rose-500 bg-gradient-to-r from-rose-600 to-red-500 shadow-xs shadow-rose-500/20';
    }
    if (variant === 'purple') {
      return 'bg-purple-600 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs shadow-purple-500/20';
    }
    if (variant === 'success' || percent >= 90) {
      return 'bg-emerald-500 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs shadow-emerald-500/20';
    }
    return 'bg-blue-600 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 shadow-xs shadow-blue-500/20';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
          <span className="font-semibold text-slate-600">Progress</span>
          <span className="font-extrabold text-brand-navy">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/70 shadow-inner ${heightClasses[size] || 'h-2.5'}`}>
        <div
          className={`${getGradientColor()} h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {/* Subtle Shimmer Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
