import express from 'express';
import Homework from '../models/Homework.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { paginate } from '../utils/pagination.js';

const router = express.Router();

// Get all homeworks for a teacher
router.get('/teacher', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teachers only.' });
        }

        const { page, limit, skip } = paginate(req.query);
        const filter = {};
        if (req.query.status) filter.status = req.query.status;

        const [homeworks, total] = await Promise.all([
            Homework.find(filter)
                .populate('assignedTo', 'name email')
                .sort({ dueDate: 1 })
                .skip(skip)
                .limit(limit),
            Homework.countDocuments(filter),
        ]);

        res.json({ data: homeworks, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error fetching teacher homeworks:', error);
        res.status(500).json({ message: 'Failed to fetch homeworks' });
    }
});

// Get all homeworks for a student
router.get('/student', auth, async (req, res) => {
    try {
        const { page, limit, skip } = paginate(req.query);
        const filter = { assignedTo: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const [homeworks, total] = await Promise.all([
            Homework.find(filter).sort({ dueDate: 1 }).skip(skip).limit(limit),
            Homework.countDocuments(filter),
        ]);

        res.json({ data: homeworks, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('Error fetching student homeworks:', error);
        res.status(500).json({ message: 'Failed to fetch homeworks' });
    }
});

// Get all homeworks for the current user
router.get('/', auth, async (req, res) => {
    try {
        const { page, limit, skip } = paginate(req.query);
        const filter = { assignedTo: req.user.id };
        if (req.query.status) filter.status = req.query.status;

        const [homeworks, total] = await Promise.all([
            Homework.find(filter).sort({ dueDate: 1 }).skip(skip).limit(limit),
            Homework.countDocuments(filter),
        ]);

        res.json({ data: homeworks, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific homework
router.get('/:id', auth, async (req, res) => {
    try {
        const homework = await Homework.findById(req.params.id)
            .populate('assignedTo', 'name email');
        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }
        res.json(homework);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create homework
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teachers only.' });
        }

        const { title, description, courseName, dueDate } = req.body;

        if (!title || !description || !courseName || !dueDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const students = await User.find({ role: 'student' });

        if (students.length === 0) {
            return res.status(400).json({ message: 'No students found in the system' });
        }

        const homeworks = await Homework.insertMany(
            students.map((student) => ({
                title,
                description,
                courseName,
                dueDate,
                assignedTo: student._id,
                status: 'pending',
            }))
        );

        res.status(201).json(homeworks);
    } catch (error) {
        console.error('Error in homework creation:', error);
        res.status(500).json({ message: 'Failed to create homework' });
    }
});

// Update homework status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, submissionUrl } = req.body;
        const homework = await Homework.findById(req.params.id);

        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }

        if (homework.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        homework.status = status;
        if (submissionUrl) {
            homework.submissionUrl = submissionUrl;
            homework.submissionDate = new Date();
        }

        await homework.save();
        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update homework' });
    }
});

// Grade homework
router.patch('/:id/grade', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { grade, feedback } = req.body;
        const homework = await Homework.findById(req.params.id);

        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }

        homework.grade = grade;
        homework.feedback = feedback;
        await homework.save();

        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: 'Failed to grade homework' });
    }
});

// Delete a homework
router.delete('/:id', auth, async (req, res) => {
    try {
        const homework = await Homework.findOne({
            _id: req.params.id,
            assignedTo: req.user.id
        });

        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }

        await homework.deleteOne();
        res.json({ message: 'Homework deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
