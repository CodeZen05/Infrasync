import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader from '../../components/dashboard/PageHeader';
import ProgressBar from '../../components/dashboard/ProgressBar';
import StatusBadge from '../../components/dashboard/StatusBadge';
import LoadingState from '../../components/dashboard/LoadingState';
import ErrorState from '../../components/dashboard/ErrorState';
import { pmService } from '../../services/pmService';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Calendar, 
  Users, 
  AlertTriangle, 
  ArrowRight,
  X,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PMProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pmService.getProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Project Name is required.');
      return;
    }

    try {
      setCreating(true);
      setFormError('');
      await pmService.createProject(formData);
      setShowModal(false);
      setFormData({
        name: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
      });
      await fetchProjects();
    } catch (err) {
      setFormError(err.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout title="Managed Projects">
      <PageHeader
        title="Infrastructure Projects"
        subtitle="Manage active construction packages, track schedule health, and assign site personnel."
      >
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </PageHeader>

      {loading ? (
        <LoadingState message="Loading projects from PostgreSQL database..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-6 border border-brand-border shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    ID: {proj.id.substring(0, 8)}
                  </span>
                  <StatusBadge status={proj.status} />
                </div>

                <h3 className="text-xl font-bold text-brand-navy">
                  {proj.name}
                </h3>

                {proj.location && (
                  <p className="text-xs text-brand-muted mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>{proj.location}</span>
                  </p>
                )}

                {proj.description && (
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                    <span className="text-slate-600">Overall Progress</span>
                    <span className="text-brand-blue font-bold">{proj.progress}%</span>
                  </div>
                  <ProgressBar value={proj.progress} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proj.teamSize} Site Engineers</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <AlertTriangle className={`w-3.5 h-3.5 ${proj.atRiskActivities > 0 ? 'text-brand-danger' : 'text-slate-400'}`} />
                    <span>{proj.atRiskActivities} At-Risk Activities</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-brand-muted">
                  Target: {proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Dec 2026'}
                </span>
                <Link
                  to={`/pm/projects/${proj.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <h3 className="text-lg font-bold text-brand-navy">Create New Project</h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <p className="my-3 p-3 rounded-lg bg-red-50 text-xs text-brand-danger border border-red-200">
                {formError}
              </p>
            )}

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Project Name <span className="text-brand-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai Coastal Road - Package 2"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PLANNED">PLANNED</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Scope of work, key deliverables, and contract details..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Target Completion
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm bg-white border border-brand-border rounded-xl outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-brand-blue hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
