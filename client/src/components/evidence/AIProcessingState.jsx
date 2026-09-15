import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileSearch, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export default function AIProcessingState({ 
  uploadPercent = 0, 
  fileName = 'site_evidence.pdf',
  evidenceType = 'DPR'
}) {
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { label: 'Secure Storage Upload', desc: `Uploading ${fileName}...`, icon: UploadCloud },
    { label: 'AI Multi-Modal Analysis', desc: `Scanning ${evidenceType} with Vision & OCR pipeline...`, icon: FileSearch },
    { label: 'Parameter Extraction', desc: 'Structuring quantities, WBS activities, and site remarks...', icon: Cpu },
    { label: 'Confidence & Anomaly Scoring', desc: 'Evaluating evidentiary certainty against baseline constraints...', icon: ShieldCheck },
    { label: 'Preparing Human Review', desc: 'Formatting verified review card...', icon: Sparkles },
  ];

  useEffect(() => {
    // Stage 0 is during active file upload
    if (uploadPercent < 100) {
      setCurrentStage(0);
      return;
    }

    // Progression once upload reaches 100%
    setCurrentStage(1);
    const t1 = setTimeout(() => setCurrentStage(2), 900);
    const t2 = setTimeout(() => setCurrentStage(3), 1800);
    const t3 = setTimeout(() => setCurrentStage(4), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [uploadPercent]);

  const ActiveIcon = stages[currentStage].icon;

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* Dynamic Animated Core */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-brand-purple/10 animate-ping opacity-75" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-blue/20 to-purple-200" />
        <div className="relative w-14 h-14 rounded-2xl bg-white shadow-md border border-purple-100 flex items-center justify-center text-brand-purple">
          <ActiveIcon className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-brand-purple text-xs font-bold uppercase tracking-wider mb-2 border border-purple-200">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>InfraSync AI Engine Active</span>
      </div>

      <h3 className="text-xl font-bold text-brand-navy mb-1">
        {stages[currentStage].label}
      </h3>
      <p className="text-xs text-brand-muted max-w-md mx-auto mb-6">
        {stages[currentStage].desc}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-8 border border-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-brand-purple transition-all duration-500 rounded-full"
          style={{ width: `${Math.max(uploadPercent * 0.3, (currentStage + 1) * 20)}%` }}
        />
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-5 gap-2 text-left">
        {stages.map((stg, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div key={idx} className="flex flex-col items-center text-center">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                  isDone 
                    ? 'bg-emerald-500 text-white shadow-2xs' 
                    : isCurrent 
                    ? 'bg-brand-purple text-white ring-4 ring-purple-100 shadow-xs' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-semibold leading-tight line-clamp-1 ${
                isCurrent ? 'text-brand-purple font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {stg.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
