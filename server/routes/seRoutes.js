import { Router } from 'express';
import { 
  getDashboardSummary,
  getAssignedProjects,
  getAssignedActivities,
  getProgressHistory,
  submitProgressUpdate,
  getEvidence,
  submitEvidence
} from '../controllers/seController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Enforce authentication & SE role for all routes in this router
router.use(authenticate);
router.use(authorizeRoles('SITE_ENGINEER'));

// Dashboard Overview
router.get('/dashboard', getDashboardSummary);

// Assigned Projects & Activities
router.get('/projects', getAssignedProjects);
router.get('/activities', getAssignedActivities);

// Progress Submissions
router.get('/progress', getProgressHistory);
router.post('/progress', submitProgressUpdate);

// Site Evidence
router.get('/evidence', getEvidence);
router.post('/evidence', submitEvidence);

export default router;
