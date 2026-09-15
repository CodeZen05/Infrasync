import express from 'express';
import { 
  uploadAndAnalyze, 
  reviewEvidence, 
  getMyEvidence, 
  getProjectEvidence, 
  getAIStatus 
} from '../controllers/evidenceController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public / Authenticated AI Status check
router.get('/status', getAIStatus);

// Site Engineer upload & analysis
router.post(
  '/upload',
  requireAuth,
  requireRole(['SITE_ENGINEER', 'PROJECT_MANAGER']),
  upload.single('file'),
  uploadAndAnalyze
);

// Site Engineer review and confirmation
router.post(
  '/:id/review',
  requireAuth,
  requireRole(['SITE_ENGINEER', 'PROJECT_MANAGER']),
  reviewEvidence
);

// Site Engineer fetch own evidence
router.get(
  '/mine',
  requireAuth,
  requireRole(['SITE_ENGINEER', 'PROJECT_MANAGER']),
  getMyEvidence
);

// Project Manager fetch project evidence
router.get(
  '/project/:projectId',
  requireAuth,
  getProjectEvidence
);

export default router;
