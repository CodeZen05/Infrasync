import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import { pmService } from '../../services/pmService';
import { AlertTriangle, ShieldCheck, Clock, Lightbulb } from 'lucide-react';

export default function PMRisksPage() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRisks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pmService.getRisks();
      setRisks(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load risks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  return (
    <DashboardLayout title="Risk Management">
      <PageHeader
        title="Project Risks & Delay Forecasts"
        subtitle="Identified critical path bottlenecks, cause analysis, and actionable mitigation recommendations."
      />

      {loading ? (
        <LoadingState message="Analyzing project risks from PostgreSQL database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRisks} />
      ) : risks.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No active project risks"
          description="All milestones are executing within tolerance."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks.map((risk) => (
            <div 
              key={risk.id}
              className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {risk.activityCode || risk.activity?.activityCode || 'CIV'}
                  </span>
                  <StatusBadge status={risk.riskLevel} />
                </div>

                <h3 className="text-lg font-bold text-brand-navy">
                  {risk.activityName || risk.activity?.name || 'Foundation Construction'}
                </h3>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-muted font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-danger" />
                      Estimated Delay:
                    </span>
                    <span className="font-bold text-brand-danger">{risk.estimatedDelay}</span>
                  </div>
                  <div>
                    <span className="text-brand-muted font-medium block">Root Cause:</span>
                    <span className="text-slate-700 font-semibold">{risk.cause}</span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs">
                  <div className="flex items-center gap-1.5 text-brand-purple font-bold mb-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>Actionable Recommendation:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {risk.recommendation}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted">
                <span>Probability: {Math.round((risk.probability || 0.8) * 100)}%</span>
                <span>Logged in Phase 3 Foundation</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
