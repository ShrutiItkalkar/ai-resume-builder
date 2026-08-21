const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Basic check — we'll add proper validation in Milestone 4
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    // Hash the password — 10 is the "salt rounds" (cost factor)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    // Issue a JWT immediately so they're logged in right after signup
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;