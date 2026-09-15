import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import ProgressBar from '../components/dashboard/ProgressBar';
import PageHeader from '../components/dashboard/PageHeader';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';
import EmptyState from '../components/dashboard/EmptyState';
import { pmService } from '../services/pmService';
import { 
  Building2, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight, 
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Link } from 'react-router-dom';

// Custom Luxury Tooltip for S-Curve Chart
const CustomSCurveTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const plannedVal = payload.find(p => p.dataKey === 'planned')?.value;
    const actualVal = payload.find(p => p.dataKey === 'actual')?.value;
    const variance = actualVal !== undefined && plannedVal !== undefined ? actualVal - plannedVal : null;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-white/10 text-xs min-w-[180px] space-y-2 animate-fade-slide-up">
        <p className="font-mono font-bold text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10 pb-1.5">
          {label}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Planned
            </span>
            <span className="font-bold text-slate-200">{plannedVal}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              Actual
            </span>
            <span className="font-bold text-blue-300">{actualVal}%</span>
          </div>
          {variance !== null && (
            <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-4 text-[11px]">
              <span className="text-slate-400">Schedule Delta:</span>
              <span className={`font-bold ${variance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {variance > 0 ? `+${variance}% Ahead` : variance === 0 ? 'On Track' : `${variance}% Behind`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function PMDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await pmService.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load PM dashboard:', err);
      setError(err.message || 'Failed to connect to PostgreSQL / API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (updateId) => {
    try {
      setActionLoading(true);
      await pmService.approveProgress(updateId, 'Approved by Project Manager.');
      setActionMessage({ type: 'success', text: 'Progress update approved and activity progress updated!' });
      await fetchDashboardData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to approve update.' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  const handleReject = async (updateId) => {
    const remarks = prompt('Enter rejection reason for Site Engineer:', 'Measurements need verification against site survey.');
    if (remarks === null) return;

    try {
      setActionLoading(true);
      await pmService.rejectProgress(updateId, remarks);
      setActionMessage({ type: 'success', text: 'Progress update rejected with corrective remarks.' });
      await fetchDashboardData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to reject update.' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Project Overview">
        <LoadingState message="Fetching live project intelligence from database..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Project Overview">
        <ErrorState message={error} onRetry={fetchDashboardData} />
      </DashboardLayout>
    );
  }

  const { kpis, projectOverview, progressChart, recentActivities, risks, pendingApprovals } = data || {};

  return (
    <DashboardLayout title="Project Overview" projectName={projectOverview?.name}>
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center justify-between shadow-md transition-all animate-fade-slide-up ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50/90 backdrop-blur-md border-emerald-200 text-emerald-800' 
            : 'bg-red-50/90 backdrop-blur-md border-red-200 text-brand-danger'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${actionMessage.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold">{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs font-bold uppercase tracking-wider hover:opacity-75 transition-opacity px-2 py-1">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Project Overview"
        subtitle="Monitor project execution, progress velocity, and mitigation risks."
      >
        <Link
          to="/pm/projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </Link>
      </PageHeader>

      {/* 1. KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Total Projects"
          value={kpis?.totalProjects ?? 2}
          icon={Building2}
          subtitle="Enterprise portfolio"
          accentColor="blue"
        />
        <StatCard
          title="Active Projects"
          value={kpis?.activeProjects ?? 2}
          icon={Activity}
          subtitle="Currently under construction"
          accentColor="green"
        />
        <StatCard
          title="Overall Progress"
          value={`${kpis?.overallProgress ?? 68}%`}
          icon={TrendingUp}
          trend="-8% Variance"
          trendPositive={false}
          subtitle="Planned: 76%"
          accentColor="purple"
        />
        <StatCard
          title="At-Risk Activities"
          value={kpis?.atRiskActivities ?? 3}
          icon={AlertTriangle}
          subtitle="Requires PM mitigation"
          accentColor="red"
        />
      </div>

      {/* 2. Main Project Summary Card */}
      {projectOverview && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl hover-lift transition-all mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  PRIMARY FOCUS
                </span>
                <StatusBadge status={projectOverview.status} />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
                {projectOverview.name}
              </h3>
              <p className="text-xs text-brand-muted mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                <span>{projectOverview.location}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="block text-brand-muted font-medium text-[11px]">Start Date</span>
                <span className="font-bold text-brand-navy">{projectOverview.startDate}</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200">
                <span className="block text-brand-muted font-medium text-[11px]">Target Completion</span>
                <span className="font-bold text-brand-navy">{projectOverview.endDate}</span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/90 shadow-2xs">
                <span className="block text-brand-blue font-bold text-[11px]">Current Progress</span>
                <span className="text-lg font-extrabold text-brand-navy">{projectOverview.overallProgress}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-brand-navy">Cumulative Project Velocity</span>
              <span className="text-brand-blue font-bold">{projectOverview.overallProgress}% Executed</span>
            </div>
            <ProgressBar value={projectOverview.overallProgress} size="lg" />
          </div>
        </div>
      )}

      {/* 3. Recharts Progress Chart (Planned vs Actual Progress) */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy tracking-tight">
              Planned vs Actual Progress (S-Curve)
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Cumulative milestone comparison across project lifecycle
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 text-slate-600 border border-slate-200">
              <span className="w-2.5 h-0.5 bg-slate-400 inline-block rounded-full" /> Planned Baseline
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-brand-blue border border-blue-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue" />
              </span>
              Actual Site Execution
            </span>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressChart} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomSCurveTooltip />} />
              <Line 
                type="monotone" 
                dataKey="planned" 
                name="Planned Progress" 
                stroke="#94A3B8" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={{ r: 3, strokeWidth: 1 }} 
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="Actual Progress" 
                stroke="#2563EB" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#FFFFFF' }} 
                activeDot={{ r: 7, fill: '#2563EB', stroke: '#93C5FD', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Two Columns: Pending Approvals & Project Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Pending Approvals List */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  Pending Approvals
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">Site Engineer DPR submissions awaiting sign-off</p>
              </div>
              <Link 
                to="/pm/approvals" 
                className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {pendingApprovals && pendingApprovals.length > 0 ? (
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-card-hover hover-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">
                          {item.activityCode}
                        </span>
                        <span className="text-sm font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                          {item.activityName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5">
                        Reported: <strong className="text-brand-navy font-bold">{item.actualQuantity} {item.unit}</strong> • By {typeof item.submittedBy === 'object' ? (item.submittedBy?.name || 'Site Engineer') : (item.submittedBy || 'Site Engineer')}
                      </p>
                      {item.remarks && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-white/60 px-2 py-1 rounded-md border border-slate-100">"{item.remarks}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleApprove(item.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-glow-emerald active:scale-95 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleReject(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-danger bg-white hover:bg-rose-50 hover:border-rose-200 border border-slate-200 disabled:opacity-50 rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={CheckCircle2}
                title="You're all caught up"
                description="No pending progress submissions waiting for review."
              />
            )}
          </div>
        </div>

        {/* Top Project Risks Panel */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-50 text-brand-danger flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  Project Risks
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">Critical path delay warnings</p>
              </div>
              <Link 
                to="/pm/risks" 
                className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {risks && risks.length > 0 ? (
              <div className="space-y-3.5">
                {risks.map((risk) => (
                  <div key={risk.id} className="p-4 rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-slate-50/50 hover:border-rose-200 hover-lift transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-navy">
                        {risk.activityName || risk.activity?.name || 'Foundation Construction'}
                      </span>
                      <StatusBadge status={risk.riskLevel} size="sm" />
                    </div>
                    
                    <div className="text-xs text-slate-600 space-y-1.5 pt-0.5">
                      <p className="flex items-center justify-between"><span className="text-slate-500 font-medium">Estimated Delay:</span> <strong className="text-brand-danger">{risk.estimatedDelay}</strong></p>
                      <p className="text-[11px] text-slate-600 leading-snug"><strong className="text-slate-700">Cause:</strong> {risk.cause}</p>
                      <p className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-100 leading-snug"><strong className="text-emerald-900">Mitigation:</strong> {risk.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={CheckCircle}
                title="No active risks"
                description="All activities are executing according to baseline schedule."
              />
            )}
          </div>
        </div>

      </div>

      {/* 5. Recent Activities Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy">
              Recent Activities
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">WBS execution, planned vs actual variance tracking</p>
          </div>
          <Link 
            to="/pm/activities" 
            className="text-xs font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <span>View all activities</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-slate-600 uppercase font-bold text-[11px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-3">Code</th>
                <th className="py-3.5 px-3">Activity Name</th>
                <th className="py-3.5 px-3">WBS</th>
                <th className="py-3.5 px-3">Planned</th>
                <th className="py-3.5 px-3">Actual</th>
                <th className="py-3.5 px-3">Variance</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivities && recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-3.5 px-3 font-mono font-bold text-brand-navy">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                      {act.activityCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-brand-navy group-hover:text-brand-blue transition-colors">
                    {act.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                    {act.wbs}
                  </td>
                  <td className="py-3.5 px-3 font-medium">
                    {act.plannedPercentage} ({act.plannedQuantity} {act.unit})
                  </td>
                  <td className="py-3.5 px-3 font-bold text-brand-navy">
                    {act.actualPercentage} ({act.actualQuantity} {act.unit})
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ${
                      act.variance.startsWith('-') 
                        ? 'text-rose-700 bg-rose-50 border border-rose-200' 
                        : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    }`}>
                      {act.variance}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={act.status} />
                  </td>
                  <td className="py-3.5 px-3">
                    {act.risk ? <StatusBadge status={act.risk} /> : <span className="text-slate-400 font-mono">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
