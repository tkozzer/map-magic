import { cacheData, getCachedData } from './cache.js';

function rateLimit(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPropertyValueBatch(entityId, propertyIds) {
    const cacheKey = `${entityId}_${propertyIds.join('_')}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims|labels&languages=en&format=json&origin=*`;
    console.debug(`Fetching properties ${propertyIds.join(', ')} for entity ${entityId}: ${url}`);

    await rateLimit(1000);  // Ensure we don't exceed the rate limit

    const response = await fetch(url);
    const data = await response.json();
    console.debug(`Response for properties ${propertyIds.join(', ')} of entity ${entityId}:`, data);

    const results = {
        label: data.entities?.[entityId]?.labels?.en?.value || 'Unknown'
    };
    if (data.entities?.[entityId]?.claims) {
        propertyIds.forEach(propertyId => {
            if (data.entities[entityId].claims[propertyId]) {
                results[propertyId] = data.entities[entityId].claims[propertyId][0].mainsnak.datavalue.value;
            } else {
                results[propertyId] = null;
            }
        });
    }
    cacheData(cacheKey, results);
    return results;
}

async function getLabel(entityId) {
    if (!entityId) {
        console.warn('Attempted to get label for null entityId');
        return 'N/A';
    }

    if (typeof entityId === 'object' && entityId.id) {
        entityId = entityId.id;
    }
    const cachedLabel = getCachedData(`label_${entityId}`);
    if (cachedLabel) {
        return cachedLabel;
    }

    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=labels&languages=en&format=json&origin=*`;
    console.debug(`Fetching label for entity ${entityId}: ${url}`);

    await rateLimit(1000);  // Ensure we don't exceed the rate limit

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.debug(`Response for label of entity ${entityId}:`, data);

        const label = data.entities?.[entityId]?.labels?.en?.value || null;
        cacheData(`label_${entityId}`, label);
        return label || 'N/A';
    } catch (error) {
        console.error(`Error fetching label for entity ${entityId}:`, error);
        return 'N/A';
    }
}

function createWikipediaLink(countyName, stateName) {
    if (!countyName || !stateName) {
        console.warn('Missing county name or state name for Wikipedia link');
        return null;
    }
    const formattedCountyName = countyName.replace(/ County$/, '').replace(/ /g, '_');
    const formattedStateName = stateName.replace(/ /g, '_');
    return `https://en.wikipedia.org/wiki/${formattedCountyName}_County,_${formattedStateName}`;
}

async function formatArea(area) {
    if (area?.amount && area?.unit) {
        const amount = area.amount.replace(/^\+/, '');
        const unitId = area.unit.split('/').pop(); // Extract the entity ID from the full URL
        const unitLabel = await getLabel(unitId);
        return { value: amount, unit: unitLabel };
    }
    return null;
}

async function formatCoordinates(coordinates) {
    if (coordinates) {
        const globeLabel = await getLabel(coordinates.globe.split('/').pop());
        return {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            altitude: coordinates.altitude,
            precision: coordinates.precision,
            globe: globeLabel
        };
    }
    return null;
}

export {
    rateLimit,
    getPropertyValueBatch,
    getLabel,
    createWikipediaLink,
    formatArea,
    formatCoordinates
};