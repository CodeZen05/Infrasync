import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import pmRoutes from './routes/pmRoutes.js';
import seRoutes from './routes/seRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { checkDatabaseConnection } from './utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve static uploaded site evidence
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.status(200).json({
    status: 'healthy',
    service: 'InfraSync API Gateway',
    version: '1.0.0 (Phase 4 - AI Evidence Analysis)',
    database: dbStatus.connected ? 'connected' : 'disconnected (running fallback mode)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/pm', pmRoutes);
app.use('/api/se', seRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/ai', aiRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// Start Server
const server = app.listen(PORT, async () => {
  console.log(`\n==================================================`);
  console.log(`🚀 InfraSync API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Environment: ${process.env.NODE_ENV || 'development'}`);
  
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log(`🗄️  PostgreSQL: Connected successfully via Prisma`);
  } else {
    console.log(`⚠️  PostgreSQL: Not detected on localhost:5432`);
    console.log(`ℹ️  Running in demo-resilient fallback mode. Seed accounts ready:`);
    console.log(`   - PM: pm@infrasync.demo / password123`);
    console.log(`   - SE: se@infrasync.demo / password123`);
  }
  console.log(`==================================================\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by an existing process.`);
    console.error(`👉 Run this one-line command to free the port:`);
    console.error(`   kill -9 $(lsof -ti :${PORT})\n`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

export default app;
