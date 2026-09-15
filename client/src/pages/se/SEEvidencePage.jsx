import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import EmptyState from '../../components/dashboard/EmptyState';
import ConfidenceBadge from '../../components/evidence/ConfidenceBadge';
import AIProcessingState from '../../components/evidence/AIProcessingState';
import AIAnalysisResult from '../../components/evidence/AIAnalysisResult';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { evidenceService } from '../../services/evidenceService';
import { seService } from '../../services/seService';
import { 
  Camera, 
  FileText, 
  UploadCloud, 
  Plus, 
  Calendar, 
  Tag, 
  X, 
  Loader2,
  CheckCircle2, 
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Layers,
  HelpCircle,
  Eye
} from 'lucide-react';

function EvidenceThumbnail({ item }) {
  const [hasError, setHasError] = useState(false);
  const isImage = item.evidenceType === 'PHOTO' || 
    (item.fileUrl && (
      item.fileUrl.endsWith('.jpg') || 
      item.fileUrl.endsWith('.jpeg') || 
      item.fileUrl.endsWith('.png') || 
      item.fileUrl.includes('images.unsplash') ||
      item.fileUrl.includes('/uploads/')
    ));

  if (isImage && item.fileUrl && !hasError) {
    return (
      <img
        src={item.fileUrl}
        alt={item.description || item.fileName || 'Site capture'}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
      {item.evidenceType === 'DPR' ? (
        <FileText className="w-12 h-12 text-brand-blue" />
      ) : (
        <ImageIcon className="w-12 h-12 text-purple-400" />
      )}
      <span className="text-xs font-mono font-medium text-slate-600 truncate max-w-[200px]">
        {item.fileName || `${item.evidenceType} File`}
      </span>
    </div>
  );
}

export default function SEEvidencePage() {
  const [evidenceList, setEvidenceList] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [aiEngineStatus, setAiEngineStatus] = useState({ mode: 'MOCK_AI', liveAIAvailable: false });

  // Upload & Workflow State
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [evidenceType, setEvidenceType] = useState('DPR');
  const [customDescription, setCustomDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // AI Pipeline State: 'IDLE' | 'PROCESSING' | 'REVIEW'
  const [flowState, setFlowState] = useState('IDLE');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [currentEvidence, setCurrentEvidence] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);

  // Inspector Modal for existing evidence
  const [inspectingItem, setInspectingItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [evList, actList, aiStatus] = await Promise.all([
        evidenceService.getMyEvidence(),
        seService.getActivities(),
        evidenceService.getAIStatus().catch(() => ({ mode: 'MOCK_AI' }))
      ]);

      setEvidenceList(evList || []);
      setActivities(actList || []);
      setAiEngineStatus(aiStatus);

      if (actList && actList.length > 0 && !selectedActivityId) {
        // Default to Foundation Construction (CIV-023) if present
        const foundationAct = actList.find(a => a.activityCode === 'CIV-023');
        setSelectedActivityId(foundationAct ? foundationAct.id : actList[0].id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load site evidence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(ext)) {
      alert('Unsupported format. Please select a JPG, JPEG, PNG, or PDF file.');
      return;
    }

    setSelectedFile(file);
    // Auto-detect evidence type
    if (ext === 'pdf') {
      setEvidenceType('DPR');
    } else {
      setEvidenceType('PHOTO');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      alert('Please choose a site photo or DPR document first.');
      return;
    }

    try {
      setFlowState('PROCESSING');
      setUploadPercent(0);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('evidenceType', evidenceType);
      formData.append('activityId', selectedActivityId || '');
      formData.append('description', customDescription);
      formData.append('capturedDate', new Date().toISOString().split('T')[0]);

      const res = await evidenceService.uploadAndAnalyze(formData, (percent) => {
        setUploadPercent(percent);
      });

      setCurrentEvidence(res.evidence);
      setCurrentAnalysis(res.analysis);

      // Transition smoothly into review state
      setTimeout(() => {
        setFlowState('REVIEW');
      }, 1000);

    } catch (err) {
      alert(err.message || 'AI analysis failed. You can still enter site details manually.');
      setFlowState('IDLE');
    }
  };

  const handleConfirmReview = async ({ reviewAction, verifiedData }) => {
    if (!currentEvidence) return;

    try {
      setActionSubmitting(true);
      const res = await evidenceService.reviewEvidence(
        currentEvidence.id,
        reviewAction,
        verifiedData
      );

      setToast({
        type: 'success',
        text: reviewAction === 'REJECTED'
          ? 'AI extraction discarded.'
          : 'Verified site evidence logged and Progress Update queued for Project Manager approval!'
      });

      // Reset flow
      setFlowState('IDLE');
      setSelectedFile(null);
      setCurrentEvidence(null);
      setCurrentAnalysis(null);
      setCustomDescription('');

      // Refresh list
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to submit evidence verification.');
    } finally {
      setActionSubmitting(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleDiscard = () => {
    if (confirm('Discard this AI analysis session? The uploaded file will remain logged.')) {
      setFlowState('IDLE');
      setSelectedFile(null);
      setCurrentEvidence(null);
      setCurrentAnalysis(null);
    }
  };

  return (
    <DashboardLayout title="Site Evidence">
      <PageHeader
        title="Site Evidence"
        subtitle="Upload site evidence and let InfraSync extract project progress automatically."
      >
        {/* Active AI Engine Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-xs font-semibold text-brand-purple">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>Engine: {aiEngineStatus.mode === 'LIVE_AI' ? 'Gemini 1.5 Vision (Live)' : 'InfraSync AI Engine (Demo Mode)'}</span>
        </div>
      </PageHeader>

      {/* Action Notification Toast */}
      {toast && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Interactive Flow Switcher */}
      {flowState === 'PROCESSING' && (
        <div className="mb-10">
          <AIProcessingState 
            uploadPercent={uploadPercent} 
            fileName={selectedFile?.name || 'site_evidence'} 
            evidenceType={evidenceType} 
          />
        </div>
      )}

      {flowState === 'REVIEW' && (
        <div className="mb-10">
          <AIAnalysisResult
            analysis={currentAnalysis}
            evidence={currentEvidence}
            activities={activities}
            submitting={actionSubmitting}
            onConfirm={handleConfirmReview}
            onDiscard={handleDiscard}
          />
        </div>
      )}

      {/* 2. Upload Panel (Visible when IDLE) */}
      {flowState === 'IDLE' && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl transition-all p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-navy flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </span>
                Upload New Site Evidence
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Supported formats: JPG, JPEG, PNG, PDF (Up to 20MB) • AI auto-extracts progress & activities
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
              Step 1 of 3: Evidence Capture
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Drag & Drop Zone */}
            <div className="lg:col-span-7">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] group ${
                  isDragging 
                    ? 'border-brand-purple bg-purple-50/60 scale-[1.02] shadow-glow-purple' 
                    : selectedFile 
                    ? 'border-emerald-400 bg-emerald-50/30 hover:border-emerald-500' 
                    : 'border-slate-300 hover:border-brand-blue bg-slate-50/60 hover:bg-blue-50/30 hover:scale-[1.01]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2 animate-fade-slide-up">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'File'}
                      </p>
                    </div>
                    <span className="inline-block text-[11px] font-bold text-brand-blue underline group-hover:text-blue-700">
                      Click to choose another file
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">
                        Drag and drop your file here, or <span className="text-brand-blue underline group-hover:text-blue-700 font-semibold">browse</span>
                      </p>
                      <p className="text-xs text-brand-muted mt-1">
                        Select a Daily Progress Report (DPR PDF) or Site Construction Photo
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>PHOTO (JPG, PNG)</span>
                      <span>•</span>
                      <span>DPR REPORT (PDF)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metadata & Context Selector */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Evidence Category</span>
                    <span className="text-[10px] text-brand-blue font-semibold">Auto-inferred</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEvidenceType('DPR')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        evidenceType === 'DPR'
                          ? 'border-brand-purple bg-purple-50 text-brand-purple shadow-xs scale-[1.02]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>DPR Report (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEvidenceType('PHOTO')}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        evidenceType === 'PHOTO'
                          ? 'border-brand-purple bg-purple-50 text-brand-purple shadow-xs scale-[1.02]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span>Site Photo</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Link to WBS Activity <span className="text-[10px] font-normal text-slate-500">(Optional)</span>
                  </label>
                  <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-500/10 font-medium text-slate-700 transition-all"
                  >
                    <option value="">-- Let AI Infer Activity Automatically --</option>
                    {activities.map(act => (
                      <option key={act.id} value={act.id}>
                        {act.activityCode} - {act.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Field Notes / Context <span className="text-[10px] font-normal text-slate-500">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="e.g. Zone A Pier 15 concrete pour shift 2 inspection..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-purple focus:ring-2 focus:ring-purple-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedFile}
                  onClick={handleStartAnalysis}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start AI Evidence Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Evidence Records Gallery & History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-brand-navy">
              Site Evidence Repository
            </h3>
            <p className="text-xs text-brand-muted">
              Historical photographic records, analyzed DPR logs, and AI verification states
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {evidenceList.length} Logged Records
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading site records from PostgreSQL..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : evidenceList.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No site evidence logged yet"
            description="Upload your first Daily Progress Report or site photograph above to activate intelligent progress capture."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidenceList.map((item) => {
              const isConfirmed = item.reviewStatus === 'CONFIRMED' || item.reviewStatus === 'EDITED_AND_CONFIRMED';
              const issues = Array.isArray(item.aiIssues) ? item.aiIssues : [];

              return (
                <div
                  key={item.id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-card-hover-xl hover-lift transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Media Header */}
                    <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-105">
                        <EvidenceThumbnail item={item} />
                      </div>

                      {/* Top Badges */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 backdrop-blur-xs text-brand-navy shadow-xs border border-slate-200/60">
                        {item.evidenceType}
                      </span>

                      <div className="absolute top-3 right-3">
                        <ConfidenceBadge score={item.aiConfidence ?? 90} size="sm" showLabel={false} />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {item.activityCode || 'CIV'}
                        </span>
                        <span className="text-xs font-bold text-brand-navy truncate group-hover:text-brand-blue transition-colors">
                          {item.activityName || item.aiExtractedActivity || 'Site Activity'}
                        </span>
                      </div>

                      {item.aiExtractedQuantity !== null && item.aiExtractedQuantity !== undefined ? (
                        <p className="text-xs text-slate-700 mt-1">
                          Reported: <strong className="text-brand-navy font-bold">{item.aiExtractedQuantity} {item.aiExtractedUnit || 'm3'}</strong> • Progress: <strong className="text-emerald-700 font-bold">{item.aiExtractedProgress ?? 80}%</strong>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1 italic">
                          Visual evidence verified on site
                        </p>
                      )}

                      {/* Issues chip */}
                      {issues.length > 0 && (
                        <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/90 border border-amber-200/90 px-2.5 py-1 rounded-lg flex items-center gap-1.5 truncate">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate font-medium">{issues[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {item.capturedDate ? new Date(item.capturedDate).toLocaleDateString() : 'Today'}
                    </span>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.reviewStatus || 'PENDING_REVIEW'} size="sm" />
                      <button
                        type="button"
                        onClick={() => setInspectingItem(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-200/70 transition-all cursor-pointer hover:scale-105 active:scale-95"
                        title="View AI Extraction Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Inspection Modal for Raw AI and Detailed Parameters */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <h3 className="text-base font-bold text-brand-navy">AI Evidence Extraction Audit</h3>
              </div>
              <button 
                type="button"
                onClick={() => setInspectingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border">
                <div>
                  <span className="text-slate-500 block">Activity</span>
                  <span className="text-sm font-bold text-brand-navy">{inspectingItem.aiExtractedActivity || inspectingItem.activityName}</span>
                </div>
                <ConfidenceBadge score={inspectingItem.aiConfidence ?? 90} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-slate-500 block">Location</span>
                  <span className="font-bold text-brand-navy">{inspectingItem.aiExtractedLocation || 'Corridor Zone A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-slate-500 block">Measured Quantity</span>
                  <span className="font-bold text-brand-navy">
                    {inspectingItem.aiExtractedQuantity !== null ? `${inspectingItem.aiExtractedQuantity} ${inspectingItem.aiExtractedUnit || 'units'}` : 'Not applicable (photo)'}
                  </span>
                </div>
              </div>

              {inspectingItem.aiRemarks && (
                <div className="p-3 rounded-xl bg-slate-50 border">
                  <span className="text-slate-500 block mb-1">AI Remarks</span>
                  <p className="text-slate-700 italic">"{inspectingItem.aiRemarks}"</p>
                </div>
              )}

              {/* Raw JSON Audit View */}
              {inspectingItem.aiRawResponse && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Raw AI Response JSON (Audit Trail):</span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono max-h-48 overflow-auto">
                    {inspectingItem.aiRawResponse}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-brand-border flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
