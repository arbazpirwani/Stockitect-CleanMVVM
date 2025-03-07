import { Stock } from '@/types/stock';
import { ApiError } from '@/types/api';
import { fetchStocks, searchStocks } from '@/api/polygon/stocksApi';
import {
    getCachedData,
    setCachedData,
    getCachedSearchResults,
    setCachedSearchResults
} from '@/utils/caching';
import { CACHE_KEYS } from '@/constants';

import { DEFAULT_BATCH_SIZE } from '@/constants';

/**
 * Repository for managing stock data
 */
export class StocksRepository {
    /**
     * Fetch stocks from Nasdaq
     *
     * @param limit Number of items to fetch
     * @returns Promise with stocks array
     * @throws ApiError if the API request fails
     */
    async getStocks(limit: number = DEFAULT_BATCH_SIZE): Promise<Stock[]> {
        try {
            // Try to get from cache first
            const cachedStocks = await getCachedData<Stock[]>(CACHE_KEYS.STOCKS_LIST);
            if (cachedStocks && cachedStocks.length > 0) {
                return cachedStocks;
            }

            // Fetch from API if not in cache
            const stocks = await fetchStocks(limit);

            // Cache the results
            if (stocks.length > 0) {
                await setCachedData(CACHE_KEYS.STOCKS_LIST, stocks);
            }

            return stocks;
        } catch (error) {
            // The fetchStocks function already transforms errors to ApiError
            throw error as ApiError;
        }
    }

    /**
     * Search for stocks by query
     *
     * @param query Search query
     * @param limit Maximum number of results
     * @returns Promise with stocks array
     * @throws ApiError if the API request fails
     */
    async searchStocks(query: string, limit: number = DEFAULT_BATCH_SIZE): Promise<Stock[]> {
        if (!query || query.trim() === '') {
            return [];
        }

        try {
            // Try to get from cache first
            const cachedResults = await getCachedSearchResults(query);
            if (cachedResults) {
                return cachedResults;
            }

            // Fetch from API if not in cache
            const results = await searchStocks(query, limit);

            // Cache the results
            if (results.length > 0) {
                await setCachedSearchResults(query, results);
            }

            return results;
        } catch (error) {
            // The searchStocks function already transforms errors to ApiError
            throw error as ApiError;
        }
    }

    /**
     * Helper method to ensure no duplicate stocks in the array
     *
     * @param stocks Array of stocks
     * @returns Deduplicated array
     */
    deduplicateStocks(stocks: Stock[]): Stock[] {
        const map = new Map<string, Stock>();
        for (const stock of stocks) {
            map.set(stock.ticker, stock);
        }
        return Array.from(map.values());
    }
}

// Singleton instance
export const stocksRepository = new StocksRepository();