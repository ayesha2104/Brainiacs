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

async function signup(payload) {
  const res = await request(app).post('/api/auth/signup').send(payload);
  return { token: res.body.token, userId: res.body.user._id };
}

async function createCourse(token) {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'CSE101',
      description: 'Intro',
      instructor: 'Prof',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  return res.body._id;
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

describe('Course enrollment', () => {
  it('lets a student enroll and unenroll in a course', async () => {
    const { token: teacherToken } = await signup(teacher);
    const courseId = await createCourse(teacherToken);
    const { token: studentToken, userId } = await signup(student);

    const enrollRes = await request(app)
      .post(`/api/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(enrollRes.status).toBe(200);
    expect(enrollRes.body.enrolledStudents).toContain(userId);

    const mineRes = await request(app)
      .get('/api/courses?enrolled=true')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(mineRes.body.data.length).toBe(1);
    expect(mineRes.body.data[0]._id).toBe(courseId);

    const unenrollRes = await request(app)
      .delete(`/api/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(unenrollRes.status).toBe(200);
    expect(unenrollRes.body.enrolledStudents).not.toContain(userId);
  });

  it('lets a teacher see the real roster for their course', async () => {
    const { token: teacherToken } = await signup(teacher);
    const courseId = await createCourse(teacherToken);
    const { token: studentToken } = await signup(student);

    await request(app)
      .post(`/api/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`);

    const res = await request(app)
      .get(`/api/courses/${courseId}/students`)
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Stu Dent');
  });

  it('blocks a student from viewing the course roster', async () => {
    const { token: teacherToken } = await signup(teacher);
    const courseId = await createCourse(teacherToken);
    const { token: studentToken } = await signup(student);

    const res = await request(app)
      .get(`/api/courses/${courseId}/students`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it('filters courses by mine=true for a teacher', async () => {
    const { token: teacherToken } = await signup(teacher);
    await createCourse(teacherToken);

    const res = await request(app)
      .get('/api/courses?mine=true')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(res.body.data.length).toBe(1);
  });
});
