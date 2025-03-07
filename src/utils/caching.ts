import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stock } from '@/types/stock';
import { CACHE_KEYS, CACHE_EXPIRATION } from '@/constants';

/**
 * Cached data with metadata
 */
interface CachedData<T> {
    /**
     * The data being cached
     */
    data: T;

    /**
     * Timestamp when the data was cached
     */
    timestamp: number;
}

/**
 * Cached data with metadata
 */
interface CachedData<T> {
    /**
     * The data being cached
     */
    data: T;

    /**
     * Timestamp when the data was cached
     */
    timestamp: number;
}

/**
 * Get data from cache
 *
 * @param key Cache key
 * @param expirationTime Cache expiration time in milliseconds
 * @returns Cached data or null if not found or expired
 */
export const getCachedData = async <T>(
    key: string,
    expirationTime: number = CACHE_EXPIRATION.DEFAULT
): Promise<T | null> => {
    try {
        const cachedData = await AsyncStorage.getItem(key);

        if (!cachedData) {
            return null;
        }

        const { data, timestamp }: CachedData<T> = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > expirationTime;

        return isExpired ? null : data;
    } catch (error) {
        console.error(`Error retrieving cached data for key ${key}:`, error);
        return null;
    }
};

/**
 * Cache data with timestamp
 *
 * @param key Cache key
 * @param data Data to cache
 * @returns Promise that resolves when data is cached
 */
export const setCachedData = async <T>(key: string, data: T): Promise<void> => {
    try {
        const cacheData: CachedData<T> = {
            data,
            timestamp: Date.now(),
        };

        await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.error(`Error caching data for key ${key}:`, error);
    }
};

/**
 * Clear all cached data or data with specific prefix
 *
 * @param prefix Optional prefix to limit which cache keys are cleared
 * @returns Promise that resolves when cache is cleared
 */
export const clearCache = async (prefix?: string): Promise<void> => {
    try {
        const keys = await AsyncStorage.getAllKeys();

        const keysToRemove = prefix
            ? keys.filter(key => key.startsWith(prefix))
            : keys;

        if (keysToRemove.length > 0) {
            await AsyncStorage.multiRemove(keysToRemove);
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

/**
 * Get cached stocks for a specific page
 *
 * @param page Page number
 * @returns Cached stocks or null
 */
export const getCachedStocks = (page: number): Promise<Stock[] | null> => {
    return getCachedData<Stock[]>(`${CACHE_KEYS.STOCKS_PAGE}${page}`, CACHE_EXPIRATION.STOCKS);
};

/**
 * Cache stocks for a specific page
 *
 * @param page Page number
 * @param stocks Stocks to cache
 * @returns Promise that resolves when stocks are cached
 */
export const setCachedStocks = (page: number, stocks: Stock[]): Promise<void> => {
    return setCachedData<Stock[]>(`${CACHE_KEYS.STOCKS_PAGE}${page}`, stocks);
};

/**
 * Get cached search results for a query
 *
 * @param query Search query
 * @returns Cached search results or null
 */
export const getCachedSearchResults = (query: string): Promise<Stock[] | null> => {
    // Normalize the query to ensure consistent caching
    const normalizedQuery = query.trim().toLowerCase();
    return getCachedData<Stock[]>(`${CACHE_KEYS.SEARCH_RESULTS}${normalizedQuery}`);
};

/**
 * Cache search results for a query
 *
 * @param query Search query
 * @param results Search results to cache
 * @returns Promise that resolves when search results are cached
 */
export const setCachedSearchResults = (query: string, results: Stock[]): Promise<void> => {
    // Normalize the query to ensure consistent caching
    const normalizedQuery = query.trim().toLowerCase();
    return setCachedData<Stock[]>(`${CACHE_KEYS.SEARCH_RESULTS}${normalizedQuery}`, results);
};

/**
 * Update the last update timestamp for a specific cache type
 *
 * @param cacheType Type of cache
 * @returns Promise that resolves when timestamp is updated
 */
export const updateLastUpdateTimestamp = async (cacheType: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(`${CACHE_KEYS.LAST_UPDATE}${cacheType}`, Date.now().toString());
    } catch (error) {
        console.error(`Error updating last update timestamp for ${cacheType}:`, error);
    }
};

/**
 * Get the last update timestamp for a specific cache type
 *
 * @param cacheType Type of cache
 * @returns Last update timestamp or null
 */
export const getLastUpdateTimestamp = async (cacheType: string): Promise<number | null> => {
    try {
        const timestamp = await AsyncStorage.getItem(`${CACHE_KEYS.LAST_UPDATE}${cacheType}`);
        return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
        console.error(`Error getting last update timestamp for ${cacheType}:`, error);
        return null;
    }
};