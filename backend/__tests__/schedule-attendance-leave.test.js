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

describe('Schedules', () => {
  it('rejects unauthenticated and student access', async () => {
    const noAuth = await request(app).get('/api/schedules');
    expect(noAuth.status).toBe(401);

    const { token: studentToken } = await signup(student);
    const studentRes = await request(app).get('/api/schedules').set('Authorization', `Bearer ${studentToken}`);
    expect(studentRes.status).toBe(403);
  });

  it('lets a teacher create and list their own schedule entries', async () => {
    const { token } = await signup(teacher);
    const courseId = await createCourse(token);

    const createRes = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ course: courseId, day: 'Monday', startTime: '10:00', endTime: '11:00', room: '301' });

    expect(createRes.status).toBe(201);
    expect(createRes.body.course.title).toBe('CSE101');

    const listRes = await request(app).get('/api/schedules').set('Authorization', `Bearer ${token}`);
    expect(listRes.body.length).toBe(1);
  });

  it('rejects incomplete schedule payloads', async () => {
    const { token } = await signup(teacher);
    const res = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${token}`)
      .send({ day: 'Monday' });
    expect(res.status).toBe(400);
  });
});

describe('Attendance', () => {
  it('lets a teacher record and list attendance for enrolled students', async () => {
    const { token: teacherToken } = await signup(teacher);
    const courseId = await createCourse(teacherToken);
    const { token: studentToken, userId: studentId } = await signup(student);

    await request(app).post(`/api/courses/${courseId}/enroll`).set('Authorization', `Bearer ${studentToken}`);

    const createRes = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        course: courseId,
        date: new Date().toISOString(),
        records: [{ student: studentId, status: 'present' }],
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.records[0].status).toBe('present');

    const listRes = await request(app).get('/api/attendance').set('Authorization', `Bearer ${teacherToken}`);
    expect(listRes.body.length).toBe(1);
  });

  it('blocks a student from recording attendance', async () => {
    const { token: teacherToken } = await signup(teacher);
    const courseId = await createCourse(teacherToken);
    const { token: studentToken } = await signup(student);

    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ course: courseId, date: new Date().toISOString(), records: [] });

    expect(res.status).toBe(403);
  });
});

describe('Leave applications', () => {
  it('lets a teacher submit and list their own leave applications', async () => {
    const { token } = await signup(teacher);

    const createRes = await request(app)
      .post('/api/leave-applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Sick leave',
        reason: 'Fever',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'sick',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('pending');

    const listRes = await request(app)
      .get('/api/leave-applications')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.body.length).toBe(1);
  });

  it('blocks a student from submitting a leave application', async () => {
    const { token } = await signup(student);
    const res = await request(app)
      .post('/api/leave-applications')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'x', reason: 'x', startDate: new Date().toISOString(), endDate: new Date().toISOString(), type: 'sick' });
    expect(res.status).toBe(403);
  });
});
