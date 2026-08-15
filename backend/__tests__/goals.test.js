import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

let mongod;
let app;

const student = {
  name: 'Stu Dent',
  email: 'student@test.com',
  password: 'password123',
  role: 'student',
  studentProfile: { studentId: 'S1', course: 'CSE', semester: '1', degree: 'BTech' },
};

const otherStudent = {
  name: 'Other Student',
  email: 'other@test.com',
  password: 'password123',
  role: 'student',
  studentProfile: { studentId: 'S2', course: 'CSE', semester: '1', degree: 'BTech' },
};

async function signup(payload) {
  const res = await request(app).post('/api/auth/signup').send(payload);
  return res.body.token;
}

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

describe('Goals', () => {
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/goals');
    expect(res.status).toBe(401);
  });

  it('creates a goal and lists it back', async () => {
    const token = await signup(student);

    const createRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Finish DSA course', category: 'academic', targetDate: '2026-12-01' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('active');
    expect(createRes.body.progress).toBe(0);

    const listRes = await request(app).get('/api/goals').set('Authorization', `Bearer ${token}`);
    expect(listRes.body.data.length).toBe(1);
  });

  it('rejects a goal missing required fields', async () => {
    const token = await signup(student);
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No date' });
    expect(res.status).toBe(400);
  });

  it('updates progress and auto-completes at 100%', async () => {
    const token = await signup(student);
    const createRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Read 5 books', targetDate: '2026-12-01' });

    const patchRes = await request(app)
      .patch(`/api/goals/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ progress: 100 });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.progress).toBe(100);
    expect(patchRes.body.status).toBe('completed');
  });

  it('does not let a student see or modify another student\'s goal', async () => {
    const token = await signup(student);
    const otherToken = await signup(otherStudent);

    const createRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Private goal', targetDate: '2026-12-01' });

    const listRes = await request(app).get('/api/goals').set('Authorization', `Bearer ${otherToken}`);
    expect(listRes.body.data.length).toBe(0);

    const patchRes = await request(app)
      .patch(`/api/goals/${createRes.body._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ progress: 50 });
    expect(patchRes.status).toBe(404);

    const deleteRes = await request(app)
      .delete(`/api/goals/${createRes.body._id}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(deleteRes.status).toBe(404);
  });

  it('deletes a goal', async () => {
    const token = await signup(student);
    const createRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Temp goal', targetDate: '2026-12-01' });

    const deleteRes = await request(app)
      .delete(`/api/goals/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const listRes = await request(app).get('/api/goals').set('Authorization', `Bearer ${token}`);
    expect(listRes.body.data.length).toBe(0);
  });
});
