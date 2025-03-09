import {Stock} from '@/types/stock';
import {ApiError, PaginationInfo} from '@/types/api';
import {fetchStocks, searchStocks} from '@/api/polygon/stocksApi';
import {
    getCachedData,
    setCachedData,
    getCachedSearchResults,
    setCachedSearchResults
} from '@/utils/caching';
import {CACHE_KEYS} from '@/constants';

import {DEFAULT_BATCH_SIZE} from '@/constants';
import NetInfo from "@react-native-community/netinfo";

/**
 * Repository for managing stock data
 */
export class StocksRepository {
    /**
     * Fetch stocks from Nasdaq with pagination support
     *
     * @param limit Number of items to fetch
     * @param cursor Pagination cursor for fetching next page
     * @param sortBy Field to sort by (ticker or name)
     * @param sortOrder Sort direction (asc or desc)
     * @returns Promise with stocks array and pagination info
     * @throws ApiError if the API request fails
     */
    async getStocks(
        limit: number = DEFAULT_BATCH_SIZE,
        cursor: string | null = null,
        sortBy: string = 'ticker',
        sortOrder: string = 'asc'
    ): Promise<{ stocks: Stock[]; pagination: PaginationInfo }> {
        try {
            // For the first page (no cursor), try to get from cache first
            // Cache key includes sort parameters for appropriate caching
            const cacheKey = `${CACHE_KEYS.STOCKS_LIST}_${sortBy}_${sortOrder}_${limit}`;
            const cursorCacheKey = `${CACHE_KEYS.STOCKS_NEXT_CURSOR}_${sortBy}_${sortOrder}_${limit}`;

            if (!cursor) {
                const cachedStocks = await getCachedData<Stock[]>(cacheKey);
                const cachedCursor = await getCachedData<string | null>(cursorCacheKey);

                if (cachedStocks && cachedStocks.length > 0) {
                    return {
                        stocks: cachedStocks,
                        pagination: {
                            nextCursor: cachedCursor || null,
                            hasMore: !!cachedCursor
                        }
                    };
                }
            }

            // Check network status before making API call
            const isOnline = await this.isNetworkAvailable();
            if (!isOnline) {
                throw {
                    message: 'errors.networkUnavailable', // Use translation key
                    code: 'NETWORK_UNAVAILABLE'
                } as ApiError;
            }

            // Fetch from API if not in cache or fetching next page
            const {stocks, nextCursor} = await fetchStocks(limit, cursor, sortBy, sortOrder);

            // Cache the results (only the first page)
            if (!cursor && stocks.length > 0) {
                await setCachedData(cacheKey, stocks);
                if (nextCursor) {
                    await setCachedData(cursorCacheKey, nextCursor);
                }
            }

            return {
                stocks,
                pagination: {
                    nextCursor,
                    hasMore: !!nextCursor
                }
            };
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
     * @param sortBy Field to sort by (ticker or name)
     * @param sortOrder Sort direction (asc or desc)
     * @returns Promise with stocks array
     * @throws ApiError if the API request fails
     */
    async searchStocks(
        query: string,
        limit: number = DEFAULT_BATCH_SIZE,
        sortBy: string = 'ticker',
        sortOrder: string = 'asc'
    ): Promise<Stock[]> {
        if (!query || query.trim() === '') {
            return [];
        }

        try {
            // Cache key includes sort parameters and query
            const cacheKey = `${query.toLowerCase()}_${sortBy}_${sortOrder}_${limit}`;

            // Try to get from cache first
            const cachedResults = await getCachedSearchResults(cacheKey);
            if (cachedResults) {
                return cachedResults;
            }

            // Check network status before making API call
            const isOnline = await this.isNetworkAvailable();
            if (!isOnline) {
                throw {
                    message: 'errors.networkUnavailable', // Use translation key
                    code: 'NETWORK_UNAVAILABLE'
                } as ApiError;
            }

            // Fetch from API if not in cache
            const results = await searchStocks(query, limit, sortBy, sortOrder);

            // Cache the results
            if (results.length > 0) {
                await setCachedSearchResults(cacheKey, results);
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

    /**
     * Check if device is online
     * @returns Promise<boolean> True if online, false if offline
     */
    private async isNetworkAvailable(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            return state.isConnected ?? false;
        } catch (error) {
            console.error('Network availability check failed', error);
            return false;
        }
    }
}

// Singleton instance
export const stocksRepository = new StocksRepository();