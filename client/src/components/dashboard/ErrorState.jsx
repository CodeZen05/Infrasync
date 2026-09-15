import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  message = 'Failed to load data from server.', 
  onRetry 
}) {
  return (
    <div className="py-12 px-4 rounded-2xl bg-red-50/50 border border-red-200 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-brand-danger mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>
      <h4 className="text-base font-bold text-brand-navy">Connection Error</h4>
      <p className="text-xs text-brand-muted mt-1 max-w-sm">{message}</p>
      
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
