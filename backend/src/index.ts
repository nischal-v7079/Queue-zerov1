import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Default environment fallbacks to ensure backend runs out of the box
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'qzero_super_secret_jwt_key_hackathon_2026_dev_mode';
}

import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import kioskRoutes from './routes/kiosks.js';
import slotRoutes from './routes/slots.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payments.js';
import verificationRoutes from './routes/verification.js';
import notificationRoutes from './routes/notifications.js';
import supportRoutes from './routes/support.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directory exists and serve files statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../uploads');
import fs from 'fs';
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    platform: 'QueueZero (Q-Zero) Campus Print Fleet Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0-hackathon',
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/kiosks', kioskRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Listen on 0.0.0.0 to bind both IPv4 and IPv6 interfaces
const server = app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 QueueZero (Q-Zero) API Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Local URL:   http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server process terminated gracefully');
  });
});
