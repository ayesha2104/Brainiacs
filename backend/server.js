import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Add this import
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

dotenv.config();
const app = express();

// Enable CORS with the specific origin
app.use(cors({
  origin: 'http://localhost:5173',  // Allow requests only from this URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
  credentials: true,  // Allow credentials (cookies, headers, etc.)
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
