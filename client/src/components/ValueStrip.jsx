import React from 'react';
import { CalendarRange, Camera, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';

export default function ValueStrip() {
  const items = [
    {
      icon: CalendarRange,
      label: 'Schedule Intelligence',
    },
    {
      icon: Camera,
      label: 'Site Evidence',
    },
    {
      icon: Sparkles,
      label: 'AI Matching',
      highlightAI: true,
    },
    {
      icon: TrendingUp,
      label: 'Progress Tracking',
    },
    {
      icon: ShieldAlert,
      label: 'Risk Detection',
    },
  ];

  return (
    <section className="border-y border-brand-border bg-white py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-center">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center justify-center sm:justify-start lg:justify-center gap-3 p-2 rounded-lg text-brand-navy hover:text-brand-blue transition-colors group"
              >
                <div className={`p-2 rounded-lg ${item.highlightAI ? 'bg-purple-50 text-brand-purple' : 'bg-slate-50 text-brand-blue'} group-hover:bg-blue-50 transition-colors`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-700 group-hover:text-brand-navy whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
