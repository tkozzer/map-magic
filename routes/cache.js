import express from 'express';
import { getCacheStatus } from '../utils/cache.js';

const router = express.Router();

router.get('/status', async (req, res) => {
    try {
        const cacheStatus = await getCacheStatus();
        res.json(cacheStatus);
    } catch (error) {
        console.error('Error fetching cache status:', error);
        res.status(500).json({ error: 'An error occurred while fetching cache status' });
    }
});

export default router;