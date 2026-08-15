import express from 'express';
import LeaveApplication from '../models/LeaveApplication.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();
const teacherOnly = requireRole('teacher', 'admin');

// Get the current teacher's own leave applications
router.get('/', auth, teacherOnly, async (req, res) => {
    try {
        const applications = await LeaveApplication.find({ teacher: req.user._id })
            .sort({ submittedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit a leave application
router.post('/', auth, teacherOnly, async (req, res) => {
    try {
        const { title, reason, startDate, endDate, type } = req.body;

        if (!title || !reason || !startDate || !endDate || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const application = await LeaveApplication.create({
            teacher: req.user._id,
            title,
            reason,
            startDate,
            endDate,
            type,
        });

        res.status(201).json(application);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
