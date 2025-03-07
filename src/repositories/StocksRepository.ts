import { Stock } from '@/types/stock';
import { ApiError } from '@/types/api';
import { fetchStocks, searchStocks } from '@/api/polygon/stocksApi';
import {
    getCachedStocks,
    setCachedStocks,
    getCachedSearchResults,
    setCachedSearchResults
} from '@/utils/caching';
import { DEFAULT_PAGE_SIZE } from '@/constants';

/**
 * Repository for managing stock data
 */
export class StocksRepository {
    /**
     * Fetch a paginated list of stocks
     *
     * @param page Page number (starts at 1)
     * @param pageSize Number of items per page
     * @returns Promise with stocks array
     * @throws ApiError if the API request fails
     */
    async getStocks(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<Stock[]> {
        try {
            // Try to get from cache first
            const cachedStocks = await getCachedStocks(page);
            if (cachedStocks && cachedStocks.length > 0) {
                return cachedStocks;
            }

            // Fetch from API if not in cache
            const stocks = await fetchStocks(page, pageSize);

            // Cache the results
            if (stocks.length > 0) {
                await setCachedStocks(page, stocks);
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
    async searchStocks(query: string, limit: number = DEFAULT_PAGE_SIZE): Promise<Stock[]> {
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
     * Helper method to remove duplicate stocks
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