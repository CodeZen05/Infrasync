import React from 'react';
import { 
  Camera, 
  Sparkles, 
  Layers, 
  BarChart3, 
  ArrowDown, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Clock
} from 'lucide-react';

export default function AIScheduleShowcase() {
  const workflowSteps = [
    {
      label: 'SITE EVIDENCE',
      desc: 'Photos, drone captures, Daily Progress Reports (DPR)',
      icon: Camera,
      badgeColor: 'bg-blue-50 text-brand-blue border-blue-200',
    },
    {
      label: 'AI ANALYSIS',
      desc: 'Computer vision & NLP extract activities and estimated quantities',
      icon: Sparkles,
      badgeColor: 'bg-purple-50 text-brand-purple border-purple-200',
      isAI: true,
    },
    {
      label: 'SCHEDULE MATCH',
      desc: 'Automatic alignment against Primavera/MS Project WBS items',
      icon: Layers,
      badgeColor: 'bg-blue-50 text-brand-blue border-blue-200',
    },
    {
      label: 'PROJECT INSIGHT',
      desc: 'Instant delta detection, variance tracking, and risk alerts',
      icon: BarChart3,
      badgeColor: 'bg-emerald-50 text-brand-success border-emerald-200',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-bg border-t border-brand-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Driven Architecture
          </span>
          <h2 className="text-[28px] sm:text-[36px] font-bold text-brand-navy tracking-tight mt-3">
            AI That Understands Site Progress
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-muted">
            Turn unstructured site evidence into structured project intelligence.
          </p>
        </div>

        {/* 2-Column Showcase: Workflow Diagram on Left, Realistic Analysis Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Workflow Diagram Left */}
          <div className="lg:col-span-5 space-y-3">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className={`p-4 rounded-xl bg-white border transition-all duration-200 ${
                    step.isAI 
                      ? 'border-purple-300 ring-1 ring-purple-100 shadow-sm' 
                      : 'border-brand-border shadow-xs'
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${step.badgeColor}`}>
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold tracking-wider ${
                            step.isAI ? 'text-brand-purple' : 'text-brand-navy'
                          }`}>
                            {step.label}
                          </span>
                          {step.isAI && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-brand-purple">
                              Core Engine
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-brand-muted mt-0.5 truncate">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow (Except after last) */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-brand-border flex items-center justify-center text-slate-400">
                        <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Realistic Analysis Card Right */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Subtle AI Purple ambient glow */}
              <div 
                className="absolute -inset-2 rounded-3xl bg-purple-500/10 blur-xl -z-10 opacity-70 pointer-events-none"
                aria-hidden="true"
              />

              <div className="bg-white rounded-2xl border-2 border-purple-200/80 shadow-xl overflow-hidden">
                {/* Header with AI purple highlight */}
                <div className="px-6 py-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">
                        AI Activity Reconciliation Analysis
                      </h4>
                      <p className="text-[11px] text-brand-muted">Automated evidence matching feed</p>
                    </div>
                  </div>

                  {/* Match Confidence Badge */}
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                      Match Confidence
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-extrabold text-brand-purple">
                      <CheckCircle2 className="w-4 h-4 text-brand-purple stroke-[2.5]" />
                      94%
                    </span>
                  </div>
                </div>

                {/* Card Content Grid */}
                <div className="p-6 space-y-6">
                  
                  {/* Row 1: Site Evidence & AI Detected Activity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Camera className="w-3.5 h-3.5 text-brand-muted" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                          Site Evidence
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-brand-navy">Foundation work</p>
                      <span className="text-xs text-brand-muted">Location: Zone A</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-purple">
                          AI Detected Activity
                        </span>
                      </div>
                      <p className="text-sm font-bold text-brand-navy">Foundation Construction</p>
                      <span className="text-xs text-brand-purple font-medium">Auto-classified via CV model</span>
                    </div>
                  </div>

                  {/* Row 2: Matched Schedule Activity */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block mb-1">
                      Matched Schedule
                    </span>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-sm font-semibold text-brand-navy">
                        CIV-023 Foundation Construction
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-brand-border text-slate-600">
                        WBS: 1.4.2.A
                      </span>
                    </div>
                  </div>

                  {/* Row 3: Planned vs Actual vs Variance Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-brand-border text-center">
                      <span className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Planned
                      </span>
                      <span className="text-base sm:text-lg font-bold text-brand-navy">80 m³</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-brand-border text-center">
                      <span className="block text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
                        Actual
                      </span>
                      <span className="text-base sm:text-lg font-bold text-brand-navy">65 m³</span>
                    </div>

                    <div className="p-3 bg-red-50/80 rounded-xl border border-red-200 text-center">
                      <span className="block text-[11px] font-semibold text-brand-danger uppercase tracking-wider mb-1">
                        Variance
                      </span>
                      <span className="text-base sm:text-lg font-bold text-brand-danger">-15 m³</span>
                    </div>
                  </div>

                  {/* Row 4: Status Indicator Alert */}
                  <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-danger" />
                      <div>
                        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mr-2">Status:</span>
                        <span className="text-sm font-bold text-brand-danger">Behind Schedule</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-white px-2.5 py-1 rounded border border-red-200">
                      Requires Site Action
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
