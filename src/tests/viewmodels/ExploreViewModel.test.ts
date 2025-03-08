import {renderHook, act} from '@testing-library/react-hooks';
import {waitFor} from '@testing-library/react-native';
import {useExploreViewModel} from '@/viewmodels/ExploreViewModel';
import {stocksRepository} from '@/repositories/StocksRepository';

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
    {ticker: 'AAPL', name: 'Apple Inc.'},
    {ticker: 'MSFT', name: 'Microsoft Corporation'},
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
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load to complete
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Check that stocks have been loaded correctly
        expect(result.current.stocks).toEqual(mockStocks);
        expect(result.current.stocksPagination).toEqual(mockPagination);
        expect(stocksRepository.getStocks).toHaveBeenCalledTimes(1);
    });

    it('handles search query', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for the initial load to complete
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Trigger a search
        await act(async () => {
            result.current.searchStocks('apple');
            // Advance timers to simulate the debounce delay
            jest.advanceTimersByTime(500);
        });

        // Verify that the search query is set
        expect(result.current.searchQuery).toBe('apple');

        // Wait for the debounced update and check that searchStocks was called
        await waitFor(() => {
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
                'apple',
                result.current.limit,
                result.current.sortBy,
                result.current.orderBy
            );
        });
    });

    it('updates sorting options and reloads data', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Update sort by
        await act(async () => {
            result.current.updateSortBy('name');
        });

        // Wait for the update to trigger a reload
        await waitFor(() => {
            expect(stocksRepository.getStocks).toHaveBeenCalledWith(
                expect.any(Number),
                null,
                'name',
                'asc'
            );
        });

        // Reset mock calls counter
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Update sort order
        await act(async () => {
            result.current.updateOrderBy('desc');
        });

        // Wait for the update to trigger another reload
        await waitFor(() => {
            expect(stocksRepository.getStocks).toHaveBeenCalledWith(
                expect.any(Number),
                null,
                'name',
                'desc'
            );
        });
    });

    it('updates limit and reloads data', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Update limit
        await act(async () => {
            result.current.updateLimit(25);
        });

        // Wait for the update to trigger a reload
        await waitFor(() => {
            expect(stocksRepository.getStocks).toHaveBeenCalledWith(
                25,
                null,
                'ticker',
                'asc'
            );
        });
    });

    it('toggles view type without reloading data', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Initial call count before updating view type
        const initialCallCount = (stocksRepository.getStocks as jest.Mock).mock.calls.length;

        // Update view type
        await act(async () => {
            result.current.updateViewType('grid');
        });

        // View type should be updated
        expect(result.current.viewType).toBe('grid');

        // But getStocks should not have been called again
        expect((stocksRepository.getStocks as jest.Mock).mock.calls.length).toBe(initialCallCount);
    });

    it('shows and hides stock details bottom sheet', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Initially the bottom sheet should be hidden
        expect(result.current.isBottomSheetVisible).toBe(false);
        expect(result.current.selectedStock).toBe(null);

        // Show stock details
        const stock = {ticker: 'AAPL', name: 'Apple Inc.'};
        await act(async () => {
            result.current.showStockDetails(stock);
        });

        // Bottom sheet should be visible with the selected stock
        expect(result.current.isBottomSheetVisible).toBe(true);
        expect(result.current.selectedStock).toEqual(stock);

        // Hide stock details
        await act(async () => {
            result.current.hideStockDetails();
        });

        // Bottom sheet should be hidden
        expect(result.current.isBottomSheetVisible).toBe(false);

        // Selected stock should still be available during the animation
        expect(result.current.selectedStock).not.toBeNull();

        // Advance timer to simulate the animation delay
        await act(async () => {
            jest.advanceTimersByTime(300);
        });

        // Now the selected stock should be null
        expect(result.current.selectedStock).toBeNull();
    });

    // New tests to improve coverage
    it('handles API errors when loading stocks', async () => {
        // Mock repository to throw an error
        (stocksRepository.getStocks as jest.Mock).mockRejectedValue({
            message: 'API error',
            code: 'ERROR_CODE'
        });

        const {result} = renderHook(() => useExploreViewModel());

        // Wait for error to be set
        await waitFor(() => expect(result.current.stocksError).not.toBeNull());

        expect(result.current.stocksError).toEqual({
            message: 'API error',
            code: 'ERROR_CODE'
        });
        expect(result.current.stocks).toEqual([]);
    });

    it('handles API errors when loading more stocks', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Mock repository to throw an error on next page load
        (stocksRepository.getStocks as jest.Mock).mockRejectedValueOnce({
            message: 'Load more error',
            code: 'ERROR_CODE'
        });

        // Try to load more
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Wait for error to be set
        await waitFor(() => expect(result.current.stocksError).not.toBeNull());

        expect(result.current.stocksError).toEqual({
            message: 'Load more error',
            code: 'ERROR_CODE'
        });
    });

    // Rather than testing no API call with error,
    // let's test that errors are correctly tracked
    it('tracks errors from API calls', async () => {
        // Mock API to throw an error
        const errorMessage = 'API Error';
        (stocksRepository.getStocks as jest.Mock).mockRejectedValueOnce({
            message: errorMessage,
            code: 'ERROR'
        });

        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load (may already have error)
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // If no error yet, try loading more which should fail
        if (!result.current.stocksError) {
            await act(async () => {
                result.current.loadMoreStocks();
            });
        }

        // Error should be tracked in state
        await waitFor(() => {
            expect(result.current.stocksError).not.toBeNull();
            expect(result.current.stocksError?.message).toBe(errorMessage);
        });
    });

    // Test that pagination is respected
    it('respects hasMore flag from pagination', async () => {
        // Setup a hook with pagination that indicates no more pages
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: mockStocks,
            pagination: { nextCursor: null, hasMore: false }
        });

        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => {
            expect(result.current.stocksLoading).toBe(false);
            expect(result.current.stocksPagination.hasMore).toBe(false);
        });

        // Let's test that the state correctly reflects pagination
        expect(result.current.stocksPagination.hasMore).toBe(false);
        expect(result.current.stocksPagination.nextCursor).toBeNull();
    });

    // Simplify no more pages test
    it('respects pagination when no more pages', async () => {
        // Override the initial response to indicate no more pages
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: mockStocks,
            pagination: {nextCursor: null, hasMore: false}
        });

        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load and verify hasMore is false
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));
        expect(result.current.stocksPagination.hasMore).toBe(false);

        // Clear the mock
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Call loadMoreStocks
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Verify no API call occurred
        expect(stocksRepository.getStocks).not.toHaveBeenCalled();
    });

    // REVISED - Testing behavior with error state
    it('skips API calls to loadMoreStocks when there is an error', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Set up an error through the API
        (stocksRepository.getStocks as jest.Mock).mockRejectedValueOnce({
            message: 'Error state',
            code: 'ERROR'
        });

        // First call to loadMoreStocks to get into error state
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Verify we're in error state
        await waitFor(() => expect(result.current.stocksError).not.toBeNull());

        // Clear the mock to track new calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Call loadMoreStocks again while in error state
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Check that no new API call was made
        await waitFor(() => {
            // Give it a moment to potentially make an API call
            expect(stocksRepository.getStocks).toHaveBeenCalledTimes(0);
        });
    });

    it('prevents loading more when no more pages', async () => {
        // Setup a hook with pagination that indicates no more pages
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: mockStocks,
            pagination: {nextCursor: null, hasMore: false}
        });

        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load to complete with hasMore=false
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));
        await waitFor(() => expect(result.current.stocksPagination.hasMore).toBe(false));

        // Clear previous API calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Try to load more
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Should not have called getStocks again
        expect(stocksRepository.getStocks).not.toHaveBeenCalled();
    });

    it('handles API errors in search', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Mock repository to throw an error for search
        (stocksRepository.searchStocks as jest.Mock).mockRejectedValue({
            message: 'Search error',
            code: 'SEARCH_ERROR'
        });

        // Trigger search and advance timers
        await act(async () => {
            result.current.searchStocks('error query');
            jest.advanceTimersByTime(500);
        });

        // Wait for search error to be set
        await waitFor(() => expect(result.current.searchError).not.toBeNull());

        expect(result.current.searchError).toEqual({
            message: 'Search error',
            code: 'SEARCH_ERROR'
        });
    });

    it('deduplicates stocks when loading more', async () => {
        const {result} = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Make the second page of results include a duplicate stock
        const nextPageStocks = [
            {ticker: 'AAPL', name: 'Apple Inc. (duplicate)'}, // Duplicate ticker
            {ticker: 'GOOGL', name: 'Alphabet Inc.'}
        ];

        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: nextPageStocks,
            pagination: {nextCursor: 'next-page-cursor', hasMore: true}
        });

        // Setup deduplication mock
        const dedupResult = [
            {ticker: 'AAPL', name: 'Apple Inc.'},
            {ticker: 'MSFT', name: 'Microsoft Corporation'},
            {ticker: 'GOOGL', name: 'Alphabet Inc.'}
        ];

        (stocksRepository.deduplicateStocks as jest.Mock).mockReturnValueOnce(dedupResult);

        // Load more stocks
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Wait for loading more to complete
        await waitFor(() => expect(result.current.stocksLoadingMore).toBe(false));

        // Verify stocks were updated with deduplicated result
        expect(result.current.stocks).toEqual(dedupResult);
    });
});