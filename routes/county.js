import express from 'express';
import axios from 'axios';
import { cacheData, getCachedData } from '../utils/cache.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check cache first
        const cachedData = await getCachedData(id);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // If not in cache, fetch from Wikidata
        // This is a placeholder query, you'll need to adjust it based on your data structure
        const query = `
            SELECT ?countyLabel ?population ?coordinates ?area ?country ?website ?capital ?osmRelation ?wikipedia WHERE {
                wd:${id} rdfs:label ?countyLabel .
                OPTIONAL { wd:${id} wdt:P1082 ?population . }
                OPTIONAL { wd:${id} wdt:P625 ?coordinates . }
                OPTIONAL { wd:${id} wdt:P2046 ?area . }
                OPTIONAL { wd:${id} wdt:P17 ?country . }
                OPTIONAL { wd:${id} wdt:P856 ?website . }
                OPTIONAL { wd:${id} wdt:P36 ?capital . }
                OPTIONAL { wd:${id} wdt:P402 ?osmRelation . }
                OPTIONAL { wd:${id} wdt:P wikipedia . }
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
        `;

        const response = await axios.get('https://query.wikidata.org/sparql', {
            params: {
                format: 'json',
                query: query
            }
        });

        const countyData = response.data.results.bindings[0];

        // Process the data into the required format
        const processedData = {
            name: countyData.countyLabel?.value,
            population: countyData.population?.value,
            coordinates: countyData.coordinates?.value,
            area: countyData.area?.value,
            country: countyData.country?.value,
            officialWebsite: countyData.website?.value,
            capital: countyData.capital?.value,
            osmRelationURL: countyData.osmRelation?.value,
            wikipediaLink: countyData.wikipedia?.value
        };

        // Cache the result
        await cacheData(id, JSON.stringify(processedData));

        res.json(processedData);
    } catch (error) {
        console.error('Error fetching county data:', error);
        res.status(500).json({ error: 'An error occurred while fetching county data' });
    }
});

export default router;