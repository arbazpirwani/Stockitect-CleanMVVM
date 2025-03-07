import AsyncStorage from '@react-native-async-storage/async-storage';
import * as caching from '@/utils/caching';

describe('Caching Utilities', () => {
    const testKey = 'test_key';
    const testData = { value: 123 };

    beforeEach(async () => {
        await AsyncStorage.clear();
    });

    it('should store and retrieve data correctly', async () => {
        await caching.setCachedData(testKey, testData);
        const storedData = await caching.getCachedData(testKey);
        expect(storedData).toEqual(testData);
    });

    it('should return null for a non-existent key', async () => {
        const storedData = await caching.getCachedData('non_existing_key');
        expect(storedData).toBeNull();
    });

    // Assuming your caching module also handles caching for search results
    const searchQuery = 'apple';
    const searchData = [{ ticker: 'AAPL', name: 'Apple Inc.' }];

    it('should store and retrieve search results correctly', async () => {
        await caching.setCachedSearchResults(searchQuery, searchData);
        const retrievedData = await caching.getCachedSearchResults(searchQuery);
        expect(retrievedData).toEqual(searchData);
    });

    it('should return null for non-existent search query', async () => {
        const retrievedData = await caching.getCachedSearchResults('nonexistent');
        expect(retrievedData).toBeNull();
    });
});
