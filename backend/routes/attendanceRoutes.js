import express from 'express';
import Attendance from '../models/Attendance.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();
const teacherOnly = requireRole('teacher', 'admin');

// Get the current teacher's attendance records
router.get('/', auth, teacherOnly, async (req, res) => {
    try {
        const filter = { teacher: req.user._id };
        if (req.query.course) filter.course = req.query.course;

        const records = await Attendance.find(filter)
            .populate('course', 'title')
            .populate('records.student', 'name')
            .sort({ date: -1 });

        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Record attendance for a course/date
router.post('/', auth, teacherOnly, async (req, res) => {
    try {
        const { course, date, records } = req.body;

        if (!course || !date || !Array.isArray(records)) {
            return res.status(400).json({ message: 'course, date, and records are required' });
        }

        const attendance = await Attendance.create({
            teacher: req.user._id,
            course,
            date,
            records,
        });

        const populated = await attendance.populate([
            { path: 'course', select: 'title' },
            { path: 'records.student', select: 'name' },
        ]);

        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
