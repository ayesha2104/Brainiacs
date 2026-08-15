import express from 'express';
import Schedule from '../models/Schedule.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();
const teacherOnly = requireRole('teacher', 'admin');

// Get the current teacher's own class schedule
router.get('/', auth, teacherOnly, async (req, res) => {
    try {
        const schedules = await Schedule.find({ teacher: req.user._id })
            .populate('course', 'title');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new schedule entry
router.post('/', auth, teacherOnly, async (req, res) => {
    try {
        const { course, day, startTime, endTime, room } = req.body;

        if (!course || !day || !startTime || !endTime || !room) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const schedule = await Schedule.create({
            teacher: req.user._id,
            course,
            day,
            startTime,
            endTime,
            room,
        });

        const populated = await schedule.populate('course', 'title');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a schedule entry (owner only)
router.delete('/:id', auth, teacherOnly, async (req, res) => {
    try {
        const schedule = await Schedule.findOne({ _id: req.params.id, teacher: req.user._id });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        await schedule.deleteOne();
        res.json({ message: 'Schedule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
