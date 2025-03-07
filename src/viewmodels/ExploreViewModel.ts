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
    hasMoreStocks: boolean;
    currentPage: number;

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
    const [hasMoreStocks, setHasMoreStocks] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Search state
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<ApiError | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Prevent multiple rapid calls
    const [cooldown, setCooldown] = useState(false);

    // Load initial stocks
    useEffect(() => {
        loadStocks(1);
    }, []);

    // Computed values
    const isSearchMode = searchQuery.trim().length > 0;
    const displayedStocks = isSearchMode ? searchResults : stocks;
    const isLoading = isSearchMode ? searchLoading : stocksLoading;
    const error = isSearchMode ? searchError : stocksError;

    /**
     * Load stocks for a specific page
     */
    const loadStocks = useCallback(async (page: number) => {
        if (page === 1) {
            setStocksLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        setStocksError(null);

        try {
            const newStocks = await stocksRepository.getStocks(page);

            if (page === 1) {
                setStocks(newStocks);
            } else {
                setStocks(prev => {
                    const combined = [...prev, ...newStocks];
                    return stocksRepository.deduplicateStocks(combined);
                });
            }

            setHasMoreStocks(newStocks.length > 0);
            setCurrentPage(page);
        } catch (error) {
            const apiError = error as ApiError;
            setStocksError(apiError);

            if (apiError.code === 'RATE_LIMIT_EXCEEDED') {
                setHasMoreStocks(false);
            }
        } finally {
            setStocksLoading(false);
            setIsLoadingMore(false);
        }
    }, []);

    /**
     * Load the next page of stocks
     */
    const loadMore = useCallback(() => {
        if (!stocksLoading && !isLoadingMore && hasMoreStocks && !cooldown) {
            setCooldown(true);
            setTimeout(() => setCooldown(false), 2000);

            loadStocks(currentPage + 1);
        }
    }, [stocksLoading, isLoadingMore, hasMoreStocks, cooldown, currentPage, loadStocks]);

    /**
     * Refresh the stock list
     */
    const refreshStocks = useCallback(() => {
        loadStocks(1);
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
            setSearchResults(results);
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
        hasMoreStocks,
        currentPage,
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
        loadMore,
        refreshStocks,
        searchStocks,
        clearSearch
    };
}