import React from 'react';
import { 
  CalendarCheck2, 
  Sparkles, 
  GitCompare, 
  AlertOctagon, 
  ArrowRight 
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      badge: 'FEATURE 1',
      title: 'Smart Schedule Management',
      description: 'Import Excel or CSV schedules and organize activities, dates, quantities and WBS.',
      icon: CalendarCheck2,
      isAI: false,
    },
    {
      badge: 'FEATURE 2',
      title: 'AI Schedule Linking',
      description: 'Automatically connect site evidence with the correct planned activity using AI.',
      icon: Sparkles,
      isAI: true,
    },
    {
      badge: 'FEATURE 3',
      title: 'Planned vs Actual',
      description: 'Compare scheduled progress with actual execution and instantly identify variance.',
      icon: GitCompare,
      isAI: false,
    },
    {
      badge: 'FEATURE 4',
      title: 'AI Risk Insights',
      description: 'Detect potential delays, understand possible causes and receive actionable recommendations.',
      icon: AlertOctagon,
      isAI: true,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-t border-brand-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Capabilities
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-brand-navy tracking-tight">
            Everything You Need to Track Project Progress
          </h2>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative bg-brand-bg rounded-2xl p-8 border border-brand-border shadow-sm hover:shadow-card-hover transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      feature.isAI 
                        ? 'bg-purple-50 border-purple-200 text-brand-purple group-hover:bg-purple-100' 
                        : 'bg-blue-50 border-blue-200 text-brand-blue group-hover:bg-blue-100'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-white text-brand-muted border border-brand-border">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-blue transition-colors flex items-center gap-2">
                    <span>{feature.title}</span>
                    {feature.isAI && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-brand-purple border border-purple-200 uppercase tracking-wider">
                        AI
                      </span>
                    )}
                  </h3>

                  <p className="text-brand-muted text-[15px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 flex items-center gap-1 text-sm font-semibold text-brand-blue group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
