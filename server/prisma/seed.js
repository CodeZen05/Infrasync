import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding InfraSync Phase 3 database...');

  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // 1. Create Demo Project Manager
  const pm = await prisma.user.upsert({
    where: { email: 'pm@infrasync.demo' },
    update: { passwordHash, role: 'PROJECT_MANAGER', name: 'Demo Project Manager' },
    create: { name: 'Demo Project Manager', email: 'pm@infrasync.demo', passwordHash, role: 'PROJECT_MANAGER' },
  });
  console.log(`✓ Project Manager created: ${pm.email}`);

  // 2. Create 2 Demo Site Engineers
  const se1 = await prisma.user.upsert({
    where: { email: 'se@infrasync.demo' },
    update: { passwordHash, role: 'SITE_ENGINEER', name: 'Demo Site Engineer' },
    create: { name: 'Demo Site Engineer', email: 'se@infrasync.demo', passwordHash, role: 'SITE_ENGINEER' },
  });
  console.log(`✓ Site Engineer 1 created: ${se1.email}`);

  const se2 = await prisma.user.upsert({
    where: { email: 'se2@infrasync.demo' },
    update: { passwordHash, role: 'SITE_ENGINEER', name: 'Priya Patel (Site Engineer)' },
    create: { name: 'Priya Patel (Site Engineer)', email: 'se2@infrasync.demo', passwordHash, role: 'SITE_ENGINEER' },
  });
  console.log(`✓ Site Engineer 2 created: ${se2.email}`);

  // 3. Create 2 Infrastructure Projects
  let proj1 = await prisma.project.findFirst({ where: { name: 'Delhi Metro Expansion (Phase 4B)' } });
  if (!proj1) {
    proj1 = await prisma.project.create({
      data: {
        name: 'Delhi Metro Expansion (Phase 4B)',
        location: 'Delhi NCR Corridor',
        description: '12.4 km elevated viaduct and 4 metro stations construction package.',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-30'),
        status: 'ACTIVE',
        managerId: pm.id,
      }
    });
  }

  let proj2 = await prisma.project.findFirst({ where: { name: 'Western Dedicated Freight Corridor (Package 3)' } });
  if (!proj2) {
    proj2 = await prisma.project.create({
      data: {
        name: 'Western Dedicated Freight Corridor (Package 3)',
        location: 'Rewari - Vadodara Section',
        description: '48 km electrified double line freight railway corridor.',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2027-03-31'),
        status: 'ACTIVE',
        managerId: pm.id,
      }
    });
  }
  console.log(`✓ Projects created: ${proj1.name}, ${proj2.name}`);

  // 4. Assign Site Engineers to Projects
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: proj1.id, userId: se1.id } },
    update: {},
    create: { projectId: proj1.id, userId: se1.id },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: proj1.id, userId: se2.id } },
    update: {},
    create: { projectId: proj1.id, userId: se2.id },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: proj2.id, userId: se1.id } },
    update: {},
    create: { projectId: proj2.id, userId: se1.id },
  });
  console.log(`✓ Project memberships linked`);

  // 5. Create 10 Activities
  const activitiesData = [
    {
      projectId: proj1.id,
      activityCode: 'CIV-001',
      name: 'Site Preparation & Utility Diversion',
      wbs: 'WBS-01.01',
      plannedQuantity: 100,
      actualQuantity: 100,
      unit: '%',
      status: 'COMPLETED',
      assignedToId: se1.id,
      plannedStart: new Date('2026-01-01'),
      plannedEnd: new Date('2026-02-15'),
    },
    {
      projectId: proj1.id,
      activityCode: 'CIV-012',
      name: 'Geotechnical Bore Piling (1200mm dia)',
      wbs: 'WBS-01.02',
      plannedQuantity: 450,
      actualQuantity: 450,
      unit: 'm',
      status: 'COMPLETED',
      assignedToId: se1.id,
      plannedStart: new Date('2026-02-01'),
      plannedEnd: new Date('2026-04-30'),
    },
    {
      projectId: proj1.id,
      activityCode: 'CIV-023',
      name: 'Foundation Construction',
      wbs: 'WBS-01.03',
      plannedQuantity: 80,
      actualQuantity: 65,
      unit: 'm³',
      status: 'DELAYED',
      assignedToId: se1.id,
      plannedStart: new Date('2026-05-01'),
      plannedEnd: new Date('2026-07-15'),
    },
    {
      projectId: proj1.id,
      activityCode: 'CIV-034',
      name: 'Pier Shaft & Pier Cap Casting',
      wbs: 'WBS-01.04',
      plannedQuantity: 36,
      actualQuantity: 24,
      unit: 'piers',
      status: 'IN_PROGRESS',
      assignedToId: se1.id,
      plannedStart: new Date('2026-06-01'),
      plannedEnd: new Date('2026-09-30'),
    },
    {
      projectId: proj1.id,
      activityCode: 'CIV-045',
      name: 'Pre-cast Box Girder Launching',
      wbs: 'WBS-01.05',
      plannedQuantity: 28,
      actualQuantity: 14,
      unit: 'spans',
      status: 'IN_PROGRESS',
      assignedToId: se1.id,
      plannedStart: new Date('2026-07-01'),
      plannedEnd: new Date('2026-11-30'),
    },
    {
      projectId: proj1.id,
      activityCode: 'TRK-001',
      name: 'Ballastless Track Slab Concreting',
      wbs: 'WBS-02.01',
      plannedQuantity: 12000,
      actualQuantity: 4200,
      unit: 'm',
      status: 'IN_PROGRESS',
      assignedToId: se2.id,
      plannedStart: new Date('2026-08-01'),
      plannedEnd: new Date('2026-11-15'),
    },
    {
      projectId: proj1.id,
      activityCode: 'ELE-011',
      name: '25kV OHE Overhead Traction Installation',
      wbs: 'WBS-02.02',
      plannedQuantity: 24,
      actualQuantity: 5,
      unit: 'km',
      status: 'IN_PROGRESS',
      assignedToId: se2.id,
      plannedStart: new Date('2026-09-01'),
      plannedEnd: new Date('2026-12-10'),
    },
    {
      projectId: proj1.id,
      activityCode: 'SIG-002',
      name: 'CBTC Signaling & Train Control Cabling',
      wbs: 'WBS-02.03',
      plannedQuantity: 18,
      actualQuantity: 0,
      unit: 'km',
      status: 'NOT_STARTED',
      assignedToId: se2.id,
      plannedStart: new Date('2026-10-01'),
      plannedEnd: new Date('2026-12-25'),
    },
    {
      projectId: proj1.id,
      activityCode: 'STA-005',
      name: 'Station Finishes & Platform Screen Doors',
      wbs: 'WBS-03.01',
      plannedQuantity: 4,
      actualQuantity: 1,
      unit: 'stations',
      status: 'IN_PROGRESS',
      assignedToId: se1.id,
      plannedStart: new Date('2026-08-15'),
      plannedEnd: new Date('2026-12-20'),
    },
    {
      projectId: proj2.id,
      activityCode: 'MEP-008',
      name: 'HVAC & Auxiliary Substation Installation',
      wbs: 'WBS-03.02',
      plannedQuantity: 100,
      actualQuantity: 20,
      unit: '%',
      status: 'IN_PROGRESS',
      assignedToId: se2.id,
      plannedStart: new Date('2026-09-01'),
      plannedEnd: new Date('2026-12-15'),
    },
  ];

  for (const act of activitiesData) {
    const existing = await prisma.activity.findFirst({
      where: { projectId: act.projectId, activityCode: act.activityCode }
    });
    if (!existing) {
      const created = await prisma.activity.create({ data: act });

      // Add sample risk for CIV-023
      if (act.activityCode === 'CIV-023') {
        await prisma.risk.create({
          data: {
            activityId: created.id,
            riskLevel: 'HIGH',
            probability: 0.85,
            estimatedDelay: '4 Days',
            cause: 'Ready-mix concrete delivery bottlenecks and monsoon water-table surge.',
            recommendation: 'Prioritize material delivery, mobilize secondary batching plant, and increase manpower.',
          }
        });

        // Add sample pending progress update
        await prisma.progressUpdate.create({
          data: {
            activityId: created.id,
            submittedById: se1.id,
            actualQuantity: 65,
            actualPercentage: 81.25,
            remarks: 'Casting completed for Pier 14 & 15. Pier 16 awaiting rebar inspection clearance.',
            status: 'PENDING',
          }
        });
      }
    }
  }

  console.log('✓ 10 Infrastructure activities seeded.');
  console.log('\n=========================================');
  console.log('DEMO CREDENTIALS:');
  console.log('Project Manager: pm@infrasync.demo / password123');
  console.log('Site Engineer 1: se@infrasync.demo / password123');
  console.log('Site Engineer 2: se2@infrasync.demo / password123');
  console.log('=========================================\n');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
