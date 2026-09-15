import React from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  TrendingDown, 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function ProductPreview() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto group">
      {/* Radiant ambient blue/purple glow behind the dashboard */}
      <div 
        className="absolute -inset-2 sm:-inset-6 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-blue-500/20 blur-3xl -z-10 opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Mockup Container / Browser/App Window */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden transition-all duration-300 hover:shadow-card-hover-xl hover-lift">
        {/* Mockup Window Top Bar */}
        <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
              <Building2 className="w-3.5 h-3.5 text-brand-blue" />
              <span className="font-semibold text-brand-navy">Metro Line Extension - Package 4B</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live Database
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Section 1: PROJECT OVERVIEW */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold tracking-wider text-brand-muted uppercase">
                  Project Overview
                </h4>
              </div>
              <span className="text-xs text-brand-muted flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Updated 12m ago
              </span>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Overall Progress */}
              <div className="bg-slate-50/70 border border-brand-border rounded-xl p-3">
                <p className="text-xs text-brand-muted font-medium truncate">Overall Progress</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-brand-navy">68%</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-blue h-1.5 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Planned Progress */}
              <div className="bg-slate-50/70 border border-brand-border rounded-xl p-3">
                <p className="text-xs text-brand-muted font-medium truncate">Planned Progress</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-brand-navy">76%</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '76%' }} />
                </div>
              </div>

              {/* Variance */}
              <div className="bg-red-50/60 border border-red-100 rounded-xl p-3">
                <p className="text-xs text-brand-danger font-medium truncate">Variance</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-brand-danger">-8%</span>
                  <TrendingDown className="w-4 h-4 text-brand-danger stroke-[2.5]" />
                </div>
                <span className="text-[11px] text-red-600 font-medium">Critical Delay</span>
              </div>
            </div>

            {/* Small Realistic Progress / S-Curve Trend Bar */}
            <div className="mt-3.5 p-3 bg-white border border-brand-border rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-brand-navy">Cumulative S-Curve vs Reality</span>
                <div className="flex items-center gap-3 text-[11px] text-brand-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-slate-400"></span> Planned
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-brand-blue"></span> Actual
                  </span>
                </div>
              </div>
              
              {/* Mini visual milestone chart */}
              <div className="space-y-1.5 pt-1">
                <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-slate-300 rounded-full" 
                    style={{ width: '76%' }} 
                    title="Planned: 76%"
                  />
                  <div 
                    className="absolute top-0 left-0 h-full bg-brand-blue rounded-full shadow-sm" 
                    style={{ width: '68%' }} 
                    title="Actual: 68%"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-brand-muted pt-0.5">
                  <span>Piling (100%)</span>
                  <span className="font-medium text-brand-navy">Foundation (68%)</span>
                  <span>Superstructure (0%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI INSIGHT & MATCH CARD */}
          <div className="rounded-xl border border-purple-200/90 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 shadow-xs overflow-hidden hover:border-brand-purple/50 transition-all">
            {/* Header: AI Insight Tag */}
            <div className="px-4 py-2.5 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple" />
                </span>
                <span className="text-xs font-bold tracking-wider text-brand-purple uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  AI Site Intelligence
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                HIGH RISK DELAY
              </span>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-navy">Foundation Construction</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">CIV-023</span>
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5 font-medium">Pier Cap 14 to 18 • Zone A</p>
                </div>

                {/* AI Match Badge */}
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100/70 text-brand-purple border border-purple-200 shadow-2xs">
                    <Sparkles className="w-3 h-3" />
                    <span>AI MATCH: 94%</span>
                  </div>
                </div>
              </div>

              {/* Quantities Comparison Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/80 text-center shadow-2xs">
                <div className="border-r border-slate-200 pr-2">
                  <span className="block text-[11px] text-brand-muted font-medium uppercase tracking-wider">Planned</span>
                  <span className="text-sm font-bold text-brand-navy">80 m³</span>
                </div>
                <div className="border-r border-slate-200 pr-2">
                  <span className="block text-[11px] text-brand-muted font-medium uppercase tracking-wider">Actual</span>
                  <span className="text-sm font-bold text-brand-navy">65 m³</span>
                </div>
                <div>
                  <span className="block text-[11px] text-brand-muted font-medium uppercase tracking-wider">Status</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-danger">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-danger" />
                    Behind Schedule
                  </span>
                </div>
              </div>

              {/* Micro Status Summary Footer */}
              <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1 border-t border-dashed border-slate-200">
                <span className="font-medium">Verified via 3 Site DPRs &amp; Drone Survey</span>
                <span className="text-brand-blue font-bold hover:underline cursor-pointer flex items-center">
                  Review Evidence <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
