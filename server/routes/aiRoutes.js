import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { analyzeSiteEvidence, checkAIServiceHealth } from '../services/aiService.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  const health = await checkAIServiceHealth();
  return res.status(200).json({ success: true, ...health });
});

router.post('/analyze-evidence', requireAuth, async (req, res) => {
  try {
    const { evidenceId, fileUrl, filePath, fileName, fileType, evidenceType, context } = req.body;
    const result = await analyzeSiteEvidence({
      evidenceId,
      fileUrl,
      filePath,
      fileName,
      fileType,
      evidenceType,
      context
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'AI analysis request failed.'
    });
  }
});

export default router;
