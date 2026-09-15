import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ProgressBar from '../../components/dashboard/ProgressBar';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import AIEvidenceInsight from '../../components/evidence/AIEvidenceInsight';
import { pmService } from '../../services/pmService';
import { evidenceService } from '../../services/evidenceService';
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckSquare, 
  FileSpreadsheet, 
  Upload, 
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';

export default function PMProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('activities'); // 'activities' | 'team' | 'evidence'

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, evData] = await Promise.all([
        pmService.getProjectById(projectId),
        evidenceService.getProjectEvidence(projectId).catch(() => [])
      ]);
      setProject(projData);
      setEvidenceList(evData || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve project details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  if (loading) {
    return (
      <DashboardLayout title="Project Details">
        <LoadingState message="Fetching project details, activities, and team members..." />
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout title="Project Details">
        <ErrorState message={error || 'Project not found.'} onRetry={fetchProjectDetail} />
      </DashboardLayout>
    );
  }

  const activities = project.activities || [];
  const members = project.members || [];

  return (
    <DashboardLayout title={project.name}>
      {/* Back Link */}
      <div className="mb-4">
        <Link 
          to="/pm/projects" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                WBS PACKAGE
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">
              {project.name}
            </h1>
            {project.location && (
              <p className="text-xs text-brand-muted mt-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>{project.location}</span>
              </p>
            )}
            {project.description && (
              <p className="text-xs text-slate-600 mt-2 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Schedule Upload Placeholder for Phase 4 */}
          <div className="shrink-0 bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-center max-w-xs">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-blue mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Schedule Import (Phase 4)</span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2.5">
              Direct Primavera XML / MS Project CSV parser will be enabled in Phase 4.
            </p>
            <button
              type="button"
              onClick={() => alert('Excel / Primavera schedule upload engine will be unlocked in Phase 4.')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Schedule</span>
            </button>
          </div>
        </div>

        {/* Project Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="block text-brand-muted font-medium">Start Date</span>
            <span className="font-bold text-brand-navy">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : '01 Jan 2026'}
            </span>
          </div>
          <div>
            <span className="block text-brand-muted font-medium">Target Completion</span>
            <span className="font-bold text-brand-navy">
              {project.endDate ? new Date(project.endDate).toLocaleDateString() : '30 Dec 2026'}
            </span>
          </div>
          <div>
            <span className="block text-brand-muted font-medium">Total Activities</span>
            <span className="font-bold text-brand-navy">{activities.length} WBS Items</span>
          </div>
          <div>
            <span className="block text-brand-muted font-medium">Site Team</span>
            <span className="font-bold text-brand-navy">{members.length} Engineers</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-brand-border mb-6">
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'activities'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-brand-navy'
          }`}
        >
          Activities ({activities.length})
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'team'
              ? 'border-brand-blue text-brand-blue'
              : 'border-transparent text-slate-500 hover:text-brand-navy'
          }`}
        >
          Site Team ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'evidence'
              ? 'border-brand-purple text-brand-purple'
              : 'border-transparent text-slate-500 hover:text-brand-navy'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evidence & AI Insights ({evidenceList.length})</span>
        </button>
      </div>

      {/* Tab 1: Activities Table */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-brand-muted uppercase font-bold text-[11px] border-y border-brand-border">
                <tr>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Activity Name</th>
                  <th className="py-3 px-3">WBS</th>
                  <th className="py-3 px-3">Planned</th>
                  <th className="py-3 px-3">Actual</th>
                  <th className="py-3 px-3">Assigned To</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-navy">
                      {act.activityCode}
                    </td>
                    <td className="py-3 px-3 font-semibold text-brand-navy">
                      {act.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono">
                      {act.wbs || '-'}
                    </td>
                    <td className="py-3 px-3">
                      {act.plannedQuantity} {act.unit}
                    </td>
                    <td className="py-3 px-3 font-bold text-brand-navy">
                      {act.actualQuantity} {act.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {act.assignedTo?.name || 'Site Engineer'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={act.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Team Members */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {members.map((mem) => (
            <div key={mem.id} className="bg-white rounded-xl p-4 border border-brand-border shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center font-bold">
                {mem.user?.name?.charAt(0) || 'E'}
              </div>
              <div>
                <p className="text-sm font-bold text-brand-navy">{mem.user?.name || 'Site Engineer'}</p>
                <p className="text-xs text-brand-muted">{mem.user?.email || 'se@infrasync.demo'}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-brand-purple">
                  SITE ENGINEER
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Site Evidence & AI Insights */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                AI-Analyzed Site Records
              </h3>
              <p className="text-xs text-brand-muted">
                Daily Progress Reports and photographic evidence verified by site engineers
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {evidenceList.length} Records Verified
            </span>
          </div>

          {evidenceList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-brand-border text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-brand-navy mb-1">No site evidence captured yet</h4>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Site Engineers can upload Daily Progress Reports and site inspection photos to automatically extract execution parameters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evidenceList.map((item) => (
                <AIEvidenceInsight key={item.id} evidenceItem={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
