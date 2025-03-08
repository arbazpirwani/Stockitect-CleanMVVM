import { useState, useEffect, useCallback } from 'react';
import { stocksRepository } from '@/repositories';
import { Stock } from '@/types/stock';
import { ApiError, PaginationInfo } from '@/types/api';
import { TIMING } from '@/constants';

// Types for sort, order, and limit options
export type SortOption = 'ticker' | 'name';
export type OrderOption = 'asc' | 'desc';
// Import limit options from constants
import { LIMIT_OPTIONS } from '@/constants';
export type LimitOption = typeof LIMIT_OPTIONS[number];
export type ViewType = 'list' | 'grid';

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

    // New state for filtering and view options
    const [sortBy, setSortBy] = useState<SortOption>('ticker');
    const [orderBy, setOrderBy] = useState<OrderOption>('asc');
    const [limit, setLimit] = useState<LimitOption>(50);
    const [viewType, setViewType] = useState<ViewType>('list');

    // Selected stock for details view
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    // Load initial stocks
    useEffect(() => {
        loadStocks();
    }, [sortBy, orderBy, limit]); // Reload when these parameters change

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
            const response = await stocksRepository.getStocks(
                limit,
                null,
                sortBy,
                orderBy
            );

            // Ensure there are no duplicates
            setStocks(stocksRepository.deduplicateStocks(response.stocks));
            setStocksPagination(response.pagination);
        } catch (error) {
            const apiError = error as ApiError;
            setStocksError(apiError);
        } finally {
            setStocksLoading(false);
        }
    }, [sortBy, orderBy, limit]);

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
                limit,
                stocksPagination.nextCursor,
                sortBy,
                orderBy
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
        stocksPagination.nextCursor,
        sortBy,
        orderBy,
        limit
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
            const results = await stocksRepository.searchStocks(
                query,
                limit,
                sortBy,
                orderBy
            );

            // Ensure no duplicates in search results
            setSearchResults(stocksRepository.deduplicateStocks(results));
            setHasSearched(true);
        } catch (error) {
            setSearchError(error as ApiError);
        } finally {
            setSearchLoading(false);
        }
    }, [limit, sortBy, orderBy]);

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

    /**
     * Update sort option
     */
    const updateSortBy = useCallback((sort: SortOption) => {
        setSortBy(sort);
        // Stocks will reload due to the effect dependency
    }, []);

    /**
     * Update order option
     */
    const updateOrderBy = useCallback((order: OrderOption) => {
        setOrderBy(order);
        // Stocks will reload due to the effect dependency
    }, []);

    /**
     * Update limit option
     */
    const updateLimit = useCallback((newLimit: LimitOption) => {
        setLimit(newLimit);
        // Stocks will reload due to the effect dependency
    }, []);

    /**
     * Update view type
     */
    const updateViewType = useCallback((type: ViewType) => {
        setViewType(type);
    }, []);

    /**
     * Show stock details in bottom sheet
     */
    const showStockDetails = useCallback((stock: Stock) => {
        setSelectedStock(stock);
        setIsBottomSheetVisible(true);
    }, []);

    /**
     * Hide bottom sheet
     */
    const hideStockDetails = useCallback(() => {
        setIsBottomSheetVisible(false);
        // Keep the selected stock until animation completes
        setTimeout(() => {
            setSelectedStock(null);
        }, 300);
    }, []);

    return {
        // Original state
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

        // New state
        sortBy,
        orderBy,
        limit,
        viewType,
        selectedStock,
        isBottomSheetVisible,

        // Original actions
        refreshStocks,
        loadMoreStocks,
        searchStocks,
        clearSearch,

        // New actions
        updateSortBy,
        updateOrderBy,
        updateLimit,
        updateViewType,
        showStockDetails,
        hideStockDetails
    };
}