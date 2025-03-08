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
            expect(stocksRepository.searchStocks).toHaveBeenCalledWith(
                'apple',
                result.current.limit,
                result.current.sortBy,
                result.current.orderBy
            );
            expect(result.current.searchResults).toEqual(mockStocks);
        });
    });

    it('updates sorting options and reloads data', async () => {
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Update sort by
        act(() => {
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

        // Update sort order
        act(() => {
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
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Update limit
        act(() => {
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
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Initial call count before updating view type
        const initialCallCount = (stocksRepository.getStocks as jest.Mock).mock.calls.length;

        // Update view type
        act(() => {
            result.current.updateViewType('grid');
        });

        // View type should be updated
        expect(result.current.viewType).toBe('grid');

        // But getStocks should not have been called again
        expect((stocksRepository.getStocks as jest.Mock).mock.calls.length).toBe(initialCallCount);
    });

    it('shows and hides stock details bottom sheet', async () => {
        const { result } = renderHook(() => useExploreViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.stocksLoading).toBe(false));

        // Initially the bottom sheet should be hidden
        expect(result.current.isBottomSheetVisible).toBe(false);
        expect(result.current.selectedStock).toBe(null);

        // Show stock details
        const stock = { ticker: 'AAPL', name: 'Apple Inc.' };
        act(() => {
            result.current.showStockDetails(stock);
        });

        // Bottom sheet should be visible with the selected stock
        expect(result.current.isBottomSheetVisible).toBe(true);
        expect(result.current.selectedStock).toEqual(stock);

        // Hide stock details
        act(() => {
            result.current.hideStockDetails();
        });

        // Bottom sheet should be hidden
        expect(result.current.isBottomSheetVisible).toBe(false);

        // Selected stock should still be available during the animation
        expect(result.current.selectedStock).not.toBeNull();

        // Advance timer to simulate the animation delay
        act(() => {
            jest.advanceTimersByTime(300);
        });

        // Now the selected stock should be null
        expect(result.current.selectedStock).toBeNull();
    });
});