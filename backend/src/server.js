import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import seamlessRoutes from './routes/seamlessRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import configRoutes from './routes/configRoutes.js';
import luckyWheelRoutes from './routes/luckyWheelRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins during dev
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for dev
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CK44 iGaming Core Engine',
    timestamp: new Date(),
    architecture: 'MERN Stack (MongoDB, Express, React, Node.js)',
  });
});

// CK44 Dynamic Domain Route Failover Simulation
app.get('/api/wps/system/domainRoute', (req, res) => {
  res.json({
    code: '0',
    data: {
      activeLine: 'line1.ck44-node.internal',
      mirrorLines: [
        { url: 'https://line1.ck44-node.internal', ping: 45 },
        { url: 'https://line2.ck44-node.internal', ping: 72 },
        { url: 'https://line3.ck44-node.internal', ping: 110 },
      ],
      announcement: 'স্বাগতম CK44 বাংলাদেশ অফিসিয়াল গেমিং প্ল্যাটফর্মে। ডিপোজিট বোনাস ও লাইভ ক্যাসিনো উপভোগ করুন।',
    },
  });
});

// API Routes
app.use('/api/wps', authRoutes);
app.use('/api/seamless', seamlessRoutes);
app.use('/api/wallet', paymentRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/config', configRoutes);
app.use('/api/lucky-wheel', luckyWheelRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.send('🎰 CK44 iGaming Engine API is running smoothly.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [CK44 Backend Server] Running on http://localhost:${PORT}`);
    console.log(`📡 Seamless Wallet Webhooks: http://localhost:${PORT}/api/seamless`);
  });
}

export default app;
