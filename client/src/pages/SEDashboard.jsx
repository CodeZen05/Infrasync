import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import StatusBadge from '../components/dashboard/StatusBadge';
import ProgressBar from '../components/dashboard/ProgressBar';
import PageHeader from '../components/dashboard/PageHeader';
import LoadingState from '../components/dashboard/LoadingState';
import ErrorState from '../components/dashboard/ErrorState';
import EmptyState from '../components/dashboard/EmptyState';
import { seService } from '../services/seService';
import { 
  CheckSquare, 
  Clock, 
  Send, 
  CheckCircle, 
  Building2, 
  Calendar, 
  ArrowRight,
  HardHat,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SEDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSEDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await seService.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load SE dashboard:', err);
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Site Dashboard">
        <LoadingState message="Loading site assignments from PostgreSQL database..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="My Site Dashboard">
        <ErrorState message={error} onRetry={fetchSEDashboard} />
      </DashboardLayout>
    );
  }

  const { kpis, assignedActivities, recentUpdates, projects } = data || {};
  const currentProjectName = projects?.[0]?.name || 'Delhi Metro Expansion';

  return (
    <DashboardLayout title="My Site Dashboard" projectName={currentProjectName}>
      <PageHeader
        title="My Site Dashboard"
        subtitle="Track assigned activities and report actual site progress with AI evidence."
      >
        <Link
          to="/se/progress"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-purple hover:bg-purple-700 bg-gradient-to-r from-brand-purple to-purple-700 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit Progress (DPR)</span>
        </Link>
      </PageHeader>

      {/* 1. SE KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Assigned Activities"
          value={kpis?.assignedActivities ?? 6}
          icon={CheckSquare}
          subtitle="Assigned WBS milestones"
          accentColor="purple"
        />
        <StatCard
          title="Completed"
          value={kpis?.completed ?? 2}
          icon={CheckCircle}
          subtitle="Signed-off by PM"
          accentColor="green"
        />
        <StatCard
          title="In Progress"
          value={kpis?.inProgress ?? 3}
          icon={Clock}
          subtitle="Active on site today"
          accentColor="blue"
        />
        <StatCard
          title="Pending Updates"
          value={kpis?.pendingUpdates ?? 1}
          icon={Send}
          subtitle="Awaiting PM sign-off"
          accentColor="amber"
        />
      </div>

      {/* 2. My Assigned Activities */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all mb-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-50 text-brand-purple flex items-center justify-center">
                <HardHat className="w-3.5 h-3.5" />
              </span>
              My Assigned Activities
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">Target execution quantities and baseline due dates</p>
          </div>
          <Link
            to="/se/activities"
            className="text-xs font-bold text-brand-purple hover:text-purple-700 flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/90 text-slate-600 uppercase font-bold text-[11px] tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3.5 px-3">Code</th>
                <th className="py-3.5 px-3">Activity Name</th>
                <th className="py-3.5 px-3">Planned Qty</th>
                <th className="py-3.5 px-3">Actual Qty</th>
                <th className="py-3.5 px-3">Progress</th>
                <th className="py-3.5 px-3">Target Date</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignedActivities && assignedActivities.map((act) => (
                <tr key={act.id} className="hover:bg-purple-50/30 transition-colors group">
                  <td className="py-3.5 px-3 font-mono font-bold text-brand-navy">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                      {act.activityCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-brand-navy group-hover:text-brand-purple transition-colors">
                    {act.name}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {act.plannedQuantity} {act.unit}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-brand-navy">
                    {act.actualQuantity} {act.unit}
                  </td>
                  <td className="py-3.5 px-3 w-36">
                    <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                      <span>{act.progress}</span>
                    </div>
                    <ProgressBar value={act.progressValue} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 font-medium">
                    {act.dueDate}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={act.status} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      to="/se/progress"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-brand-purple hover:text-purple-800 border border-purple-200/80 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Log DPR</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Recent Progress Updates Submitted by This SE */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-brand-navy">
              My Recent Progress Submissions
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">Status and comments from Project Manager review</p>
          </div>
          <Link
            to="/se/progress"
            className="text-xs font-bold text-brand-purple hover:text-purple-700 flex items-center gap-1 group py-1 px-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <span>Submit new update</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {recentUpdates && recentUpdates.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentUpdates.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-3 rounded-xl transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {item.activityCode}
                    </span>
                    <span className="text-sm font-bold text-brand-navy">
                      {item.activityName}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5">
                    Logged: <strong className="text-brand-navy font-bold">{item.actualQuantity} units</strong> ({item.actualPercentage}%) • Submitted {new Date(item.submittedDate).toLocaleDateString()}
                  </p>
                  {item.remarks && (
                    <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">"{item.remarks}"</p>
                  )}
                  {item.reviewRemarks && (
                    <p className="text-xs font-semibold text-brand-blue mt-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                      PM Feedback: {item.reviewRemarks}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-100/70 px-2 py-1 rounded-md">
                    ID: {item.id.substring(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Send}
            title="No progress updates submitted yet"
            description="Log your daily progress report (DPR) quantities to update the master project schedule."
            actionLabel="Submit First DPR"
            onAction={() => window.location.href = '/se/progress'}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
