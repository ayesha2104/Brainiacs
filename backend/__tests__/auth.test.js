import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = (await import('../app.js')).default;
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

const studentPayload = {
  name: 'Test Student',
  email: 'student@test.com',
  password: 'password123',
  role: 'student',
  studentProfile: {
    studentId: 'S001',
    course: 'CSE',
    semester: '3',
    degree: 'BTech',
  },
};

describe('POST /api/auth/signup', () => {
  it('creates a new student account and returns a token', async () => {
    const res = await request(app).post('/api/auth/signup').send(studentPayload);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(studentPayload.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects a signup missing required student profile fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'No Profile',
      email: 'noprofile@test.com',
      password: 'password123',
      role: 'student',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('rejects duplicate email signups', async () => {
    await request(app).post('/api/auth/signup').send(studentPayload);
    const res = await request(app).post('/api/auth/signup').send(studentPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(studentPayload);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: studentPayload.email,
      password: studentPayload.password,
      role: 'student',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: studentPayload.email,
      password: 'wrong-password',
      role: 'student',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('rejects login with a mismatched role', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: studentPayload.email,
      password: studentPayload.password,
      role: 'teacher',
    });

    expect(res.status).toBe(403);
  });
});

describe('Protected routes', () => {
  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/courses');
    expect(res.status).toBe(401);
  });

  it('allows access with a valid token', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send(studentPayload);
    const token = signupRes.body.token;

    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
