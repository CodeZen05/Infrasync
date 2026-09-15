import api from './api';

export const evidenceService = {
  // Upload evidence and automatically trigger AI analysis
  uploadAndAnalyze: async (formData, onProgress) => {
    const res = await api.post('/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  // Submit human-in-the-loop review (CONFIRMED, EDITED_AND_CONFIRMED, REJECTED)
  reviewEvidence: async (evidenceId, reviewAction, verifiedData) => {
    const res = await api.post(`/evidence/${evidenceId}/review`, {
      reviewAction,
      verifiedData,
    });
    return res.data;
  },

  // Get evidence uploaded by current Site Engineer
  getMyEvidence: async () => {
    const res = await api.get('/evidence/mine');
    return res.data?.evidence || [];
  },

  // Get project evidence for Project Manager
  getProjectEvidence: async (projectId) => {
    const res = await api.get(`/evidence/project/${projectId}`);
    return res.data?.evidence || [];
  },

  // Check AI Engine health and live/mock mode
  getAIStatus: async () => {
    const res = await api.get('/evidence/status');
    return res.data;
  },
};

