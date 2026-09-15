import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import { seService } from '../../services/seService';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Camera, 
  Plus,
  Loader2,
  X
} from 'lucide-react';

export default function SEProgressPage() {
  const [updates, setUpdates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    activityId: '',
    actualQuantity: '',
    actualPercentage: '',
    remarks: '',
    evidenceUrl: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [updatesRes, actsRes] = await Promise.all([
        seService.getProgress(),
        seService.getActivities(),
      ]);
      setUpdates(updatesRes || []);
      setActivities(actsRes || []);
      if (actsRes && actsRes.length > 0 && !formData.activityId) {
        setFormData(prev => ({ ...prev, activityId: actsRes[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto compute percentage if quantity changed
      if (name === 'actualQuantity') {
        const selectedAct = activities.find(a => a.id === updated.activityId);
        if (selectedAct && selectedAct.plannedQuantity > 0) {
          const qty = parseFloat(value);
          if (!isNaN(qty)) {
            updated.actualPercentage = Math.min(100, Math.round((qty / selectedAct.plannedQuantity) * 100));
          }
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.activityId) {
      setFormError('Please select an activity.');
      return;
    }
    if (!formData.actualQuantity || isNaN(parseFloat(formData.actualQuantity))) {
      setFormError('Please enter a valid actual quantity.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await seService.submitProgress({
        activityId: formData.activityId,
        actualQuantity: parseFloat(formData.actualQuantity),
        actualPercentage: formData.actualPercentage ? parseFloat(formData.actualPercentage) : null,
        remarks: formData.remarks,
        evidenceUrl: formData.evidenceUrl || null,
      });

      setShowModal(false);
      setToast({
        type: 'success',
        text: 'Progress update logged! Status is PENDING PM approval.',
      });
      setFormData({
        activityId: activities[0]?.id || '',
        actualQuantity: '',
        actualPercentage: '',
        remarks: '',
        evidenceUrl: '',
      });
      await fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to submit progress update.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <DashboardLayout title="Submit Progress">
      <PageHeader
        title="Daily Progress Reporting (DPR)"
        subtitle="Log executed physical quantities and site observations for Project Manager sign-off."
      >
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-brand-purple hover:bg-purple-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Progress</span>
        </button>
      </PageHeader>

      {/* Toast Notification */}
      {toast && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between">
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
        <LoadingState message="Fetching DPR history from PostgreSQL..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h3 className="text-base font-bold text-brand-navy">
              My Progress Updates History
            </h3>
            <span className="text-xs text-brand-muted">
              Total Submissions: {updates.length}
            </span>
          </div>

          {updates.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No DPR updates logged yet"
              description="Click Submit Progress to log your first physical quantity update."
              actionLabel="Submit DPR Now"
              onAction={() => setShowModal(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-brand-muted uppercase font-bold text-[11px] border-b border-brand-border">
                  <tr>
                    <th className="py-3 px-4">Activity</th>
                    <th className="py-3 px-4">Reported Qty</th>
                    <th className="py-3 px-4">Progress %</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">PM Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {updates.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {u.activityCode}
                          </span>
                          <span className="font-semibold text-brand-navy">{u.activityName}</span>
                        </div>
                        {u.remarks && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5">"{u.remarks}"</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-navy">
                        {u.actualQuantity} {u.unit}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-blue">
                        {u.actualPercentage ? `${u.actualPercentage}%` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(u.submittedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {u.reviewRemarks ? (
                          <span className="text-xs text-slate-700 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {u.reviewRemarks}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending review</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Submit Progress Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Submit Daily Site Progress (DPR)</h3>
                <p className="text-xs text-brand-muted">PostgreSQL live persistence</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <p className="my-3 p-3 rounded-lg bg-red-50 text-xs text-brand-danger border border-red-200">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Activity Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Select WBS Activity <span className="text-brand-danger">*</span>
                </label>
                <select
                  name="activityId"
                  value={formData.activityId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-100"
                  required
                >
                  {activities.map(act => (
                    <option key={act.id} value={act.id}>
                      {act.activityCode} - {act.name} (Planned: {act.plannedQuantity} {act.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Actual Quantity Executed <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="actualQuantity"
                    value={formData.actualQuantity}
                    onChange={handleChange}
                    placeholder="e.g. 65"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Actual Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="actualPercentage"
                    value={formData.actualPercentage}
                    onChange={handleChange}
                    placeholder="e.g. 81.2"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Site Remarks &amp; Observations
                </label>
                <textarea
                  name="remarks"
                  rows={3}
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Concrete pour completed for Pier Cap 14 & 15. Inspection report attached..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-100"
                />
              </div>

              {/* Evidence URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Site Evidence URL (Optional)
                </label>
                <input
                  type="text"
                  name="evidenceUrl"
                  value={formData.evidenceUrl}
                  onChange={handleChange}
                  placeholder="https://... or /uploads/photo-01.jpg"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-brand-purple hover:bg-purple-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Submit to PM</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
