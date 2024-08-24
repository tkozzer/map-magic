import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

export const cacheData = async (key, data, expiration = DEFAULT_EXPIRATION) => {
    await client.set(key, JSON.stringify(data), { EX: expiration });
};

export const getCachedData = async (key) => {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
};

export const getCacheStatus = async () => {
    const keys = await client.keys('*');
    return {
        size: keys.length,
        keys: keys,
    };
};

// Cleanup is handled automatically by Redis expiration