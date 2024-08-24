const cache = new Map();
const DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

export const cacheData = (key, data, expiration = DEFAULT_EXPIRATION) => {
    const expirationTime = Date.now() + expiration * 1000;
    cache.set(key, { data, expirationTime });
    console.log(`Data cached for key: ${key}`);
};

export const getCachedData = (key) => {
    const cachedItem = cache.get(key);
    if (!cachedItem) return null;

    if (Date.now() > cachedItem.expirationTime) {
        cache.delete(key);
        return null;
    }

    return cachedItem.data;
};

export const getCacheStatus = () => {
    const size = cache.size;
    const keys = Array.from(cache.keys());
    return { size, keys };
};

export const deleteCachedData = (key) => {
    cache.delete(key);
    console.log(`Deleted cached data for key: ${key}`);
};

export const clearCache = () => {
    cache.clear();
    console.log('Cache cleared');
};

// No need for graceful shutdown handling for in-memory cache