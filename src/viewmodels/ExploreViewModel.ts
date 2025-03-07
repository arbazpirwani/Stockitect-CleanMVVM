import { useState, useEffect, useCallback } from 'react';
import { stocksRepository } from '@/repositories';
import { Stock } from '@/types/stock';
import { ApiError } from '@/types/api';
import { TIMING } from '@/constants';

/**
 * View state for the Explore screen
 */
export interface ExploreViewState {
    // Stock listing state
    stocks: Stock[];
    stocksLoading: boolean;
    stocksError: ApiError | null;

    // Search state
    searchResults: Stock[];
    searchQuery: string;
    searchLoading: boolean;
    searchError: ApiError | null;
    hasSearched: boolean;

    // Computed state
    isSearchMode: boolean;
    displayedStocks: Stock[];
    isLoading: boolean;
    error: ApiError | null;
}

/**
 * ViewModel for the Explore screen
 */
export function useExploreViewModel() {
    // Stock listing state
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [stocksLoading, setStocksLoading] = useState(false);
    const [stocksError, setStocksError] = useState<ApiError | null>(null);

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
     * Load stocks (no pagination)
     */
    const loadStocks = useCallback(async () => {
        setStocksLoading(true);
        setStocksError(null);

        try {
            const newStocks = await stocksRepository.getStocks();

            // Ensure there are no duplicates (even though the repository should handle this)
            setStocks(stocksRepository.deduplicateStocks(newStocks));
        } catch (error) {
            const apiError = error as ApiError;
            setStocksError(apiError);
        } finally {
            setStocksLoading(false);
        }
    }, []);

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
        stocksError,
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
        searchStocks,
        clearSearch
    };
}