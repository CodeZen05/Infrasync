import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ProgressBar from '../../components/dashboard/ProgressBar';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import { seService } from '../../services/seService';
import { CheckSquare, Calendar, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SEActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await seService.getActivities();
      setActivities(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <DashboardLayout title="My Assigned Activities">
      <PageHeader
        title="My WBS Activities"
        subtitle="Work breakdown structure items allocated for site execution and daily quantity reporting."
      >
        <Link
          to="/se/progress"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-brand-purple hover:bg-purple-700 rounded-xl shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Log Progress</span>
        </Link>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading assigned activities from PostgreSQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchActivities} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {act.activityCode}
                  </span>
                  <StatusBadge status={act.status} />
                </div>

                <h3 className="text-base font-bold text-brand-navy">
                  {act.name}
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Project: {act.projectName} {act.wbs ? `• ${act.wbs}` : ''}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="block text-brand-muted font-medium">Planned Quantity</span>
                    <span className="font-bold text-brand-navy">{act.plannedQuantity} {act.unit}</span>
                  </div>
                  <div>
                    <span className="block text-brand-muted font-medium">Actual Quantity</span>
                    <span className="font-bold text-brand-navy">{act.actualQuantity} {act.unit}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Completion</span>
                    <span className="text-brand-purple">{act.progress}%</span>
                  </div>
                  <ProgressBar value={act.progress} size="md" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-brand-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {act.plannedEnd ? new Date(act.plannedEnd).toLocaleDateString() : 'Target 2026'}
                </span>

                <Link
                  to="/se/progress"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-purple hover:bg-purple-700 transition-colors shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Log DPR</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
