import React from 'react';
import { FileSpreadsheet, Camera, Cpu } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      badge: 'PLAN',
      title: 'Plan',
      description: 'Upload your project schedule and organize activities, timelines and planned quantities.',
      icon: FileSpreadsheet,
      accent: 'blue',
    },
    {
      step: '02',
      badge: 'CAPTURE',
      title: 'Capture',
      description: 'Upload site photos and DPRs to capture real-world execution data.',
      icon: Camera,
      accent: 'blue',
    },
    {
      step: '03',
      badge: 'CONNECT',
      title: 'Connect',
      description: 'AI links site evidence to the correct schedule activity and compares planned versus actual progress.',
      icon: Cpu,
      accent: 'purple',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-brand-bg">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue mb-2 block">
            Intelligent Workflow
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-brand-navy tracking-tight">
            From Plan to Progress
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-muted">
            Connect every stage of project execution through one intelligent workflow.
          </p>
        </div>

        {/* 3 Equal Height Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isPurple = item.accent === 'purple';
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between bg-white rounded-2xl p-8 border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                <div>
                  {/* Top Row: Icon + Step Indicator */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      isPurple 
                        ? 'bg-purple-50 border-purple-200 text-brand-purple group-hover:bg-purple-100' 
                        : 'bg-blue-50 border-blue-200 text-brand-blue group-hover:bg-blue-100'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      CARD {item.step}
                    </span>
                  </div>

                  {/* Step Title Badge */}
                  <div className="mb-3">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isPurple ? 'text-brand-purple' : 'text-brand-blue'
                    }`}>
                      {item.badge}
                    </span>
                    <h3 className="text-xl font-bold text-brand-navy mt-1">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-brand-muted text-[15px] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Subtle Step Divider Line */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted font-medium">
                  <span>Step {item.step} of 03</span>
                  <span className={`font-semibold ${isPurple ? 'text-brand-purple' : 'text-brand-blue'}`}>
                    Active Workflow →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
