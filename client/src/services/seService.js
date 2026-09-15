import api from './api';

export const seService = {
  async getDashboard() {
    const response = await api.get('/se/dashboard');
    return response.data.data;
  },

  async getProjects() {
    const response = await api.get('/se/projects');
    return response.data.projects;
  },

  async getActivities() {
    const response = await api.get('/se/activities');
    return response.data.activities;
  },

  async getProgress() {
    const response = await api.get('/se/progress');
    return response.data.updates;
  },

  async submitProgress(progressData) {
    const response = await api.post('/se/progress', progressData);
    return response.data;
  },

  async getEvidence() {
    const response = await api.get('/se/evidence');
    return response.data.evidence;
  },

  async submitEvidence(evidenceData) {
    const response = await api.post('/se/evidence', evidenceData);
    return response.data;
  }
};
