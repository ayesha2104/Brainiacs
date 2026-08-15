import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Protected route
router.get('/dashboard', auth, (req, res) => {
  res.json({ message: `Welcome, User ID: ${req.user.id}` });
});

export default router;
