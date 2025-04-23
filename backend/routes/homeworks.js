import express from 'express';
import Homework from '../models/Homework.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all homeworks for a teacher
router.get('/teacher', auth, async (req, res) => {
    try {
        // Verify the user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teachers only.' });
        }

        console.log('Fetching all homeworks for teacher view');
        const homeworks = await Homework.find({})
            .populate('assignedTo', 'name email')
            .sort({ dueDate: 1 });
        console.log('Found homeworks:', homeworks.length);
        res.json(homeworks);
    } catch (error) {
        console.error('Error fetching teacher homeworks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch homeworks',
            error: error.message
        });
    }
});

// Get all homeworks for a student
router.get('/student', auth, async (req, res) => {
    try {
        console.log('Fetching homeworks for student:', req.user._id);
        const homeworks = await Homework.find({ assignedTo: req.user._id })
            .sort({ dueDate: 1 });
        console.log('Found homeworks:', homeworks.length);
        res.json(homeworks);
    } catch (error) {
        console.error('Error fetching student homeworks:', error);
        res.status(500).json({ 
            message: 'Failed to fetch homeworks',
            error: error.message
        });
    }
});

// Get all homeworks for a user
router.get('/', auth, async (req, res) => {
    try {
        const homeworks = await Homework.find({ assignedTo: req.user.id })
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

// Create homework
router.post('/', auth, async (req, res) => {
    try {
        console.log('Received homework creation request:', req.body);
        
        const { title, description, courseName, dueDate } = req.body;
        
        // Validate required fields
        if (!title || !description || !courseName || !dueDate) {
            console.log('Missing required fields:', { title, description, courseName, dueDate });
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get all students
        const students = await User.find({ role: 'student' });
        console.log('Found students:', students.length);

        if (students.length === 0) {
            console.log('No students found in the system');
            return res.status(400).json({ message: 'No students found in the system' });
        }

        // Create homework for each student
        const homeworks = await Promise.all(students.map(async (student) => {
            try {
                const homework = new Homework({
                    title,
                    description,
                    courseName,
                    dueDate,
                    assignedTo: student._id,
                    status: 'pending'
                });
                const savedHomework = await homework.save();
                console.log('Created homework for student:', student._id);
                return savedHomework;
            } catch (error) {
                console.error('Error creating homework for student:', student._id, error);
                throw error;
            }
        }));

        console.log('Successfully created all homeworks');
        res.status(201).json(homeworks);
    } catch (error) {
        console.error('Error in homework creation:', error);
        res.status(500).json({ 
            message: 'Failed to create homework',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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