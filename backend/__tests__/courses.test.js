import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.JWT_SECRET = 'test-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

let mongod;
let app;

const teacher = {
  name: 'Teach Er',
  email: 'teacher@test.com',
  password: 'password123',
  role: 'teacher',
  teacherProfile: { teacherId: 'T1', department: 'CS', specialization: 'AI' },
};

const student = {
  name: 'Stu Dent',
  email: 'student@test.com',
  password: 'password123',
  role: 'student',
  studentProfile: { studentId: 'S1', course: 'CSE', semester: '1', degree: 'BTech' },
};

async function signup(app, payload) {
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

describe('Courses authorization', () => {
  it('lets a teacher create a course', async () => {
    const token = await signup(app, teacher);

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Intro to CS',
        description: 'Basics',
        instructor: 'Teach Er',
        startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Intro to CS');
  });

  it('blocks a student from creating a course', async () => {
    const token = await signup(app, student);

    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Hack Attempt', description: 'x', instructor: 'x', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString() });

    expect(res.status).toBe(403);
  });

  it('paginates the course list', async () => {
    const token = await signup(app, teacher);
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `Course ${i}`, description: 'x', instructor: 'x', startDate: new Date().toISOString(), endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString() });
    }

    const res = await request(app)
      .get('/api/courses?page=1&limit=2')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.total).toBe(3);
    expect(res.body.totalPages).toBe(2);
  });
});

describe('Homework authorization', () => {
  it('blocks a student from creating homework for the whole class', async () => {
    const token = await signup(app, student);

    const res = await request(app)
      .post('/api/homeworks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'HW1', description: 'x', courseName: 'CSE101', dueDate: new Date().toISOString() });

    expect(res.status).toBe(403);
  });

  it('lets a teacher create homework assigned to all students', async () => {
    const teacherToken = await signup(app, teacher);
    await signup(app, student);

    const res = await request(app)
      .post('/api/homeworks')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ title: 'HW1', description: 'x', courseName: 'CSE101', dueDate: new Date().toISOString() });

    expect(res.status).toBe(201);
    expect(res.body.length).toBe(1);
  });
});
