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
        const { result } = renderHook(() =>
            useStocksSearchViewModel(50, 'ticker', 'asc')
        );
        expect(result.current.searchResults).toEqual([]);
        expect(result.current.searchQuery).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.hasSearched).toBe(false);
    });

    it('handles search query with debounce', async () => {
        const { result } = renderHook(() =>
            useStocksSearchViewModel(50, 'ticker', 'asc')
        );
        await act(async () => {
            result.current.searchStocks('apple');
        });

        // Initially the query should be set but no API call yet
        expect(result.current.searchQuery).toBe('apple');
        // Before timers fire, API not called:
        expect(stocksRepository.searchStocks).not.toHaveBeenCalled();
        await act(async () => {
            jest.runAllTimers();
        });

        // Now API should be called
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
                'apple',
                50,
                'ticker',
                'asc'
            );
        });

        // Check that results are set
        expect(result.current.searchResults).toEqual(mockStocks);
        expect(result.current.hasSearched).toBe(true);
    });

    it('clears search correctly', async () => {
        const { result } = renderHook(() =>
            useStocksSearchViewModel(50, 'ticker', 'asc')
        );
        await act(async () => {
            result.current.searchStocks('apple');
            jest.runAllTimers();
        });

        await waitFor(() => expect(result.current.hasSearched).toBe(true));
        await act(async () => {
            result.current.clearSearch();
        });

        // Check that state is reset
        expect(result.current.searchQuery).toBe('');
        expect(result.current.searchResults).toEqual([]);
        expect(result.current.hasSearched).toBe(false);
    });

    it('handles empty search query', () => {
        const { result } = renderHook(() =>
            useStocksSearchViewModel(50, 'ticker', 'asc')
        );
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
        const { result } = renderHook(() =>
            useStocksSearchViewModel(50, 'ticker', 'asc')
        );
        await act(async () => {
            result.current.searchStocks('error');
            jest.runAllTimers();
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
        await act(async () => {
            result.current.searchStocks('apple');
            jest.runAllTimers();
        });

        await waitFor(() => expect(result.current.hasSearched).toBe(true));
        expect(stocksRepository.searchStocks).toHaveBeenCalledWith('apple', 50, 'ticker', 'asc');
        (stocksRepository.searchStocks as jest.Mock).mockClear();
        // Re-render with new parameters
        rerender({ limit: 25, sortBy: 'name', orderBy: 'desc' });
        await act(async () => {
            result.current.searchStocks('apple');
            jest.runAllTimers();
        });

        // Verify API called with new params
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith('apple', 25, 'name', 'desc');
        });
    });
});
