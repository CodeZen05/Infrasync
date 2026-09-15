import { prisma } from '../utils/db.js';
import { dbStore } from '../utils/mockDb.js';

// Helper to check if DB is accessible
async function isDbAlive() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * GET /api/se/dashboard
 * Summary KPIs and active assignments for the logged-in Site Engineer
 */
export async function getDashboardSummary(req, res) {
  try {
    const seId = req.user.id;
    const dbActive = await isDbAlive();

    let assignedActivities = [];
    let submittedUpdates = [];
    let projects = [];

    if (dbActive) {
      try {
        // Fetch projects the SE belongs to
        const memberships = await prisma.projectMember.findMany({
          where: { userId: seId },
          include: { project: true }
        });
        projects = memberships.map(m => m.project);

        const projectIds = projects.map(p => p.id);

        // Fetch activities assigned to this SE or in projects they are assigned to
        assignedActivities = await prisma.activity.findMany({
          where: {
            OR: [
              { assignedToId: seId },
              { projectId: { in: projectIds } }
            ]
          },
          include: {
            project: { select: { id: true, name: true } },
            risks: true
          },
          orderBy: { activityCode: 'asc' }
        });

        // Fetch SE's recent progress updates
        submittedUpdates = await prisma.progressUpdate.findMany({
          where: { submittedById: seId },
          include: {
            activity: { select: { id: true, activityCode: true, name: true, unit: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 6
        });
      } catch (e) {
        console.warn('DB query in SE dashboard failed, using mock store:', e.message);
      }
    }

    if (assignedActivities.length === 0) {
      // Fallback from mock store
      projects = dbStore.projects;
      assignedActivities = dbStore.activities.filter(a => a.assignedToId === seId || a.assignedToId === 'demo-se-uuid-002');
      if (assignedActivities.length === 0) {
        assignedActivities = dbStore.activities.slice(0, 6);
      }
      submittedUpdates = dbStore.progressUpdates.filter(u => u.submittedById === seId || u.submittedById === 'demo-se-uuid-002');
    }

    // Calculate SE KPIs
    const totalAssigned = assignedActivities.length;
    const completedCount = assignedActivities.filter(a => a.status === 'COMPLETED').length;
    const inProgressCount = assignedActivities.filter(a => a.status === 'IN_PROGRESS' || a.status === 'DELAYED').length;
    const pendingUpdatesCount = submittedUpdates.filter(u => u.status === 'PENDING').length;

    const formattedActivities = assignedActivities.map(act => {
      const proj = act.project || dbStore.projects.find(p => p.id === act.projectId);
      const planned = act.plannedQuantity || 100;
      const actual = act.actualQuantity || 0;
      const progress = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0;

      return {
        id: act.id,
        activityCode: act.activityCode,
        name: act.name,
        projectName: proj?.name || 'Delhi Metro Expansion',
        plannedQuantity: planned,
        actualQuantity: actual,
        unit: act.unit || 'units',
        progress: `${progress}%`,
        progressValue: progress,
        dueDate: act.plannedEnd ? new Date(act.plannedEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '30 Nov 2026',
        status: act.status,
      };
    });

    const formattedUpdates = submittedUpdates.map(u => {
      const act = u.activity || dbStore.activities.find(a => a.id === u.activityId);
      return {
        id: u.id,
        activityCode: act?.activityCode || 'CIV',
        activityName: act?.name || 'Activity',
        actualQuantity: u.actualQuantity,
        actualPercentage: u.actualPercentage || 0,
        remarks: u.remarks || '',
        status: u.status,
        submittedDate: u.createdAt,
        reviewRemarks: u.reviewRemarks,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        kpis: {
          assignedActivities: totalAssigned,
          completed: completedCount,
          inProgress: inProgressCount,
          pendingUpdates: pendingUpdatesCount,
        },
        assignedActivities: formattedActivities,
        recentUpdates: formattedUpdates,
        projects: projects.map(p => ({ id: p.id, name: p.name, location: p.location })),
      }
    });
  } catch (error) {
    console.error('Error in getDashboardSummary (SE):', error);
    return res.status(500).json({ success: false, message: 'Failed to load Site Engineer dashboard.' });
  }
}

/**
 * GET /api/se/projects
 * Projects the SE is assigned to
 */
export async function getAssignedProjects(req, res) {
  try {
    const seId = req.user.id;
    const dbActive = await isDbAlive();
    let projects = [];

    if (dbActive) {
      try {
        const memberships = await prisma.projectMember.findMany({
          where: { userId: seId },
          include: { project: true }
        });
        projects = memberships.map(m => m.project);
      } catch (e) {
        projects = dbStore.projects;
      }
    } else {
      projects = dbStore.projects;
    }

    if (projects.length === 0) projects = dbStore.projects;

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error('Error in getAssignedProjects:', error);
    return res.status(500).json({ success: false, message: 'Failed to load assigned projects.' });
  }
}

/**
 * GET /api/se/activities
 * Activities assigned to this SE
 */
export async function getAssignedActivities(req, res) {
  try {
    const seId = req.user.id;
    const dbActive = await isDbAlive();
    let activities = [];

    if (dbActive) {
      try {
        activities = await prisma.activity.findMany({
          where: {
            OR: [
              { assignedToId: seId },
              { assignedToId: null }
            ]
          },
          include: {
            project: { select: { id: true, name: true } },
            risks: true,
          },
          orderBy: { activityCode: 'asc' }
        });
      } catch (e) {
        activities = dbStore.activities;
      }
    } else {
      activities = dbStore.activities;
    }

    if (activities.length === 0) activities = dbStore.activities;

    const formatted = activities.map(act => {
      const proj = act.project || dbStore.projects.find(p => p.id === act.projectId);
      const planned = act.plannedQuantity || 100;
      const actual = act.actualQuantity || 0;
      const progress = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0;

      return {
        id: act.id,
        activityCode: act.activityCode,
        name: act.name,
        wbs: act.wbs,
        projectId: act.projectId,
        projectName: proj?.name || 'Infrastructure Project',
        plannedQuantity: planned,
        actualQuantity: actual,
        unit: act.unit || 'units',
        progress,
        status: act.status,
        plannedStart: act.plannedStart,
        plannedEnd: act.plannedEnd,
      };
    });

    return res.status(200).json({ success: true, activities: formatted });
  } catch (error) {
    console.error('Error in getAssignedActivities:', error);
    return res.status(500).json({ success: false, message: 'Failed to load activities.' });
  }
}

/**
 * GET /api/se/progress
 * Progress updates submitted by this SE
 */
export async function getProgressHistory(req, res) {
  try {
    const seId = req.user.id;
    const dbActive = await isDbAlive();
    let updates = [];

    if (dbActive) {
      try {
        updates = await prisma.progressUpdate.findMany({
          where: { submittedById: seId },
          include: {
            activity: {
              select: {
                id: true,
                activityCode: true,
                name: true,
                unit: true,
                plannedQuantity: true,
                project: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        updates = dbStore.progressUpdates;
      }
    } else {
      updates = dbStore.progressUpdates;
    }

    const formatted = updates.map(u => {
      const act = u.activity || dbStore.activities.find(a => a.id === u.activityId);
      const proj = act?.project || dbStore.projects.find(p => p.id === act?.projectId);

      return {
        id: u.id,
        activityId: u.activityId,
        activityCode: act?.activityCode || 'CIV',
        activityName: act?.name || 'Activity',
        projectName: proj?.name || 'Infrastructure Project',
        actualQuantity: u.actualQuantity,
        plannedQuantity: act?.plannedQuantity || 100,
        unit: act?.unit || 'm³',
        actualPercentage: u.actualPercentage || 0,
        remarks: u.remarks || '',
        status: u.status,
        submittedDate: u.createdAt,
        reviewRemarks: u.reviewRemarks,
        reviewedAt: u.reviewedAt,
      };
    });

    return res.status(200).json({ success: true, updates: formatted });
  } catch (error) {
    console.error('Error in getProgressHistory:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve progress history.' });
  }
}

/**
 * POST /api/se/progress
 * Site Engineer submits a new progress update (DPR)
 */
export async function submitProgressUpdate(req, res) {
  try {
    const { activityId, actualQuantity, actualPercentage, remarks, evidenceUrl } = req.body;
    const seId = req.user.id;

    if (!activityId) {
      return res.status(400).json({ success: false, message: 'Activity is required.' });
    }

    const quantityNum = parseFloat(actualQuantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid numeric Actual Quantity.' });
    }

    const dbActive = await isDbAlive();
    let newRecord = null;

    if (dbActive) {
      try {
        newRecord = await prisma.progressUpdate.create({
          data: {
            activityId,
            submittedById: seId,
            actualQuantity: quantityNum,
            actualPercentage: actualPercentage ? parseFloat(actualPercentage) : null,
            remarks: remarks?.trim() || 'Daily site progress logged.',
            status: 'PENDING',
          },
          include: {
            activity: { select: { activityCode: true, name: true, unit: true } }
          }
        });

        // If evidence URL provided, also link to siteEvidence
        if (evidenceUrl) {
          await prisma.siteEvidence.create({
            data: {
              activityId,
              uploadedById: seId,
              fileUrl: evidenceUrl,
              evidenceType: 'PHOTO',
              capturedDate: new Date(),
              description: `Evidence attached to DPR update: ${remarks || ''}`,
            }
          });
        }
      } catch (e) {
        console.warn('Prisma create progress update failed, using mock store:', e.message);
      }
    }

    if (!newRecord) {
      const act = dbStore.activities.find(a => a.id === activityId);
      newRecord = {
        id: `prog-${Date.now()}`,
        activityId,
        submittedById: seId,
        actualQuantity: quantityNum,
        actualPercentage: actualPercentage ? parseFloat(actualPercentage) : (act ? Math.round((quantityNum / act.plannedQuantity) * 100) : 75),
        remarks: remarks?.trim() || 'Daily site progress logged.',
        status: 'PENDING',
        reviewRemarks: null,
        reviewedAt: null,
        reviewedById: null,
        createdAt: new Date().toISOString(),
        activity: act ? { activityCode: act.activityCode, name: act.name, unit: act.unit } : { activityCode: 'CIV-023', name: 'Foundation Construction', unit: 'm³' },
      };
      dbStore.progressUpdates.unshift(newRecord);

      if (evidenceUrl) {
        dbStore.siteEvidences.unshift({
          id: `evid-${Date.now()}`,
          activityId,
          uploadedById: seId,
          fileUrl: evidenceUrl,
          evidenceType: 'PHOTO',
          capturedDate: new Date().toISOString(),
          description: `Evidence attached to DPR update: ${remarks || ''}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Progress update submitted successfully. Now pending Project Manager approval.',
      update: newRecord,
    });
  } catch (error) {
    console.error('Error in submitProgressUpdate:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit progress update.' });
  }
}

/**
 * GET /api/se/evidence
 * List site evidence uploaded by this SE
 */
export async function getEvidence(req, res) {
  try {
    const seId = req.user.id;
    const dbActive = await isDbAlive();
    let evidence = [];

    if (dbActive) {
      try {
        evidence = await prisma.siteEvidence.findMany({
          where: { uploadedById: seId },
          include: {
            activity: { select: { id: true, activityCode: true, name: true, project: { select: { name: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        evidence = dbStore.siteEvidences;
      }
    } else {
      evidence = dbStore.siteEvidences;
    }

    if (evidence.length === 0) evidence = dbStore.siteEvidences;

    const formatted = evidence.map(ev => {
      const act = ev.activity || dbStore.activities.find(a => a.id === ev.activityId);
      const proj = act?.project || dbStore.projects.find(p => p.id === act?.projectId);

      return {
        id: ev.id,
        activityId: ev.activityId,
        activityCode: act?.activityCode || 'CIV',
        activityName: act?.name || 'Foundation Work',
        projectName: proj?.name || 'Delhi Metro Expansion',
        fileUrl: ev.fileUrl,
        evidenceType: ev.evidenceType,
        capturedDate: ev.capturedDate,
        description: ev.description,
        createdAt: ev.createdAt,
      };
    });

    return res.status(200).json({ success: true, evidence: formatted });
  } catch (error) {
    console.error('Error in getEvidence:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve site evidence.' });
  }
}

/**
 * POST /api/se/evidence
 * Upload / record site evidence metadata
 */
export async function submitEvidence(req, res) {
  try {
    const { activityId, fileUrl, evidenceType, description, capturedDate } = req.body;
    const seId = req.user.id;

    if (!activityId || !fileUrl) {
      return res.status(400).json({ success: false, message: 'Activity ID and File URL are required.' });
    }

    const validTypes = ['PHOTO', 'DPR', 'DOCUMENT', 'VIDEO'];
    const type = validTypes.includes(evidenceType) ? evidenceType : 'PHOTO';

    const dbActive = await isDbAlive();
    let record = null;

    if (dbActive) {
      try {
        record = await prisma.siteEvidence.create({
          data: {
            activityId,
            uploadedById: seId,
            fileUrl,
            evidenceType: type,
            capturedDate: capturedDate ? new Date(capturedDate) : new Date(),
            description: description?.trim() || null,
          }
        });
      } catch (e) {
        console.warn('Prisma create evidence failed, using mock store:', e.message);
      }
    }

    if (!record) {
      record = {
        id: `evid-${Date.now()}`,
        activityId,
        uploadedById: seId,
        fileUrl,
        evidenceType: type,
        capturedDate: capturedDate || new Date().toISOString(),
        description: description?.trim() || 'Site evidence captured.',
        createdAt: new Date().toISOString(),
      };
      dbStore.siteEvidences.unshift(record);
    }

    return res.status(201).json({
      success: true,
      message: 'Site evidence logged successfully.',
      evidence: record,
    });
  } catch (error) {
    console.error('Error in submitEvidence:', error);
    return res.status(500).json({ success: false, message: 'Failed to log site evidence.' });
  }
}
