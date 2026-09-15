import React, { useState } from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import StatusBadge from '../dashboard/StatusBadge';
import { 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Package, 
  Users, 
  Truck,
  ArrowRight,
  Info
} from 'lucide-react';

export default function AIAnalysisResult({
  analysis,
  evidence,
  activities = [],
  onConfirm,
  onDiscard,
  submitting = false
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Editable Form State pre-populated with AI extraction
  const [formData, setFormData] = useState({
    activityId: evidence?.activityId || (activities[0]?.id || ''),
    activityName: analysis?.activityName || evidence?.activityName || 'Foundation Construction',
    location: analysis?.location || 'Zone A',
    date: analysis?.date || new Date().toISOString().split('T')[0],
    quantity: analysis?.quantity ?? 65,
    unit: analysis?.unit || 'm3',
    progressPercentage: analysis?.progressPercentage ?? 81,
    workStatus: analysis?.workStatus || 'IN_PROGRESS',
    remarks: analysis?.remarks || '',
    issues: Array.isArray(analysis?.issues) ? analysis.issues.join(', ') : (analysis?.issues || ''),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleActivitySelect = (e) => {
    const selectedId = e.target.value;
    const selectedAct = activities.find(a => a.id === selectedId);
    setFormData(prev => ({
      ...prev,
      activityId: selectedId,
      activityName: selectedAct ? selectedAct.name : prev.activityName,
      unit: selectedAct?.unit || prev.unit
    }));
  };

  const handleConfirmAction = (isEdited = false) => {
    onConfirm({
      reviewAction: isEdited ? 'EDITED_AND_CONFIRMED' : 'CONFIRMED',
      verifiedData: {
        ...formData,
        quantity: formData.quantity !== '' && formData.quantity !== null ? parseFloat(formData.quantity) : null,
        progressPercentage: formData.progressPercentage !== '' && formData.progressPercentage !== null ? parseFloat(formData.progressPercentage) : null,
        issues: formData.issues ? formData.issues.split(',').map(s => s.trim()).filter(Boolean) : []
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-purple/30 shadow-card p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header with AI Badge & Confidence Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-brand-purple text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Analysis Complete</span>
            </span>
            <span className="text-xs text-brand-muted font-medium">
              • Evidence ID: {evidence?.id?.substring(0, 10)}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy">
            {formData.activityName}
          </h2>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>File: <strong className="text-brand-navy">{evidence?.fileName || 'evidence_file'}</strong></span>
            <span>•</span>
            <span>Type: <strong className="text-brand-navy">{evidence?.evidenceType}</strong></span>
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider">
            AI Extraction Confidence
          </span>
          <ConfidenceBadge score={analysis?.confidenceScore ?? 94} size="lg" />
        </div>
      </div>

      {/* Human-in-the-Loop Guidance Alert */}
      <div className="my-5 p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-brand-purple">Human Verification Notice:</span> AI extraction provides intelligent assistance. Review the detected parameters below, make necessary corrections, and confirm to push this update to the Project Manager's approval queue.
        </div>
      </div>

      {/* Structured Fields Grid (View vs Edit Mode) */}
      {!isEditing ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-brand-muted font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                Location / Zone
              </span>
              <span className="text-sm font-bold text-brand-navy">
                {formData.location || 'Site Perimeter'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-brand-muted font-medium flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                Execution Date
              </span>
              <span className="text-sm font-bold text-brand-navy">
                {formData.date}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-[11px] text-brand-blue font-medium flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5" />
                Detected Quantity
              </span>
              <span className="text-base font-extrabold text-brand-navy">
                {formData.quantity !== null ? `${formData.quantity} ${formData.unit}` : 'Quantity not in photo'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Cumulative Progress
              </span>
              <span className="text-base font-extrabold text-brand-navy">
                {formData.progressPercentage !== null ? `${formData.progressPercentage}%` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Status and WBS Mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-brand-border bg-white">
              <span className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider block mb-1.5">
                Target WBS Schedule Package
              </span>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-purple shrink-0" />
                <span className="text-sm font-bold text-brand-navy">
                  {activities.find(a => a.id === formData.activityId)?.activityCode || 'CIV-023'} - {formData.activityName}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-brand-border bg-white flex items-center justify-between">
              <div>
                <span className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider block mb-1">
                  Detected Work Status
                </span>
                <span className="text-xs text-slate-500">Physical site state</span>
              </div>
              <StatusBadge status={formData.workStatus} />
            </div>
          </div>

          {/* Issues / Shortages Alert */}
          {formData.issues && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Detected Site Issue / Constraint</span>
              </div>
              <p className="text-xs text-slate-700 font-medium ml-6">
                {formData.issues}
              </p>
            </div>
          )}

          {/* Remarks */}
          {formData.remarks && (
            <div className="p-4 rounded-xl border border-brand-border bg-slate-50/60">
              <span className="text-[11px] text-brand-muted font-semibold uppercase tracking-wider block mb-1">
                Engineering Observations & Field Remarks
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{formData.remarks}"
              </p>
            </div>
          )}

          {/* Materials & Equipment tags if extracted */}
          {(analysis?.materials?.length > 0 || analysis?.equipment?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {analysis?.materials?.length > 0 && (
                <div className="text-xs">
                  <span className="text-brand-muted font-semibold flex items-center gap-1 mb-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    Identified Materials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.materials.map((mat, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis?.equipment?.length > 0 && (
                <div className="text-xs">
                  <span className="text-brand-muted font-semibold flex items-center gap-1 mb-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    Detected Machinery:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(analysis.equipment) ? analysis.equipment : [analysis.equipment]).map((eq, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode Form */
        <form className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link to WBS Activity
              </label>
              <select
                value={formData.activityId}
                onChange={handleActivitySelect}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              >
                {activities.map(act => (
                  <option key={act.id} value={act.id}>
                    {act.activityCode} - {act.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Activity Name Override
              </label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantity ({formData.unit})
              </label>
              <input
                type="number"
                step="0.1"
                name="quantity"
                value={formData.quantity ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Progress %
              </label>
              <input
                type="number"
                step="0.1"
                name="progressPercentage"
                value={formData.progressPercentage ?? ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issues / Shortages
            </label>
            <input
              type="text"
              name="issues"
              value={formData.issues}
              onChange={handleChange}
              placeholder="e.g. Material delivery delayed, water seepage"
              className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Engineering Remarks
            </label>
            <textarea
              name="remarks"
              rows={2}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-purple"
            />
          </div>
        </form>
      )}

      {/* Action Buttons */}
      <div className="pt-6 mt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={onDiscard}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-brand-danger bg-white hover:bg-rose-50 hover:border-rose-200 border border-slate-200 rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <Trash2 className="w-4 h-4" />
          <span>Discard</span>
        </button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-brand-purple" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit & Customize'}</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleConfirmAction(isEditing)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-glow-emerald active:scale-95 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes & Confirm' : 'Confirm Analysis'}</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
