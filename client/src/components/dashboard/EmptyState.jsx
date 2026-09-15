import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No records found', 
  description = 'There is currently no data to display.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="py-12 px-4 rounded-2xl bg-white border border-brand-border border-dashed text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>
      <h4 className="text-base font-bold text-brand-navy">{title}</h4>
      <p className="text-xs text-brand-muted mt-1 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
