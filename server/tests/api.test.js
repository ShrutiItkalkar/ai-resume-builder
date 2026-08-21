const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma');

// Mock AI service
const aiService = require('../src/services/aiService');
aiService.generateResumeContent = async () => ({
  summary: 'Mocked AI Tailored Summary',
  skills: ['React', 'Node.js'],
  experiences: [],
  atsKeywords: ['Fullstack'],
  suggestions: ['Quantify bullet points'],
});

describe('AI Resume Builder API Test Suite', () => {
  let token1, token2;
  let user1Id, user2Id;
  let resume1Id;

  const testUser1 = {
    email: `test_user_1_${Date.now()}@example.com`,
    password: 'password123',
    name: 'User One',
  };

  const testUser2 = {
    email: `test_user_2_${Date.now()}@example.com`,
    password: 'password456',
    name: 'User Two',
  };

  after(async () => {
    if (user1Id) await prisma.user.delete({ where: { id: user1Id } }).catch(() => {});
    if (user2Id) await prisma.user.delete({ where: { id: user2Id } }).catch(() => {});
    await prisma.$disconnect();
  });

  test('POST /api/auth/signup - Success', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser1);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.user.email, testUser1.email);
    assert.strictEqual(res.body.data.user.passwordHash, undefined);

    token1 = res.body.data.token;
    user1Id = res.body.data.user.id;
  });

  test('POST /api/auth/signup - Duplicate Rejection (409)', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser1);
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'Email already registered');
  });

  test('POST /api/auth/login - Success', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser1.email,
      password: testUser1.password,
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
  });

  test('POST /api/auth/login - Wrong Password (401)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser1.email,
      password: 'wrongpassword',
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error, 'Invalid credentials');
  });

  test('GET /api/auth/me - Restores Session', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token1}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.email, testUser1.email);
  });

  test('GET /api/protected-test - Without Token (401)', async () => {
    const res = await request(app).get('/api/protected-test');
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  test('GET /api/protected-test - Valid Token (200)', async () => {
    const res = await request(app)
      .get('/api/protected-test')
      .set('Authorization', `Bearer ${token1}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  test('POST /api/resumes - Create Resume Success', async () => {
    const res = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        title: 'Full Stack Engineer Resume',
        jobDescription: 'Looking for Node.js & React developer',
        skills: ['JavaScript', 'React'],
      });

    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    resume1Id = res.body.data.id;
  });

  test('GET /api/resumes - List Resumes', async () => {
    const res = await request(app)
      .get('/api/resumes')
      .set('Authorization', `Bearer ${token1}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('GET /api/resumes/:id - Ownership Check for User 2 (403)', async () => {
    // Register User 2
    const resSignup = await request(app).post('/api/auth/signup').send(testUser2);
    token2 = resSignup.body.data.token;
    user2Id = resSignup.body.data.user.id;

    // User 2 attempts to fetch User 1's resume
    const res = await request(app)
      .get(`/api/resumes/${resume1Id}`)
      .set('Authorization', `Bearer ${token2}`);

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.success, false);
  });

  test('POST /api/resumes/:id/generate - AI Generation', async () => {
    const res = await request(app)
      .post(`/api/resumes/${resume1Id}/generate`)
      .set('Authorization', `Bearer ${token1}`)
      .send({ jobDescription: 'Fullstack Dev' });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.result.summary);
  });

  test('DELETE /api/resumes/:id - Delete Resume Success', async () => {
    const res = await request(app)
      .delete(`/api/resumes/${resume1Id}`)
      .set('Authorization', `Bearer ${token1}`);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });
});
