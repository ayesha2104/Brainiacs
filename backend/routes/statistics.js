import express from 'express';
import User from '../models/User.js';
import Homework from '../models/Homework.js';
import Course from '../models/Course.js';
import { getCache, setCache } from '../utils/cache.js';

const router = express.Router();

const STATS_CACHE_KEY = 'stats:overview';
const STATS_CACHE_TTL = 300; // 5 minutes

// Get statistics
router.get('/', async (req, res) => {
    try {
        const cached = await getCache(STATS_CACHE_KEY);
        if (cached) {
            return res.json({ success: true, data: cached, cached: true });
        }

        const [totalUsers, totalHomeworks, totalCourses] = await Promise.all([
            User.countDocuments(),
            Homework.countDocuments(),
            Course.countDocuments(),
        ]);

        const data = { totalUsers, totalHomeworks, totalCourses };

        await setCache(STATS_CACHE_KEY, data, STATS_CACHE_TTL);

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
