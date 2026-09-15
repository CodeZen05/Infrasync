import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  AlertOctagon, 
  PlayCircle 
} from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  if (!status) return null;

  const rawStatus = typeof status === 'object'
    ? (status.riskLevel || status.status || status.name || 'UNKNOWN')
    : String(status);

  const normalized = String(rawStatus || '').toUpperCase();

  const configs = {
    // Activity / Project Statuses
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100/90',
      dot: 'bg-emerald-500 ring-2 ring-emerald-200/70',
      icon: CheckCircle2,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-blue-50/90 text-brand-blue border-blue-200/90 hover:bg-blue-100/90',
      dot: 'bg-brand-blue ring-2 ring-blue-200/70 animate-pulse',
      icon: PlayCircle,
    },
    DELAYED: {
      label: 'Delayed',
      bg: 'bg-rose-50/90 text-brand-danger border-rose-200/90 hover:bg-rose-100/90',
      dot: 'bg-brand-danger ring-2 ring-rose-200/70 animate-pulse',
      icon: AlertOctagon,
    },
    NOT_STARTED: {
      label: 'Not Started',
      bg: 'bg-slate-100/90 text-slate-600 border-slate-200/90 hover:bg-slate-200/90',
      dot: 'bg-slate-400',
      icon: Clock,
    },
    ACTIVE: {
      label: 'Active',
      bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100/90',
      dot: 'bg-emerald-500 ring-2 ring-emerald-200/70 animate-pulse',
      icon: CheckCircle2,
    },
    PLANNED: {
      label: 'Planned',
      bg: 'bg-slate-100/90 text-slate-600 border-slate-200/90 hover:bg-slate-200/90',
      dot: 'bg-slate-400',
      icon: Clock,
    },

    // Approval / DPR Statuses
    PENDING: {
      label: 'Pending Approval',
      bg: 'bg-amber-50/90 text-amber-700 border-amber-200/90 hover:bg-amber-100/90',
      dot: 'bg-amber-500 ring-2 ring-amber-200/70 animate-pulse',
      icon: Clock,
    },
    APPROVED: {
      label: 'Approved',
      bg: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100/90',
      dot: 'bg-emerald-500 ring-2 ring-emerald-200/70',
      icon: CheckCircle2,
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50/90 text-rose-700 border-rose-200/90 hover:bg-rose-100/90',
      dot: 'bg-rose-500 ring-2 ring-rose-200/70',
      icon: XCircle,
    },

    // Risk Levels
    HIGH: {
      label: 'HIGH RISK',
      bg: 'bg-red-50 text-red-700 border-red-200/90 font-bold hover:bg-red-100',
      dot: 'bg-red-600 ring-2 ring-red-200 animate-pulse',
      icon: AlertTriangle,
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/90 font-semibold hover:bg-amber-100',
      dot: 'bg-amber-500 ring-2 ring-amber-200',
      icon: AlertTriangle,
    },
    LOW: {
      label: 'LOW RISK',
      bg: 'bg-blue-50 text-blue-700 border-blue-200/90 hover:bg-blue-100',
      dot: 'bg-blue-500',
      icon: CheckCircle2,
    }
  };

  const config = configs[normalized] || {
    label: rawStatus,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: Clock,
  };

  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${padding} ${config.bg} whitespace-nowrap shadow-2xs transition-all duration-200 hover:scale-[1.03] cursor-default select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span className="tracking-tight">{config.label}</span>
    </span>
  );
}
