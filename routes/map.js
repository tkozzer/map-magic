import express from 'express';
import { getCachedData, cacheData } from '../utils/cache.js';

const router = express.Router();

router.get('/counties', async (req, res) => {
    try {
        const cachedData = await getCachedData('all_counties');
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // If not in cache, fetch from a data source or use a static file
        // For now, we'll return a placeholder
        const allCounties = { message: "This will contain data for all U.S. counties" };

        // Cache the result
        await cacheData('all_counties', JSON.stringify(allCounties));

        res.json(allCounties);
    } catch (error) {
        console.error('Error fetching all counties data:', error);
        res.status(500).json({ error: 'An error occurred while fetching all counties data' });
    }
});

export default router;