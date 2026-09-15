import { Router } from 'express';
import { 
  getDashboardSummary,
  getProjects,
  createProject,
  getProjectById,
  getActivities,
  getRisks,
  getApprovals,
  approveProgressUpdate,
  rejectProgressUpdate
} from '../controllers/pmController.js';
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Enforce authentication & PM role for all routes in this router
router.use(authenticate);
router.use(authorizeRoles('PROJECT_MANAGER'));

// Dashboard Overview
router.get('/dashboard', getDashboardSummary);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.get('/projects/:id', getProjectById);

// Activities & Analytics
router.get('/activities', getActivities);
router.get('/progress', getDashboardSummary);
router.get('/risks', getRisks);

// Approvals Queue
router.get('/approvals', getApprovals);
router.patch('/approvals/:id/approve', approveProgressUpdate);
router.patch('/approvals/:id/reject', rejectProgressUpdate);

export default router;
