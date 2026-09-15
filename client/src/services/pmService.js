import api from './api';

export const pmService = {
  async getDashboard() {
    const response = await api.get('/pm/dashboard');
    return response.data.data;
  },

  async getProjects() {
    const response = await api.get('/pm/projects');
    return response.data.projects;
  },

  async createProject(projectData) {
    const response = await api.post('/pm/projects', projectData);
    return response.data;
  },

  async getProjectById(id) {
    const response = await api.get(`/pm/projects/${id}`);
    return response.data.project;
  },

  async getActivities() {
    const response = await api.get('/pm/activities');
    return response.data.activities;
  },

  async getRisks() {
    const response = await api.get('/pm/risks');
    return response.data.risks;
  },

  async getApprovals() {
    const response = await api.get('/pm/approvals');
    return response.data.approvals;
  },

  async approveProgress(id, remarks = '') {
    const response = await api.patch(`/pm/approvals/${id}/approve`, { remarks });
    return response.data;
  },

  async rejectProgress(id, remarks = '') {
    const response = await api.patch(`/pm/approvals/${id}/reject`, { remarks });
    return response.data;
  }
};
