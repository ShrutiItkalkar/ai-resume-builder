require('dotenv').config();

const express = require('express');

const authRoutes = require('./src/routes/auth.routes');
const resumeRoutes = require('./src/routes/resume.routes');
const authMiddleware = require('./src/middleware/authMiddleware');

const app = express();

const PORT = process.env.PORT || 5000;

// Parse JSON request bodies
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});