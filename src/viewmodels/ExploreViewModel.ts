import { useState, useEffect, useCallback } from 'react';
import { stocksRepository } from '@/repositories';
import { Stock } from '@/types/stock';
import { ApiError, PaginationInfo } from '@/types/api';
import { TIMING } from '@/constants';

/**
 * ViewModel for the Explore screen
 */
export function useExploreViewModel() {
    // Stock listing state
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [stocksLoading, setStocksLoading] = useState(false);
    const [stocksLoadingMore, setStocksLoadingMore] = useState(false);
    const [stocksError, setStocksError] = useState<ApiError | null>(null);
    const [stocksPagination, setStocksPagination] = useState<PaginationInfo>({
        nextCursor: null,
        hasMore: false
    });

    // Search state
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<ApiError | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Load initial stocks
    useEffect(() => {
        loadStocks();
    }, []);

    // Computed values
    const isSearchMode = searchQuery.trim().length > 0;
    const displayedStocks = isSearchMode ? searchResults : stocks;
    const isLoading = isSearchMode ? searchLoading : stocksLoading;
    const error = isSearchMode ? searchError : stocksError;

    /**
     * Load stocks (initial page)
     */
    const loadStocks = useCallback(async () => {
        setStocksLoading(true);
        setStocksError(null);

        try {
            const response = await stocksRepository.getStocks();

            // Ensure there are no duplicates
            setStocks(stocksRepository.deduplicateStocks(response.stocks));
            setStocksPagination(response.pagination);
        } catch (error) {
            const apiError = error as ApiError;
            setStocksError(apiError);
        } finally {
            setStocksLoading(false);
        }
    }, []);

    /**
     * Load more stocks (next page)
     */
    const loadMoreStocks = useCallback(async () => {
        // Don't fetch more if already loading, has error, or no more pages
        if (stocksLoadingMore || stocksError || !stocksPagination.hasMore) {
            return;
        }

        setStocksLoadingMore(true);

        try {
            const response = await stocksRepository.getStocks(
                undefined,
                stocksPagination.nextCursor
            );

            // Append new stocks to existing ones, remove duplicates
            const updatedStocks = stocksRepository.deduplicateStocks([
                ...stocks,
                ...response.stocks
            ]);

            setStocks(updatedStocks);
            setStocksPagination(response.pagination);
        } catch (error) {
            const apiError = error as ApiError;
            setStocksError(apiError);
        } finally {
            setStocksLoadingMore(false);
        }
    }, [
        stocks,
        stocksLoadingMore,
        stocksError,
        stocksPagination.hasMore,
        stocksPagination.nextCursor
    ]);

    /**
     * Refresh the stock list
     */
    const refreshStocks = useCallback(() => {
        loadStocks();
    }, [loadStocks]);

    /**
     * Search for stocks by query
     */
    const searchStocksWithQuery = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchQuery('');
            setHasSearched(false);
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        setSearchQuery(query);

        try {
            const results = await stocksRepository.searchStocks(query);

            // Ensure no duplicates in search results
            setSearchResults(stocksRepository.deduplicateStocks(results));
            setHasSearched(true);
        } catch (error) {
            setSearchError(error as ApiError);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    /**
     * Debounce the search to avoid too many API calls
     */
    let searchDebounceTimer: NodeJS.Timeout;
    const searchStocks = useCallback((query: string) => {
        clearTimeout(searchDebounceTimer);
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        searchDebounceTimer = setTimeout(() => {
            searchStocksWithQuery(query).catch(console.error);
        }, TIMING.DEBOUNCE_DELAY);
    }, [searchStocksWithQuery]);

    /**
     * Clear the search
     */
    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    }, []);

    return {
        // State
        stocks,
        stocksLoading,
        stocksLoadingMore,
        stocksError,
        stocksPagination,
        searchResults,
        searchQuery,
        searchLoading,
        searchError,
        hasSearched,
        isSearchMode,
        displayedStocks,
        isLoading,
        error,

        // Actions
        refreshStocks,
        loadMoreStocks,
        searchStocks,
        clearSearch
    };
}