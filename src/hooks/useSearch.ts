import { useState, useCallback, useEffect } from 'react';
import { searchStocks } from '../api/polygon/stocksApi';
import { getCachedSearchResults, setCachedSearchResults } from '../utils/caching';
import { Stock } from '../types/stock';
import { ApiError } from '../types/api';

/**
 * Hook result for useSearch
 */
interface UseSearchResult {
    /**
     * Array of search results
     */
    results: Stock[];

    /**
     * Loading state
     */
    loading: boolean;

    /**
     * Error state
     */
    error: ApiError | null;

    /**
     * Function to perform a search
     */
    search: (query: string) => Promise<void>;

    /**
     * Current search query
     */
    query: string;

    /**
     * Flag indicating if the search has been performed
     */
    hasSearched: boolean;
}

/**
 * Custom hook for searching stocks
 *
 * @param initialQuery Optional initial search query
 * @returns Object with search results and related functions
 */
export const useSearch = (initialQuery: string = ''): UseSearchResult => {
    const [results, setResults] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [query, setQuery] = useState<string>(initialQuery);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    /**
     * Search for stocks based on query
     */
    const search = useCallback(async (searchQuery: string) => {
        // Don't search for empty queries
        if (!searchQuery || searchQuery.trim() === '') {
            setResults([]);
            setQuery('');
            setHasSearched(false);
            return;
        }

        setLoading(true);
        setError(null);
        setQuery(searchQuery);

        try {
            // Try to get results from cache first
            const cachedResults = await getCachedSearchResults(searchQuery);

            if (cachedResults) {
                setResults(cachedResults);
                setLoading(false);
                setHasSearched(true);
                return;
            }

            // Fetch results from API if not in cache
            const searchResults = await searchStocks(searchQuery);

            // Cache the results
            if (searchResults.length > 0) {
                await setCachedSearchResults(searchQuery, searchResults);
            }

            // Update state
            setResults(searchResults);
            setHasSearched(true);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
        } finally {
            setLoading(false);
        }
    }, []);

    // Perform initial search if provided
    useEffect(() => {
        if (initialQuery) {
            search(initialQuery);
        }
    }, [initialQuery, search]);

    return {
        results,
        loading,
        error,
        search,
        query,
        hasSearched,
    };
};

/**
 * Utility function to debounce function calls
 *
 * @param func Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timer: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
};