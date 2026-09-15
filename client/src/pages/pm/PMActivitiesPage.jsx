import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ProgressBar from '../../components/dashboard/ProgressBar';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import { pmService } from '../../services/pmService';
import { CheckSquare, Search, Filter } from 'lucide-react';

export default function PMActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pmService.getActivities();
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

  const filtered = activities.filter(act => 
    act.name?.toLowerCase().includes(search.toLowerCase()) ||
    act.activityCode?.toLowerCase().includes(search.toLowerCase()) ||
    act.wbs?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Activities">
      <PageHeader
        title="Schedule Activities & WBS"
        subtitle="Full planned vs actual progress tracking across all infrastructure packages."
      />

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, name, or WBS..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue"
          />
        </div>
        <span className="text-xs text-brand-muted font-medium">
          Showing {filtered.length} of {activities.length} activities
        </span>
      </div>

      {loading ? (
        <LoadingState message="Loading activities from PostgreSQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchActivities} />
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-brand-muted uppercase font-bold text-[11px] border-b border-brand-border">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Activity Name</th>
                  <th className="py-3 px-4">WBS</th>
                  <th className="py-3 px-4">Planned Qty</th>
                  <th className="py-3 px-4">Actual Qty</th>
                  <th className="py-3 px-4">Completion</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                      {act.activityCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-navy">
                      {act.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {act.wbs}
                    </td>
                    <td className="py-3.5 px-4">
                      {act.plannedQuantity} {act.unit}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy">
                      {act.actualQuantity} {act.unit}
                    </td>
                    <td className="py-3.5 px-4 w-36">
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span>{act.progressPercent}%</span>
                      </div>
                      <ProgressBar value={act.progressPercent} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {act.assignedTo}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={act.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
