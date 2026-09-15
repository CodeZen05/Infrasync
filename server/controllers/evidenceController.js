import { prisma, isDbAlive } from '../utils/db.js';
import { dbStore } from '../utils/mockDb.js';
import { analyzeSiteEvidence, checkAIServiceHealth } from '../services/aiService.js';
import path from 'path';

/**
 * Upload site evidence file and immediately run AI analysis
 */
export async function uploadAndAnalyze(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a JPG, PNG, or PDF file.'
      });
    }

    const { activityId, evidenceType = 'PHOTO', description, capturedDate } = req.body;
    const uploadedById = req.user.id;
    const fileName = req.file.originalname;
    const fileType = req.file.mimetype;
    const filePath = req.file.path;
    const host = req.get('host') || 'localhost:5001';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const dbActive = await isDbAlive();

    // 1. Gather Activity & Project context if activityId was provided
    let context = {
      projectName: 'Delhi Metro Expansion (Phase 4B)',
      activityName: null,
      activityCode: null
    };

    if (activityId) {
      if (dbActive) {
        try {
          const act = await prisma.activity.findUnique({
            where: { id: activityId },
            include: { project: { select: { name: true } } }
          });
          if (act) {
            context.activityName = act.name;
            context.activityCode = act.activityCode;
            if (act.project) context.projectName = act.project.name;
          }
        } catch (e) {
          console.warn('[evidenceController] Failed to query activity context from DB:', e.message);
        }
      } else {
        const act = dbStore.activities.find(a => a.id === activityId);
        if (act) {
          context.activityName = act.name;
          context.activityCode = act.activityCode;
          const proj = dbStore.projects.find(p => p.id === act.projectId);
          if (proj) context.projectName = proj.name;
        }
      }
    }

    // 2. Create Initial Evidence Record in DB
    let evidence;
    const evidenceId = 'evid-' + Date.now();

    if (dbActive) {
      try {
        evidence = await prisma.siteEvidence.create({
          data: {
            activityId: activityId || null,
            uploadedById,
            fileUrl,
            fileName,
            fileType,
            evidenceType,
            capturedDate: capturedDate ? new Date(capturedDate) : new Date(),
            description: description || null,
            aiStatus: 'PROCESSING',
            reviewStatus: 'PENDING_REVIEW'
          },
          include: {
            activity: { select: { id: true, name: true, activityCode: true } },
            uploadedBy: { select: { id: true, name: true, email: true } }
          }
        });
      } catch (dbErr) {
        console.warn('[evidenceController] Prisma create error, falling back to mockDb:', dbErr.message);
        evidence = createMockEvidence();
      }
    } else {
      evidence = createMockEvidence();
    }

    function createMockEvidence() {
      const newEv = {
        id: evidenceId,
        activityId: activityId || null,
        uploadedById,
        fileUrl,
        fileName,
        fileType,
        evidenceType,
        capturedDate: capturedDate ? new Date(capturedDate).toISOString() : new Date().toISOString(),
        description: description || null,
        aiStatus: 'PROCESSING',
        aiConfidence: null,
        reviewStatus: 'PENDING_REVIEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dbStore.siteEvidences.unshift(newEv);
      return newEv;
    }

    // 3. Dispatch to AI Analysis Service (Gemini / OCR / Mock)
    const aiResult = await analyzeSiteEvidence({
      evidenceId: evidence.id,
      fileUrl,
      filePath,
      fileName,
      fileType,
      evidenceType,
      context
    });

    const analysis = aiResult.analysis || {};
    const aiConfidence = analysis.confidenceScore ?? 85;
    const rawResponse = aiResult.rawResponse || JSON.stringify(analysis, null, 2);

    // 4. Update Evidence Record with AI Extracted Data
    if (dbActive) {
      try {
        evidence = await prisma.siteEvidence.update({
          where: { id: evidence.id },
          data: {
            aiStatus: 'COMPLETED',
            aiConfidence,
            aiRawResponse: rawResponse,
            aiExtractedActivity: analysis.activityName || null,
            aiExtractedLocation: analysis.location || null,
            aiExtractedQuantity: analysis.quantity !== null && analysis.quantity !== undefined ? parseFloat(analysis.quantity) : null,
            aiExtractedUnit: analysis.unit || null,
            aiExtractedProgress: analysis.progressPercentage !== null && analysis.progressPercentage !== undefined ? parseFloat(analysis.progressPercentage) : null,
            aiExtractedStatus: analysis.workStatus || 'IN_PROGRESS',
            aiIssues: analysis.issues ? JSON.stringify(analysis.issues) : null,
            aiRemarks: analysis.remarks || null,
            aiMaterials: analysis.materials ? JSON.stringify(analysis.materials) : null,
            aiManpower: analysis.manpower || null,
            aiEquipment: analysis.equipment ? (Array.isArray(analysis.equipment) ? analysis.equipment.join(', ') : String(analysis.equipment)) : null,
          },
          include: {
            activity: { select: { id: true, name: true, activityCode: true } },
            uploadedBy: { select: { id: true, name: true, email: true } }
          }
        });
      } catch (upErr) {
        console.warn('[evidenceController] Prisma update error, updating mockDb:', upErr.message);
        updateMockFields();
      }
    } else {
      updateMockFields();
    }

    function updateMockFields() {
      const idx = dbStore.siteEvidences.findIndex(e => e.id === evidence.id);
      if (idx !== -1) {
        dbStore.siteEvidences[idx] = {
          ...dbStore.siteEvidences[idx],
          aiStatus: 'COMPLETED',
          aiConfidence,
          aiRawResponse: rawResponse,
          aiExtractedActivity: analysis.activityName || null,
          aiExtractedLocation: analysis.location || null,
          aiExtractedQuantity: analysis.quantity !== null && analysis.quantity !== undefined ? parseFloat(analysis.quantity) : null,
          aiExtractedUnit: analysis.unit || null,
          aiExtractedProgress: analysis.progressPercentage !== null && analysis.progressPercentage !== undefined ? parseFloat(analysis.progressPercentage) : null,
          aiExtractedStatus: analysis.workStatus || 'IN_PROGRESS',
          aiIssues: analysis.issues ? JSON.stringify(analysis.issues) : null,
          aiRemarks: analysis.remarks || null,
          aiMaterials: analysis.materials ? JSON.stringify(analysis.materials) : null,
          aiManpower: analysis.manpower || null,
          aiEquipment: analysis.equipment ? (Array.isArray(analysis.equipment) ? analysis.equipment.join(', ') : String(analysis.equipment)) : null,
          updatedAt: new Date().toISOString(),
        };
        evidence = dbStore.siteEvidences[idx];
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Evidence uploaded and analyzed successfully.',
      evidence,
      analysis,
      mode: aiResult.mode,
      provider: aiResult.provider
    });

  } catch (error) {
    console.error('[evidenceController] uploadAndAnalyze error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process and analyze site evidence.'
    });
  }
}

/**
 * Human-in-the-Loop Review: Confirm, Edit & Confirm, or Reject AI Extraction.
 * When confirmed, automatically creates a ProgressUpdate in PENDING status.
 */
export async function reviewEvidence(req, res) {
  try {
    const { id } = req.params;
    const { reviewAction, verifiedData } = req.body;
    const userId = req.user.id;

    if (!['CONFIRMED', 'EDITED_AND_CONFIRMED', 'REJECTED'].includes(reviewAction)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review action. Must be CONFIRMED, EDITED_AND_CONFIRMED, or REJECTED.'
      });
    }

    const dbActive = await isDbAlive();
    let evidence;

    if (dbActive) {
      try {
        evidence = await prisma.siteEvidence.findUnique({
          where: { id },
          include: { activity: true }
        });
      } catch (e) {
        evidence = dbStore.siteEvidences.find(e => e.id === id);
      }
    } else {
      evidence = dbStore.siteEvidences.find(e => e.id === id);
    }

    if (!evidence) {
      return res.status(404).json({ success: false, message: 'Evidence record not found.' });
    }

    const targetActivityId = verifiedData?.activityId || evidence.activityId;
    const now = new Date();

    // Update evidence review status
    if (dbActive) {
      try {
        evidence = await prisma.siteEvidence.update({
          where: { id },
          data: {
            reviewStatus: reviewAction,
            reviewedById: userId,
            reviewedAt: now,
            activityId: targetActivityId || evidence.activityId,
            aiExtractedQuantity: verifiedData?.quantity !== undefined && verifiedData?.quantity !== null ? parseFloat(verifiedData.quantity) : evidence.aiExtractedQuantity,
            aiExtractedUnit: verifiedData?.unit || evidence.aiExtractedUnit,
            aiExtractedProgress: verifiedData?.progressPercentage !== undefined && verifiedData?.progressPercentage !== null ? parseFloat(verifiedData.progressPercentage) : evidence.aiExtractedProgress,
            aiRemarks: verifiedData?.remarks || evidence.aiRemarks,
          }
        });
      } catch (e) {
        updateMockReview();
      }
    } else {
      updateMockReview();
    }

    function updateMockReview() {
      const idx = dbStore.siteEvidences.findIndex(e => e.id === id);
      if (idx !== -1) {
        dbStore.siteEvidences[idx] = {
          ...dbStore.siteEvidences[idx],
          reviewStatus: reviewAction,
          reviewedById: userId,
          reviewedAt: now.toISOString(),
          activityId: targetActivityId || evidence.activityId,
          aiExtractedQuantity: verifiedData?.quantity !== undefined && verifiedData?.quantity !== null ? parseFloat(verifiedData.quantity) : evidence.aiExtractedQuantity,
          aiExtractedUnit: verifiedData?.unit || evidence.aiExtractedUnit,
          aiExtractedProgress: verifiedData?.progressPercentage !== undefined && verifiedData?.progressPercentage !== null ? parseFloat(verifiedData.progressPercentage) : evidence.aiExtractedProgress,
          aiRemarks: verifiedData?.remarks || evidence.aiRemarks,
          updatedAt: now.toISOString(),
        };
        evidence = dbStore.siteEvidences[idx];
      }
    }

    // If confirmed and linked to an activity, create a ProgressUpdate in PENDING status for PM sign-off
    let createdProgressUpdate = null;
    if ((reviewAction === 'CONFIRMED' || reviewAction === 'EDITED_AND_CONFIRMED') && targetActivityId) {
      const quantity = verifiedData?.quantity !== undefined && verifiedData?.quantity !== null
        ? parseFloat(verifiedData.quantity)
        : (evidence.aiExtractedQuantity || 0);

      const progress = verifiedData?.progressPercentage !== undefined && verifiedData?.progressPercentage !== null
        ? parseFloat(verifiedData.progressPercentage)
        : (evidence.aiExtractedProgress || null);

      const remarks = verifiedData?.remarks || evidence.aiRemarks || `Progress extracted from ${evidence.evidenceType} site evidence and confirmed by Site Engineer.`;

      if (dbActive) {
        try {
          createdProgressUpdate = await prisma.progressUpdate.create({
            data: {
              activityId: targetActivityId,
              submittedById: userId,
              actualQuantity: quantity,
              actualPercentage: progress,
              remarks: `[AI Verified] ${remarks}`,
              status: 'PENDING'
            }
          });
        } catch (puErr) {
          console.warn('[evidenceController] Prisma ProgressUpdate create error, falling back to mockDb:', puErr.message);
          createdProgressUpdate = createMockProgressUpdate();
        }
      } else {
        createdProgressUpdate = createMockProgressUpdate();
      }

      function createMockProgressUpdate() {
        const pu = {
          id: 'prog-' + Date.now(),
          activityId: targetActivityId,
          submittedById: userId,
          actualQuantity: quantity,
          actualPercentage: progress,
          remarks: `[AI Verified] ${remarks}`,
          status: 'PENDING',
          reviewRemarks: null,
          reviewedAt: null,
          reviewedById: null,
          createdAt: now.toISOString(),
        };
        dbStore.progressUpdates.unshift(pu);
        return pu;
      }
    }

    return res.status(200).json({
      success: true,
      message: reviewAction === 'REJECTED'
        ? 'Evidence analysis discarded.'
        : 'Evidence verified and progress update queued for Project Manager approval!',
      evidence,
      progressUpdate: createdProgressUpdate
    });

  } catch (error) {
    console.error('[evidenceController] reviewEvidence error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review for site evidence.'
    });
  }
}

/**
 * Get evidence records uploaded by current Site Engineer
 */
export async function getMyEvidence(req, res) {
  try {
    const userId = req.user.id;
    const dbActive = await isDbAlive();

    let list = [];
    if (dbActive) {
      try {
        list = await prisma.siteEvidence.findMany({
          where: { uploadedById: userId },
          include: {
            activity: {
              select: {
                id: true,
                activityCode: true,
                name: true,
                unit: true,
                project: { select: { id: true, name: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        list = dbStore.siteEvidences.filter(ev => ev.uploadedById === userId || !ev.uploadedById);
      }
    } else {
      list = dbStore.siteEvidences.filter(ev => ev.uploadedById === userId || !ev.uploadedById);
    }

    // Format for client consumption
    const formatted = list.map(ev => {
      const act = ev.activity || dbStore.activities.find(a => a.id === ev.activityId);
      const proj = act?.project || (act ? dbStore.projects.find(p => p.id === act.projectId) : null);

      let parsedIssues = [];
      try {
        parsedIssues = typeof ev.aiIssues === 'string' ? JSON.parse(ev.aiIssues) : (ev.aiIssues || []);
      } catch {
        parsedIssues = ev.aiIssues ? [String(ev.aiIssues)] : [];
      }

      let parsedMaterials = [];
      try {
        parsedMaterials = typeof ev.aiMaterials === 'string' ? JSON.parse(ev.aiMaterials) : (ev.aiMaterials || []);
      } catch {
        parsedMaterials = ev.aiMaterials ? [String(ev.aiMaterials)] : [];
      }

      return {
        ...ev,
        activityCode: act?.activityCode || 'CIV',
        activityName: act?.name || ev.aiExtractedActivity || 'Site Activity',
        projectName: proj?.name || 'Delhi Metro Expansion',
        aiIssues: parsedIssues,
        aiMaterials: parsedMaterials,
      };
    });

    return res.status(200).json({ success: true, evidence: formatted });
  } catch (error) {
    console.error('[evidenceController] getMyEvidence error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve site evidence.' });
  }
}

/**
 * Get project evidence for Project Manager project detail view
 */
export async function getProjectEvidence(req, res) {
  try {
    const { projectId } = req.params;
    const dbActive = await isDbAlive();

    let list = [];
    if (dbActive) {
      try {
        list = await prisma.siteEvidence.findMany({
          where: {
            activity: { projectId }
          },
          include: {
            activity: { select: { id: true, activityCode: true, name: true, unit: true } },
            uploadedBy: { select: { id: true, name: true, email: true } },
            reviewedBy: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        list = getMockProjectEvidence(projectId);
      }
    } else {
      list = getMockProjectEvidence(projectId);
    }

    function getMockProjectEvidence(projId) {
      const projectActivities = dbStore.activities.filter(a => a.projectId === projId);
      const actIds = projectActivities.map(a => a.id);
      return dbStore.siteEvidences.filter(e => !e.activityId || actIds.includes(e.activityId));
    }

    const formatted = list.map(ev => {
      const act = ev.activity || dbStore.activities.find(a => a.id === ev.activityId);
      const user = ev.uploadedBy || dbStore.users.find(u => u.id === ev.uploadedById);

      let parsedIssues = [];
      try {
        parsedIssues = typeof ev.aiIssues === 'string' ? JSON.parse(ev.aiIssues) : (ev.aiIssues || []);
      } catch {
        parsedIssues = ev.aiIssues ? [String(ev.aiIssues)] : [];
      }

      return {
        ...ev,
        activityCode: act?.activityCode || 'CIV',
        activityName: act?.name || ev.aiExtractedActivity || 'Site Activity',
        uploadedByName: user?.name || 'Site Engineer',
        aiIssues: parsedIssues
      };
    });

    return res.status(200).json({ success: true, evidence: formatted });
  } catch (error) {
    console.error('[evidenceController] getProjectEvidence error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve project evidence.' });
  }
}

/**
 * Get AI microservice health & mode status
 */
export async function getAIStatus(req, res) {
  try {
    const health = await checkAIServiceHealth();
    return res.status(200).json({
      success: true,
      service: 'InfraSync AI Engine',
      ...health
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      service: 'InfraSync AI Engine',
      status: 'fallback',
      mode: 'MOCK_AI'
    });
  }
}
