import express from 'express';
import Goal from '../models/Goal.js';
import auth from '../middleware/auth.js';
import { paginate } from '../utils/pagination.js';

const router = express.Router();

// Get the current student's own goals
router.get('/', auth, async (req, res) => {
    try {
        const { page, limit, skip } = paginate(req.query);
        const filter = { student: req.user._id };
        if (req.query.status) filter.status = req.query.status;

        const [goals, total] = await Promise.all([
            Goal.find(filter).sort({ targetDate: 1 }).skip(skip).limit(limit),
            Goal.countDocuments(filter),
        ]);

        res.json({ data: goals, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, targetDate } = req.body;

        if (!title || !targetDate) {
            return res.status(400).json({ message: 'Title and target date are required' });
        }

        const goal = await Goal.create({
            student: req.user._id,
            title,
            description,
            category,
            targetDate,
        });

        res.status(201).json(goal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a goal (progress, status, details) — owner only
router.patch('/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, student: req.user._id });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const { title, description, category, targetDate, progress, status } = req.body;
        if (title !== undefined) goal.title = title;
        if (description !== undefined) goal.description = description;
        if (category !== undefined) goal.category = category;
        if (targetDate !== undefined) goal.targetDate = targetDate;
        if (progress !== undefined) goal.progress = progress;
        if (status !== undefined) goal.status = status;

        // Reaching 100% progress marks the goal complete automatically
        if (goal.progress >= 100) goal.status = 'completed';

        await goal.save();
        res.json(goal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a goal — owner only
router.delete('/:id', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, student: req.user._id });
        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        await goal.deleteOne();
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
