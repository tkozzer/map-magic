import express from 'express';
import { cacheData, getCachedData } from '../utils/cache.js';
import {
    getPropertyValueBatch,
    getLabel,
    createWikipediaLink,
    formatArea,
    formatCoordinates
} from '../utils/wikidataHelpers.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cachedData = await getCachedData(id);
        if (cachedData) {
            console.log(`County data retrieved from cache for ID: ${id}`);
            return res.json(JSON.parse(cachedData));
        }

        const propertyIds = ['P1082', 'P625', 'P2046', 'P17', 'P856', 'P36', 'P402', 'P131'];
        const countyData = await getPropertyValueBatch(id, propertyIds);

        let stateName = 'Unknown';
        if (countyData.P131) {
            stateName = await getLabel(countyData.P131.id);
        }

        const [countryLabel, capitalLabel, formattedArea, formattedCoordinates] = await Promise.all([
            getLabel(countyData.P17?.id),
            getLabel(countyData.P36?.id),
            formatArea(countyData.P2046),
            formatCoordinates(countyData.P625)
        ]);

        const processedData = {
            name: countyData.label,
            population: countyData.P1082?.amount ? parseInt(countyData.P1082.amount.replace(/^\+/, ''), 10) : null,
            coordinates: formattedCoordinates,
            area: formattedArea,
            country: countryLabel,
            officialWebsite: countyData.P856,
            capital: capitalLabel,
            osmRelationURL: countyData.P402 ? `https://www.openstreetmap.org/relation/${countyData.P402}` : null,
            wikipediaLink: createWikipediaLink(countyData.label, stateName)
        };

        await cacheData(id, JSON.stringify(processedData));
        console.log(`County data cached for ID: ${id}`);

        res.json(processedData);
    } catch (error) {
        console.error('Error fetching county data:', error);
        res.status(500).json({ error: 'An error occurred while fetching county data' });
    }
});

export default router;