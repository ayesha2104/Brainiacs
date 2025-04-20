import express from 'express';
import Homework from '../models/Homework.js';
import { protect as auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all homeworks for a user
router.get('/', auth, async (req, res) => {
    try {
        const homeworks = await Homework.find({ assignedTo: req.user.id })
            .populate('course', 'title')
            .sort({ dueDate: 1 });
        res.json(homeworks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific homework
router.get('/:id', auth, async (req, res) => {
    try {
        const homework = await Homework.findById(req.params.id)
            .populate('course', 'title');
        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }
        res.json(homework);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a homework
router.post('/', auth, async (req, res) => {
    const homework = new Homework({
        title: req.body.title,
        description: req.body.description,
        courseName: req.body.courseName,
        course: req.body.courseId,
        dueDate: req.body.dueDate,
        assignedTo: req.user.id
    });

    try {
        const newHomework = await homework.save();
        res.status(201).json(newHomework);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update homework status
router.patch('/:id', auth, async (req, res) => {
    try {
        const homework = await Homework.findOne({
            _id: req.params.id,
            assignedTo: req.user.id
        });

        if (!homework) {
            return res.status(404).json({ message: 'Homework not found' });
        }

        if (req.body.status) {
            homework.status = req.body.status;
            if (req.body.status === 'completed') {
                homework.submissionDate = new Date();
            }
        }

        if (req.body.submissionUrl) {
            homework.submissionUrl = req.body.submissionUrl;
        }

        const updatedHomework = await homework.save();
        res.json(updatedHomework);
    } catch (err) {
        res.status(400).json({ message: err.message });
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