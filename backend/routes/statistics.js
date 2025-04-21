import express from 'express';
import User from '../models/User.js';
// import Question from '../models/Question.js';
// import Answer from '../models/Answer.js';

const router = express.Router();

// Get statistics
router.get('/', async (req, res) => {
    try {
        // Get total number of users
        const totalUsers = await User.countDocuments();
        
        // Get total number of questions
        // const totalQuestions = await Question.countDocuments();
        
        // Get total number of answers
        // const totalAnswers = await Answer.countDocuments();

        res.json({
            success: true,
            data: {
                totalUsers,
                totalQuestions,
                totalAnswers
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

export default router;
