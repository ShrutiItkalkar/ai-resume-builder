require('dotenv').config();
const express = require('express');
const authRoutes = require('./src/routes/auth.routes');
const authMiddleware = require('./src/routes/middleware/auth.Middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // lets Express parse JSON request bodies

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// A protected test route to prove middleware works
app.get('/api/protected-test', authMiddleware, (req, res) => {
  res.json({ success: true, message: `You are logged in as user ${req.user.id}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});