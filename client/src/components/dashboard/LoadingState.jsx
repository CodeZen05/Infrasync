import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading infrastructure data from PostgreSQL...' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-3" />
      <p className="text-sm font-semibold text-brand-navy">{message}</p>
      <p className="text-xs text-brand-muted mt-1">Connecting to InfraSync project services</p>
    </div>
  );
}
