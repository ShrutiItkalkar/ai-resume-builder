require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Enable CORS for frontend application
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));

// Parse JSON request bodies with body size limit
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Server is running!',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Resume routes
app.use('/api/resumes', resumeRoutes);

// Protected test route
app.get(
  '/api/protected-test',
  authMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: `You are logged in as user ${req.user.id}`,
    });
  }
);

// Global Central Error Middleware (prevents stack trace leaks to client)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
});

module.exports = app;
