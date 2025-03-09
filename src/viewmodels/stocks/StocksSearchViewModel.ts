import { useState, useCallback } from 'react';
import { stocksRepository } from '@/repositories';
import { Stock } from '@/types/stock';
import { ApiError } from '@/types/api';
import { TIMING } from '@/constants';

// Add options parameter with testMode flag
export function useStocksSearchViewModel(
    limit: number,
    sortBy: string,
    orderBy: string,
    options = { testMode: false }
) {
    const [searchResults, setSearchResults] = useState<Stock[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const searchStocksWithQuery = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchQuery('');
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSearchQuery(query);

        try {
            const results = await stocksRepository.searchStocks(
                query,
                limit,
                sortBy,
                orderBy
            );

            setSearchResults(stocksRepository.deduplicateStocks(results));
            setHasSearched(true);
        } catch (error) {
            setError(error as ApiError);
        } finally {
            setLoading(false);
        }
    }, [limit, sortBy, orderBy]);

    let searchDebounceTimer: NodeJS.Timeout;
    const searchStocks = useCallback((query: string) => {
        clearTimeout(searchDebounceTimer);
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        if (options.testMode) {
            // In test mode, bypass debounce and call the search function immediately
            searchStocksWithQuery(query).catch(console.error);
        } else {
            // Normal mode with debounce
            searchDebounceTimer = setTimeout(() => {
                searchStocksWithQuery(query).catch(console.error);
            }, TIMING.DEBOUNCE_DELAY);
        }
    }, [searchStocksWithQuery, options.testMode]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    }, []);

    return {
        searchResults,
        searchQuery,
        loading,
        error,
        hasSearched,
        searchStocks,
        clearSearch,
        // Optionally expose the direct query function for testing
        searchStocksWithQuery
    };
}