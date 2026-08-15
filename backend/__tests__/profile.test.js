import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';
import os from 'os';

process.env.JWT_SECRET = 'test-secret';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const testAvatarDir = fs.mkdtempSync(path.join(os.tmpdir(), 'brainiacs-avatars-'));
process.env.AVATAR_UPLOAD_DIR = testAvatarDir;

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
  fs.rmSync(testAvatarDir, { recursive: true, force: true });
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  for (const f of fs.readdirSync(testAvatarDir)) {
    fs.unlinkSync(path.join(testAvatarDir, f));
  }
});

// 1x1 transparent PNG
const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);

describe('GET/PUT /api/profile/student', () => {
  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/api/profile/student');
    expect(res.status).toBe(401);
  });

  it('returns the student profile for the logged-in user', async () => {
    const token = await signup(student);
    const res = await request(app).get('/api/profile/student').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.studentId).toBe('S1');
  });

  it('updates the student profile', async () => {
    const token = await signup(student);
    const res = await request(app)
      .put('/api/profile/student')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Hello world', interests: ['AI', 'Robotics'] });

    expect(res.status).toBe(200);
    expect(res.body.bio).toBe('Hello world');
    expect(res.body.interests).toEqual(['AI', 'Robotics']);
  });
});

describe('POST /api/profile/student/avatar', () => {
  it('accepts a valid PNG upload', async () => {
    const token = await signup(student);
    const res = await request(app)
      .post('/api/profile/student/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', PNG_BYTES, 'avatar.png');

    expect(res.status).toBe(200);
    expect(res.body.avatar).toMatch(/^\/uploads\/avatars\//);
  });

  it('rejects a file whose content is not actually an image', async () => {
    const token = await signup(student);
    const fakeImage = Buffer.from('this is definitely not a png file');
    const res = await request(app)
      .post('/api/profile/student/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', fakeImage, 'avatar.png');

    expect(res.status).toBe(400);
  });
});
