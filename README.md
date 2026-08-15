# Brainiacs

A role-based college ERP platform for students and teachers — courses, homework, profiles, statistics, and support tickets.

## Stack

- **Frontend**: React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT auth, Joi validation, Redis (optional caching)
- **Infra**: Docker, docker-compose

## Local development

```bash
# Backend
cd backend
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Running with Docker

```bash
JWT_SECRET=your-long-random-secret docker compose up --build
```

This starts MongoDB, Redis, the backend API (`:5000`), and the frontend (`:4173`).

## API

All routes are prefixed with `/api`. Auth uses JWT bearer tokens (`Authorization: Bearer <token>`).

- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/courses`, `GET/POST/PUT/DELETE /api/courses/:id`
- `GET/POST /api/homeworks`, `PATCH /api/homeworks/:id/status`, `PATCH /api/homeworks/:id/grade`
- `GET /api/statistics` (cached via Redis when `REDIS_URL` is set)
- `GET/PUT /api/profile/student`, `GET/PUT /api/profile/teacher`, avatar upload endpoints
- `POST /api/support/tickets`, `GET /api/support/tickets`
- `GET /api/health`
