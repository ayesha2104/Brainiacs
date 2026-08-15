import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Homework from '../models/Homework.js';
import Course from '../models/Course.js';

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

async function signup(payload) {
  const res = await request(app).post('/api/auth/signup').send(payload);
  return { token: res.body.token, userId: res.body.user._id };
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

describe('GET /api/statistics', () => {
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/statistics');
    expect(res.status).toBe(401);
  });

  it('returns zeroed stats for a user with no data', async () => {
    const { token } = await signup(student);
    const res = await request(app).get('/api/statistics').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({
      coursesCompleted: 0,
      coursesCompletedChange: 0,
      averageScore: 0,
      averageScoreChange: 0,
      studyHours: 0,
      studyHoursChange: 0,
      assignmentsCompleted: 0,
      assignmentsCompletedChange: 0,
      progressData: [],
      recentAchievements: [],
    });
  });

  it('computes real stats from homework and course data', async () => {
    const { token, userId } = await signup(student);

    await Homework.create([
      { title: 'HW1', description: 'x', courseName: 'CSE101', dueDate: new Date(), assignedTo: userId, status: 'completed', grade: 80 },
      { title: 'HW2', description: 'x', courseName: 'CSE101', dueDate: new Date(), assignedTo: userId, status: 'completed', grade: 90 },
      { title: 'HW3', description: 'x', courseName: 'CSE101', dueDate: new Date(), assignedTo: userId, status: 'pending' },
    ]);

    const course = await Course.create({
      title: 'CSE101',
      description: 'x',
      instructor: 'x',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 100,
      enrolledStudents: [userId],
    });
    course.hoursSpent.set(userId.toString(), 12);
    await course.save();

    const res = await request(app).get('/api/statistics').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.assignmentsCompleted).toBe(2);
    expect(res.body.data.averageScore).toBe(85);
    expect(res.body.data.coursesCompleted).toBe(1);
    expect(res.body.data.studyHours).toBe(12);
  });
});
