import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Add this import
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/courseRoutes.js';
import homeworkRoutes from './routes/homeworks.js';
import statisticsRoutes from './routes/statistics.js';
import supportRoutes from './routes/support.js';

dotenv.config();
const app = express();

// Enable CORS with the specific origin
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests only from this URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],  // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
  credentials: true,  // Allow credentials (cookies, headers, etc.)
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/homeworks', homeworkRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/support', supportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
