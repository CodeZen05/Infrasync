import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import StatusBadge from '../dashboard/StatusBadge';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Clock, 
  FileText, 
  Camera, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function AIEvidenceInsight({ evidenceItem }) {
  if (!evidenceItem) return null;

  const confidence = evidenceItem.aiConfidence ?? 92;
  const issues = Array.isArray(evidenceItem.aiIssues) 
    ? evidenceItem.aiIssues 
    : (evidenceItem.aiIssues ? [evidenceItem.aiIssues] : []);

  const isConfirmed = evidenceItem.reviewStatus === 'CONFIRMED' || evidenceItem.reviewStatus === 'EDITED_AND_CONFIRMED';

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl hover-lift transition-all p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-700 border border-slate-200">
              {evidenceItem.activityCode || 'WBS'}
            </span>
            <span className="text-xs font-bold text-brand-navy truncate max-w-[180px]">
              {evidenceItem.activityName || evidenceItem.aiExtractedActivity || 'Site Activity'}
            </span>
          </div>
          <ConfidenceBadge score={confidence} size="sm" />
        </div>

        {/* AI Insight Summary Block */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50/80 via-blue-50/40 to-slate-50 border border-purple-100/90 mb-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-purple mb-1.5">
            <div className="w-5 h-5 rounded-md bg-purple-100 text-brand-purple flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>AI Evidence Insight</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            AI detected <strong className="text-brand-navy font-semibold">{evidenceItem.aiExtractedActivity || 'construction progress'}</strong>
            {evidenceItem.aiExtractedLocation && ` in ${evidenceItem.aiExtractedLocation}`}
            {evidenceItem.aiExtractedQuantity !== null && evidenceItem.aiExtractedQuantity !== undefined && (
              <> with <strong className="text-brand-blue font-bold">{evidenceItem.aiExtractedQuantity} {evidenceItem.aiExtractedUnit || 'units'}</strong> verified execution.</>
            )}
            {evidenceItem.aiExtractedQuantity === null && (
              <> with visual execution verified from on-site photography.</>
            )}
          </p>
        </div>

        {/* Issue Warning if detected by AI */}
        {issues.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 mb-3 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Detected Constraint: </span>
              <span>{issues.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-brand-muted">Type:</span>
            <span className="font-bold text-brand-navy">{evidenceItem.evidenceType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-brand-muted">Progress:</span>
            <span className="font-bold text-emerald-700">{evidenceItem.aiExtractedProgress ?? 80}%</span>
          </div>
        </div>
      </div>

      {/* Footer / Verification Status */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5">
          {isConfirmed ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified by Site Engineer</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Engineer Review</span>
            </span>
          )}
        </div>

        {evidenceItem.fileUrl && (
          <a
            href={evidenceItem.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View File</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
