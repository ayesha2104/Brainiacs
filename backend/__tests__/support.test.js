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

describe('POST /api/support/tickets', () => {
  it('lets anyone (no auth) submit a support ticket', async () => {
    const res = await request(app).post('/api/support/tickets').send({
      name: 'Anon User',
      email: 'anon@test.com',
      subject: 'Help',
      message: 'Something is broken',
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('open');
  });

  it('rejects a ticket missing required fields', async () => {
    const res = await request(app).post('/api/support/tickets').send({ name: 'No Subject' });
    expect(res.status).toBe(400);
  });
});

describe('GET/PATCH /api/support/tickets', () => {
  async function createTicket() {
    const res = await request(app).post('/api/support/tickets').send({
      name: 'Anon User',
      email: 'anon@test.com',
      subject: 'Help',
      message: 'Something is broken',
    });
    return res.body._id;
  }

  it('blocks a student from listing tickets', async () => {
    const token = await signup(student);
    const res = await request(app).get('/api/support/tickets').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('lets a teacher list and paginate tickets', async () => {
    const token = await signup(teacher);
    await createTicket();
    await createTicket();

    const res = await request(app)
      .get('/api/support/tickets?page=1&limit=1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.total).toBe(2);
  });

  it('lets a teacher update a ticket status and add a response', async () => {
    const token = await signup(teacher);
    const ticketId = await createTicket();

    const res = await request(app)
      .patch(`/api/support/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in-progress', response: 'Looking into it' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('in-progress');
    expect(res.body.responses.length).toBe(1);
  });

  it('blocks a student from updating a ticket', async () => {
    const studentToken = await signup(student);
    const ticketId = await createTicket();

    const res = await request(app)
      .patch(`/api/support/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ status: 'resolved' });

    expect(res.status).toBe(403);
  });
});
