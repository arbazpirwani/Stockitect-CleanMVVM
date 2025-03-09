import { useState, useEffect, useCallback } from 'react';
import { stocksRepository } from '@/repositories';
import { Stock } from '@/types/stock';
import { ApiError, PaginationInfo } from '@/types/api';
import { LIMIT_OPTIONS } from '@/constants';

export type SortOption = 'ticker' | 'name';
export type OrderOption = 'asc' | 'desc';
export type LimitOption = typeof LIMIT_OPTIONS[number];


interface StocksListInitialState {
    loadingMore?: boolean;
    error?: ApiError | null;
    // Add other properties as needed for testing
}

export function useStocksListViewModel(initialState: StocksListInitialState = {}) {
    // Core stock listing state
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(initialState.loadingMore || false);
    const [error, setError] = useState(initialState.error || null);
    const [pagination, setPagination] = useState<PaginationInfo>({
        nextCursor: null,
        hasMore: false
    });

    // Filter and sort options
    const [sortBy, setSortBy] = useState<SortOption>('ticker');
    const [orderBy, setOrderBy] = useState<OrderOption>('asc');
    const [limit, setLimit] = useState<LimitOption>(50);

    // Load initial stocks
    useEffect(() => {
        loadStocks();
    }, [sortBy, orderBy, limit]);

    const loadStocks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await stocksRepository.getStocks(
                limit,
                null,
                sortBy,
                orderBy
            );

            setStocks(stocksRepository.deduplicateStocks(response.stocks));
            setPagination(response.pagination);
        } catch (error) {
            setError(error as ApiError);
        } finally {
            setLoading(false);
        }
    }, [sortBy, orderBy, limit]);

    const loadMoreStocks = useCallback(async () => {
        if (loadingMore || error || !pagination.hasMore) {
            return;
        }

        setLoadingMore(true);

        try {
            const response = await stocksRepository.getStocks(
                limit,
                pagination.nextCursor,
                sortBy,
                orderBy
            );

            const updatedStocks = stocksRepository.deduplicateStocks([
                ...stocks,
                ...response.stocks
            ]);

            setStocks(updatedStocks);
            setPagination(response.pagination);
        } catch (error) {
            setError(error as ApiError);
        } finally {
            setLoadingMore(false);
        }
    }, [
        stocks,
        loadingMore,
        error,
        pagination.hasMore,
        pagination.nextCursor,
        sortBy,
        orderBy,
        limit
    ]);

    const updateSortBy = useCallback((sort: SortOption) => {
        setSortBy(sort);
    }, []);

    const updateOrderBy = useCallback((order: OrderOption) => {
        setOrderBy(order);
    }, []);

    const updateLimit = useCallback((newLimit: LimitOption) => {
        setLimit(newLimit);
    }, []);

    return {
        // State
        stocks,
        loading,
        loadingMore,
        error,
        pagination,
        sortBy,
        orderBy,
        limit,

        // Actions
        loadStocks,
        loadMoreStocks,
        updateSortBy,
        updateOrderBy,
        updateLimit
    };
}