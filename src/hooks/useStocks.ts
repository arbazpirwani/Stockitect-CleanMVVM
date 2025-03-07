import { useState, useEffect, useCallback } from 'react';
import { fetchStocks } from '@/api/polygon/stocksApi';
import { Stock } from '@/types/stock';
import { ApiError } from '@/types/api';
import { DEFAULT_PAGE_SIZE } from '@/constants';

/**
 * Return shape for the useStocks hook.
 */
export interface UseStocksResult {
    /**
     * The array of stock items fetched so far (for all pages).
     */
    stocks: Stock[];

    /**
     * Indicates whether the current request is in-flight.
     */
    loading: boolean;

    /**
     * Any error from the most recent request, or null if there is none.
     */
    error: ApiError | null;

    /**
     * Loads the next page, if available. Has a built-in cooldown
     * and only works when `loading===false` and `hasMore===true`.
     */
    loadMore: () => void;

    /**
     * Refreshes everything by resetting to page=1 and clearing old data.
     */
    refresh: () => void;

    /**
     * The current page number being fetched (1-based).
     */
    currentPage: number;

    /**
     * Whether or not there are more pages to load.
     */
    hasMore: boolean;
}

/**
 * Custom hook for loading paginated stock data from your API or polygon.io.
 * Includes logic to prevent multiple calls in quick succession (cooldown),
 * and sets hasMore=false on rate-limit errors (429).
 *
 * @param initialPage The page to start on (default=1)
 * @param limit The number of items to fetch per page (default=20)
 * @returns The UseStocksResult object for controlling pagination.
 */
export function useStocks(
    initialPage: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
): UseStocksResult {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Add a short "cooldown" to avoid multiple calls in quick succession.
    const [cooldown, setCooldown] = useState(false);

    useEffect(() => {
        let canceled = false;

        async function loadData() {
            setLoading(true);
            setError(null);

            try {
                // Call your API or polygon.io
                const newData = await fetchStocks(currentPage, limit);

                if (!canceled) {
                    // Deduplicate in case there's any overlap
                    setStocks((prev) => {
                        if (currentPage === 1) {
                            return deduplicateStocks(newData);
                        } else {
                            return deduplicateStocks([...prev, ...newData]);
                        }
                    });

                    // If we got fewer than `limit`, probably no more pages
                    setHasMore(newData.length === limit);
                }
            } catch (err) {
                if (!canceled) {
                    const apiErr = err as ApiError;
                    setError(apiErr);
                    // If we specifically detect 429, stop further auto-load calls
                    if (apiErr.code === 'RATE_LIMIT_EXCEEDED') {
                        setHasMore(false);
                    }
                }
            } finally {
                if (!canceled) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            canceled = true;
        };
    }, [currentPage, limit]);

    /**
     * Load the next page if not already loading, not in cooldown, and hasMore is true.
     */
    const loadMore = useCallback(() => {
        if (!loading && hasMore && !cooldown) {
            setCooldown(true);
            // Reset cooldown after 2 seconds
            setTimeout(() => setCooldown(false), 2000);
            // Increment page
            setCurrentPage((page) => page + 1);
        }
    }, [loading, hasMore, cooldown]);

    /**
     * Refresh by resetting page=1, hasMore=true, and clearing old data in effect
     */
    const refresh = useCallback(() => {
        setCurrentPage(1);
        setHasMore(true);
    }, []);

    return {
        stocks,
        loading,
        error,
        loadMore,
        refresh,
        currentPage,
        hasMore,
    };
}

/**
 * Helper to remove duplicate tickers, so you don't get
 * repeated items if the data overlaps or the backend is off by 1 item.
 */
function deduplicateStocks(all: Stock[]): Stock[] {
    const map = new Map<string, Stock>();
    for (const s of all) {
        map.set(s.ticker, s);
    }
    return Array.from(map.values());
}