import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import { pmService } from '../../services/pmService';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  User, 
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function PMApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pmService.getApprovals();
      setApprovals(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load approvals queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await pmService.approveProgress(id, 'Approved and verified by Project Manager.');
      setToast({ type: 'success', text: 'Update approved successfully! Activity progress updated.' });
      await fetchApprovals();
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Approval action failed.' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please specify corrective remarks for the Site Engineer:', 'Field survey records missing. Please attach DPR and re-submit.');
    if (reason === null) return;

    try {
      setActionLoading(true);
      await pmService.rejectProgress(id, reason);
      setToast({ type: 'success', text: 'Update rejected with feedback remarks.' });
      await fetchApprovals();
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Rejection action failed.' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <DashboardLayout title="Approvals Queue">
      <PageHeader
        title="DPR Approvals & Sign-off"
        subtitle="Review, approve, or reject daily progress submissions made by on-site engineers."
      />

      {/* Toast */}
      {toast && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-brand-danger'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs font-bold uppercase tracking-wider">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <LoadingState message="Loading approval records from PostgreSQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchApprovals} />
      ) : approvals.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No pending approvals"
          description="All site engineer progress submissions have been reviewed."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-brand-muted uppercase font-bold text-[11px] border-b border-brand-border">
                <tr>
                  <th className="py-3.5 px-4">Engineer</th>
                  <th className="py-3.5 px-4">Activity</th>
                  <th className="py-3.5 px-4">Reported Qty</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Engineer */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-brand-purple flex items-center justify-center font-bold text-xs">
                          {(typeof item.submittedBy === 'object' ? item.submittedBy?.name : item.submittedBy)?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy">{typeof item.submittedBy === 'object' ? (item.submittedBy?.name || 'Site Engineer') : (item.submittedBy || 'Site Engineer')}</p>
                          <p className="text-[11px] text-brand-muted">{typeof item.submittedBy === 'object' ? item.submittedBy?.email : (item.submittedByEmail || '')}</p>
                        </div>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.activityCode}
                          </span>
                          <span className="font-semibold text-brand-navy">{item.activityName}</span>
                        </div>
                        {item.remarks && (
                          <p className="text-[11px] text-slate-500 italic mt-1">"{item.remarks}"</p>
                        )}
                        {item.reviewRemarks && (
                          <p className="text-[11px] text-brand-blue font-medium mt-1">
                            PM Note: {item.reviewRemarks}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-brand-navy">
                        {item.actualQuantity} {item.unit}
                      </span>
                      <span className="block text-[11px] text-brand-muted">
                        of {item.plannedQuantity} {item.unit} planned
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(item.submittedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(item.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-glow-emerald active:scale-95 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleReject(item.id)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-danger bg-white hover:bg-rose-50 hover:border-rose-300 border border-slate-300 disabled:opacity-50 rounded-xl transition-all cursor-pointer active:scale-95"
                          >
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Reviewed</span>
                      )}
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
