import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { useStocksSearchViewModel } from '@/viewmodels/stocks/StocksSearchViewModel';
import { stocksRepository } from '@/repositories/StocksRepository';

// Enable fake timers for debounce tests
jest.useFakeTimers();

// Mock the repository
jest.mock('@/repositories/StocksRepository', () => ({
    stocksRepository: {
        searchStocks: jest.fn(),
        deduplicateStocks: jest.fn((stocks) => stocks),
    },
}));

const mockStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'AAPL.US', name: 'Apple Inc. US' },
];

describe('StocksSearchViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock response
        (stocksRepository.searchStocks as jest.Mock).mockResolvedValue(mockStocks);
    });

    it('initializes with empty state', () => {
        const { result } = renderHook(() => useStocksSearchViewModel(50, 'ticker', 'asc'));

        expect(result.current.searchResults).toEqual([]);
        expect(result.current.searchQuery).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.hasSearched).toBe(false);
    });

    it('handles search query with debounce', async () => {
        const { result } = renderHook(() => useStocksSearchViewModel(50, 'ticker', 'asc'));

        // Enter search query
        act(() => {
            result.current.searchStocks('apple');
        });

        // Initially the query should be set but no API call yet
        expect(result.current.searchQuery).toBe('apple');
        expect(stocksRepository.searchStocks).not.toHaveBeenCalled();

        // Fast-forward debounce timer
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Now API should be called
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
                'apple', 50, 'ticker', 'asc'
            );
        });

        // Check that results are set
        expect(result.current.searchResults).toEqual(mockStocks);
        expect(result.current.hasSearched).toBe(true);
    });

    it('clears search correctly', async () => {
        const { result } = renderHook(() => useStocksSearchViewModel(50, 'ticker', 'asc'));

        // Set up search state
        act(() => {
            result.current.searchStocks('apple');
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => expect(result.current.hasSearched).toBe(true));

        // Clear search
        act(() => {
            result.current.clearSearch();
        });

        // Check that state is reset
        expect(result.current.searchQuery).toBe('');
        expect(result.current.searchResults).toEqual([]);
        expect(result.current.hasSearched).toBe(false);
    });

    it('handles empty search query', () => {
        const { result } = renderHook(() => useStocksSearchViewModel(50, 'ticker', 'asc'));

        // Call with empty query
        act(() => {
            result.current.searchStocks('');
        });

        // Should not call API
        expect(stocksRepository.searchStocks).not.toHaveBeenCalled();
        expect(result.current.searchResults).toEqual([]);
    });

    it('handles API errors', async () => {
        const apiError = { message: 'Search failed', code: 'SEARCH_ERROR' };
        (stocksRepository.searchStocks as jest.Mock).mockRejectedValueOnce(apiError);

        const { result } = renderHook(() => useStocksSearchViewModel(50, 'ticker', 'asc'));

        // Run search
        act(() => {
            result.current.searchStocks('error');
            jest.advanceTimersByTime(500);
        });

        // Wait for error to be set
        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error).toEqual(apiError);
        expect(result.current.loading).toBe(false);
    });

    it('handles changing filter parameters', async () => {
        // Initial render with default params
        const { result, rerender } = renderHook(
            ({ limit, sortBy, orderBy }) => useStocksSearchViewModel(limit, sortBy, orderBy),
            { initialProps: { limit: 50, sortBy: 'ticker', orderBy: 'asc' } }
        );

        // Do initial search
        act(() => {
            result.current.searchStocks('apple');
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => expect(result.current.hasSearched).toBe(true));

        // Verify API called with initial params
        expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
            'apple', 50, 'ticker', 'asc'
        );

        // Clear calls
        (stocksRepository.searchStocks as jest.Mock).mockClear();

        // Re-render with new params
        rerender({ limit: 25, sortBy: 'name', orderBy: 'desc' });

        // Search again
        act(() => {
            result.current.searchStocks('apple');
            jest.advanceTimersByTime(500);
        });

        // Verify API called with new params
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
                'apple', 25, 'name', 'desc'
            );
        });
    });
});