import AsyncStorage from '@react-native-async-storage/async-storage';
import * as caching from '@/utils/caching';
import { CACHE_KEYS } from '@/constants';

describe('Caching Utilities', () => {
    const testKey = 'test_key';
    const testData = { value: 123 };

    beforeEach(() => {
        // Reset all mocks and clear AsyncStorage before each test
        jest.clearAllMocks();
        jest.restoreAllMocks();
        return AsyncStorage.clear();
    });

    afterEach(() => {
        // Ensure no unhandled promise rejections linger
        jest.restoreAllMocks();
    });

    // Basic functionality tests
    it('should store and retrieve data correctly', async () => {
        await caching.setCachedData(testKey, testData);
        const storedData = await caching.getCachedData(testKey);
        expect(storedData).toEqual(testData);
    });

    it('should return null for a non-existent key', async () => {
        const storedData = await caching.getCachedData('non_existing_key');
        expect(storedData).toBeNull();
    });

    // Search results tests
    it('should store and retrieve search results correctly', async () => {
        const searchQuery = 'apple';
        const searchData = [{ ticker: 'AAPL', name: 'Apple Inc.' }];

        await caching.setCachedSearchResults(searchQuery, searchData);
        const retrievedData = await caching.getCachedSearchResults(searchQuery);
        expect(retrievedData).toEqual(searchData);
    });

    it('should return null for non-existent search query', async () => {
        const retrievedData = await caching.getCachedSearchResults('nonexistent');
        expect(retrievedData).toBeNull();
    });

    // Error handling tests
    it('should handle error while retrieving cached data', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.getCachedData(testKey)).resolves.toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            `Error retrieving cached data for key ${testKey}:`,
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should handle error while setting cached data', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.setCachedData(testKey, testData)).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            `Error caching data for key ${testKey}:`,
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should return expired data as null', async () => {
        const expiredData = {
            data: testData,
            timestamp: Date.now() - 1000000, // Past timestamp
        };

        await AsyncStorage.setItem(testKey, JSON.stringify(expiredData));
        const result = await caching.getCachedData(testKey, 500);
        expect(result).toBeNull();
    });

    // Cache management tests
    it('should clear all cached data', async () => {
        await AsyncStorage.setItem('key1', 'value1');
        await AsyncStorage.setItem('key2', 'value2');

        await caching.clearCache();

        expect(await AsyncStorage.getItem('key1')).toBeNull();
        expect(await AsyncStorage.getItem('key2')).toBeNull();
    });

    it('should clear cache with specific prefix', async () => {
        await AsyncStorage.setItem('prefix1_key1', 'value1');
        await AsyncStorage.setItem('prefix1_key2', 'value2');
        await AsyncStorage.setItem('prefix2_key1', 'value3');

        await caching.clearCache('prefix1');

        expect(await AsyncStorage.getItem('prefix1_key1')).toBeNull();
        expect(await AsyncStorage.getItem('prefix1_key2')).toBeNull();
        expect(await AsyncStorage.getItem('prefix2_key1')).toBe('value3');
    });

    it('should handle error during cache clearing', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'getAllKeys').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.clearCache()).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error clearing cache:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should handle error when removing multiple keys', async () => {
        await AsyncStorage.setItem('key1', 'value1');

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'multiRemove').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.clearCache()).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error clearing cache:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    // Specialized functions tests
    it('should store and retrieve cached stocks for a specific page', async () => {
        const stocks = [
            { ticker: 'AAPL', name: 'Apple Inc.' },
            { ticker: 'MSFT', name: 'Microsoft Corporation' },
        ];
        const pageKey = `${CACHE_KEYS.STOCKS_PAGE}1`;

        await caching.setCachedStocks(1, stocks);

        const storedJson = await AsyncStorage.getItem(pageKey);
        expect(storedJson).not.toBeNull();
        const storedData = JSON.parse(storedJson!);
        expect(storedData.data).toEqual(stocks);

        const retrievedStocks = await caching.getCachedStocks(1);
        expect(retrievedStocks).toEqual(stocks);
    });

    it('should handle error while setting cached stocks', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Test error'));

        const stocks = [
            { ticker: 'AAPL', name: 'Apple Inc.' },
            { ticker: 'MSFT', name: 'Microsoft Corporation' },
        ];

        await expect(caching.setCachedStocks(1, stocks)).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            `Error caching data for key ${CACHE_KEYS.STOCKS_PAGE}1:`,
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should update and retrieve last update timestamp', async () => {
        const cacheType = 'stocks';
        const timestamp = 1000;

        jest.spyOn(Date, 'now').mockReturnValue(timestamp);

        await caching.updateLastUpdateTimestamp(cacheType);

        const timestampKey = `${CACHE_KEYS.LAST_UPDATE}${cacheType}`;
        const storedValue = await AsyncStorage.getItem(timestampKey);
        expect(storedValue).toBe(timestamp.toString());

        const retrievedTimestamp = await caching.getLastUpdateTimestamp(cacheType);
        expect(retrievedTimestamp).toBe(timestamp);
    });

    it('should handle error when updating last update timestamp', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.updateLastUpdateTimestamp('test')).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error updating last update timestamp for test:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it('should handle error when getting last update timestamp', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Test error'));

        await expect(caching.getLastUpdateTimestamp('test')).resolves.toBeNull();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error getting last update timestamp for test:',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });
});