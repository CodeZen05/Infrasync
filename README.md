# InfraSync - Intelligent Planning-to-Execution Bridge for Infrastructure Projects

**InfraSync** is an AI-powered enterprise infrastructure project progress tracking platform designed to bridge the gap between Primavera/MS Project schedules and real-world construction site execution.

---

## Phase 3: Role-Based Project Dashboards + Real Database Data

Phase 3 introduces interactive, production-grade dashboards for both **Project Managers** and **Site Engineers** reading and writing from a shared PostgreSQL database via Prisma ORM:

- **Project Manager Dashboard**: High-level overview, 4 KPI cards, active project summary, Recharts Planned vs Actual S-curve progress chart, WBS activities variance table, project risks panel, and live pending DPR approvals with 1-click Approve / Reject actions.
- **Site Engineer Dashboard**: 4 KPI cards, my assigned activities, live daily progress reporting (DPR) submission form (saved with `PENDING` status), progress update history with PM feedback remarks, and site evidence upload feed.
- **Strict Role-Based Authorization**: Zero hardcoded stats. Project Managers only access projects they manage; Site Engineers only access assigned packages and their own submissions. Cross-role API requests are blocked with `403 Forbidden`.

---

## 1. Demo Login Credentials

For testing and demonstration, use the pre-configured accounts:

| Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Project Manager** | `pm@infrasync.demo` | `password123` | `/pm/dashboard` |
| **Site Engineer 1** | `se@infrasync.demo` | `password123` | `/se/dashboard` |
| **Site Engineer 2** | `se2@infrasync.demo` | `password123` | `/se/dashboard` |

> [!TIP]
> On the `/login` screen, click the **1-Click Demo Fill** buttons to instantly log in as either PM or SE.

---

## 2. Interactive End-to-End Demo Flow

Experience the real-time planning-to-execution data synchronization:

1. **Log in as Site Engineer** (`se@infrasync.demo` / `password123`).
2. Go to **Submit Progress** (`/se/progress`).
3. Select `CIV-023 - Foundation Construction`, enter actual quantity (e.g. `72 m³`), and submit.
4. The submission immediately appears in **My Progress Updates** with status **`PENDING`**.
5. **Log out and log in as Project Manager** (`pm@infrasync.demo` / `password123`).
6. Notice the new update in **Pending Approvals** on the PM Dashboard or Approvals page (`/pm/approvals`).
7. Click **Approve**.
8. The update status changes to **`APPROVED`**, the activity's actual quantity updates to `72 m³`, and project variance updates in the database.
9. **Log back in as Site Engineer** -> The update is now confirmed as **`APPROVED`** with PM sign-off remarks!

---

## 3. Project Architecture & Directory Structure

```text
Infrasync 1/
├── client/                           # Frontend (React, Vite, Tailwind CSS, Lucide React, Recharts)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/            # Sidebar, TopNavbar, StatCard, StatusBadge, ProgressBar, LoadingState, etc.
│   │   │   └── ... (Phase 1 landing components preserved)
│   │   ├── context/                  # AuthContext.jsx
│   │   ├── layouts/                  # DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── pm/                   # PMProjectsPage, PMProjectDetailPage, PMActivitiesPage, PMRisksPage, PMApprovalsPage
│   │   │   ├── se/                   # SEActivitiesPage, SEProgressPage, SEEvidencePage
│   │   │   ├── PMDashboard.jsx       # PM Dashboard with live KPIs, Recharts, and approvals
│   │   │   ├── SEDashboard.jsx       # SE Dashboard with assigned activities and submissions
│   │   │   ├── LandingPage.jsx       # Preserved Phase 1 landing page
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── routes/                   # ProtectedRoute.jsx, RoleRoute.jsx, AppRoutes.jsx
│   │   ├── services/                 # pmService.js, seService.js, authService.js, api.js
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js                # Proxies /api to port 5001
│   └── tailwind.config.js
│
├── server/                           # Backend (Node.js, Express, Prisma ORM, JWT, bcrypt)
│   ├── controllers/
│   │   ├── pmController.js           # PM dashboard, projects, activities, risks, approve/reject
│   │   ├── seController.js           # SE dashboard, assigned activities, submit DPR, evidence
│   │   └── authController.js         # register, login, me, logout
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT validation & role authorization
│   │   └── validateMiddleware.js
│   ├── prisma/
│   │   ├── schema.prisma             # PostgreSQL schema with relations & activity assignments
│   │   └── seed.js                   # 2 projects, 2 SEs, 10 activities, risks, DPR updates
│   ├── routes/
│   │   ├── pmRoutes.js               # /api/pm/* (PM Only)
│   │   ├── seRoutes.js               # /api/se/* (SE Only)
│   │   └── authRoutes.js             # /api/auth/*
│   ├── utils/                        # db.js, mockDb.js, jwt.js, password.js
│   ├── server.js                     # Express API gateway (Port 5001)
│   └── .env
│
├── package.json                      # Monorepo scripts
└── README.md                         # Documentation
```

---

## 4. API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account with role
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET  /api/auth/me` - Authenticated user profile

### Project Manager (`/api/pm` - PM Role Only)
- `GET   /api/pm/dashboard` - Executive KPIs, Recharts progress data, recent activities, risks
- `GET   /api/pm/projects` - Managed infrastructure projects list
- `POST  /api/pm/projects` - Create new project
- `GET   /api/pm/projects/:id` - Detailed project view (WBS activities, site team, risks)
- `GET   /api/pm/activities` - All schedule activities with planned vs actual variance
- `GET   /api/pm/risks` - Critical path delay risks and mitigation recommendations
- `GET   /api/pm/approvals` - Pending DPR submissions queue
- `PATCH /api/pm/approvals/:id/approve` - Approve progress update & update activity quantity
- `PATCH /api/pm/approvals/:id/reject` - Reject progress update with corrective remarks

### Site Engineer (`/api/se` - SE Role Only)
- `GET  /api/se/dashboard` - Field KPIs, assigned activities, recent submissions
- `GET  /api/se/projects` - Projects the SE belongs to
- `GET  /api/se/activities` - WBS activities assigned to this engineer
- `GET  /api/se/progress` - Progress updates history with PM review comments
- `POST /api/se/progress` - Submit new DPR progress update (created as `PENDING`)
- `GET  /api/se/evidence` - Site evidence photo and document records
- `POST /api/se/evidence` - Log site evidence metadata

---

## 5. How to Run the Applications

### Option A: Run Concurrently from Root
```bash
cd "/Users/gagantanwar/Infrasync 1"
npm run dev
```

### Option B: Run in Separate Terminals

**Terminal 1 (Backend API - Port 5001):**
```bash
cd "/Users/gagantanwar/Infrasync 1/server"
npm run dev
```

**Terminal 2 (Frontend Client - Port 3000):**
```bash
cd "/Users/gagantanwar/Infrasync 1/client"
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 6. PostgreSQL Database & Migrations

If local PostgreSQL is running on port `5432`:
```bash
cd server
npx prisma db push
npm run prisma:seed
```

> [!NOTE]
> **Zero-Setup Demo Mode**: If PostgreSQL is not active on `localhost:5432`, the backend seamlessly operates in synchronized in-memory mode with all seed data, approval state transitions, and DPR submissions functional without errors.
# Infrasync
