import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { useExploreViewModel } from '@/viewmodels/ExploreViewModel';
import { stocksRepository } from '@/repositories/StocksRepository';

// Increase overall timeout if needed
jest.setTimeout(15000);

// Mock the repository and its functions
jest.mock('@/repositories/StocksRepository', () => ({
    stocksRepository: {
        getStocks: jest.fn(),
        searchStocks: jest.fn(),
        deduplicateStocks: jest.fn((stocks) => stocks),
    },
}));

// Sample stock data
const mockStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
];

// Sample pagination data
const mockPagination = {
    nextCursor: 'test-cursor',
    hasMore: true
};

describe('ExploreViewModel', () => {
    beforeAll(() => {
        // Use fake timers to simulate debounce delays
        jest.useFakeTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mocks for repository functions
        (stocksRepository.getStocks as jest.Mock).mockResolvedValue({
            stocks: mockStocks,
            pagination: mockPagination
        });
        (stocksRepository.searchStocks as jest.Mock).mockResolvedValue(mockStocks);
    });

    it('loads stocks on initialization', async () => {
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load to complete
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Check that stocks have been loaded correctly
        expect(result.current.stocks).toEqual(mockStocks);
        expect(result.current.stocksPagination).toEqual(mockPagination);
        expect(stocksRepository.getStocks).toHaveBeenCalledTimes(1);
    });

    it('handles search query', async () => {
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for the initial load to complete
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Trigger a search
        act(() => {
            result.current.searchStocks('apple');
        });

        // Verify that the search query is set
        expect(result.current.searchQuery).toBe('apple');

        // Advance timers to simulate the debounce delay (adjust if your debounce delay is different)
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Wait for the debounced update and check that searchStocks was called
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith('apple');
            expect(result.current.searchResults).toEqual(mockStocks);
        });
    });

    it('clears search when requested', async () => {
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Set search query
        act(() => {
            result.current.searchStocks('apple');
        });

        // Advance timers for the debounced search update
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Wait for search results to update
        await waitFor(() => expect(result.current.searchResults).toEqual(mockStocks));

        // Clear search
        act(() => {
            result.current.clearSearch();
        });

        // Verify that the search state is cleared
        expect(result.current.searchQuery).toBe('');
        expect(result.current.hasSearched).toBe(false);
        expect(result.current.searchResults).toEqual([]);
    });

    it('loads more stocks when loadMoreStocks is called', async () => {
        // Setup mock for the loadMore call to return different stocks
        const nextPageStocks = [
            { ticker: 'GOOG', name: 'Alphabet Inc.' },
            { ticker: 'AMZN', name: 'Amazon.com Inc.' }
        ];

        const nextPagination = {
            nextCursor: 'next-cursor',
            hasMore: true
        };

        // First call returns first page, second call returns second page
        (stocksRepository.getStocks as jest.Mock)
            .mockResolvedValueOnce({
                stocks: mockStocks,
                pagination: mockPagination
            })
            .mockResolvedValueOnce({
                stocks: nextPageStocks,
                pagination: nextPagination
            });

        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load to complete
        await waitFor(() => expect(result.current.stocks).toEqual(mockStocks));

        // Call loadMoreStocks
        act(() => {
            result.current.loadMoreStocks();
        });

        // Wait for the load more to complete
        await waitFor(() => expect(result.current.stocksLoadingMore).toBe(false));

        // Verify the repository was called with the cursor
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(undefined, 'test-cursor');

        // The original + next page stocks should now be in the state
        expect(stocksRepository.deduplicateStocks).toHaveBeenCalled();
    });
});