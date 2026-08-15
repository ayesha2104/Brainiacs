import express from 'express';
import Homework from '../models/Homework.js';
import Course from '../models/Course.js';
import auth from '../middleware/auth.js';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

const CACHE_TTL = 300; // 5 minutes

// Per-user learning statistics, computed from real Homework/Course data.
// Note: there is no historical/time-series tracking in the schema yet, so
// the *Change (week-over-week delta) and progressData/recentAchievements
// fields are honest zeros/empty arrays rather than fabricated numbers.
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `stats:user:${userId}`;

        const cached = await getCache(cacheKey);
        if (cached) {
            return res.json({ success: true, data: cached, cached: true });
        }

        const [homeworks, courses] = await Promise.all([
            Homework.find({ assignedTo: userId }),
            Course.find({ enrolledStudents: userId }),
        ]);

        const assignmentsCompleted = homeworks.filter((hw) => hw.status === 'completed').length;

        const gradedHomeworks = homeworks.filter((hw) => typeof hw.grade === 'number');
        const averageScore = gradedHomeworks.length
            ? Math.round(gradedHomeworks.reduce((sum, hw) => sum + hw.grade, 0) / gradedHomeworks.length)
            : 0;

        const coursesCompleted = courses.filter((c) => c.progress >= 100).length;

        const studyHours = courses.reduce((sum, course) => {
            const hours = course.hoursSpent?.get(userId.toString()) || 0;
            return sum + hours;
        }, 0);

        const data = {
            coursesCompleted,
            coursesCompletedChange: 0,
            averageScore,
            averageScoreChange: 0,
            studyHours,
            studyHoursChange: 0,
            assignmentsCompleted,
            assignmentsCompletedChange: 0,
            progressData: [],
            recentAchievements: [],
        };

        await setCache(cacheKey, data, CACHE_TTL);

        res.json({ success: true, data, cached: false });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
});

export default router;
