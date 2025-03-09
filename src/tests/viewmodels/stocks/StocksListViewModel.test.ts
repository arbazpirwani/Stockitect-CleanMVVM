import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react-native';
import { useStocksListViewModel } from '@/viewmodels/stocks/StocksListViewModel';
import { stocksRepository } from '@/repositories/StocksRepository';

// Mock the repository
jest.mock('@/repositories/StocksRepository', () => ({
    stocksRepository: {
        getStocks: jest.fn(),
        deduplicateStocks: jest.fn((stocks) => stocks),
    },
}));

const mockStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
];

const mockPagination = {
    nextCursor: 'test-cursor',
    hasMore: true
};

describe('StocksListViewModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock response
        (stocksRepository.getStocks as jest.Mock).mockResolvedValue({
            stocks: mockStocks,
            pagination: mockPagination
        });
    });

    it('loads stocks on initialization', async () => {
        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for loading to complete
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Check that stocks are loaded
        expect(result.current.stocks).toEqual(mockStocks);
        expect(result.current.pagination).toEqual(mockPagination);
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(
            50, null, 'ticker', 'asc'
        );
    });

    it('handles loadMoreStocks correctly', async () => {
        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Setup mock for next page
        const nextPageStocks = [
            { ticker: 'GOOGL', name: 'Alphabet Inc.' }
        ];
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: nextPageStocks,
            pagination: { nextCursor: 'next-cursor', hasMore: true }
        });

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Load more stocks
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Should call with correct cursor
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(
            50, 'test-cursor', 'ticker', 'asc'
        );

        // Check that combined stocks include both pages
        const combinedStocks = [...mockStocks, ...nextPageStocks];
        expect(result.current.stocks).toEqual(combinedStocks);
    });

    it('updates sort options and reloads data', async () => {
        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Update sort by
        await act(async () => {
            result.current.updateSortBy('name');
        });

        // Should reload with new sort option
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(
            50, null, 'name', 'asc'
        );

        // Clear calls again
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Update order
        await act(async () => {
            result.current.updateOrderBy('desc');
        });

        // Should reload with new order
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(
            50, null, 'name', 'desc'
        );
    });

    it('updates limit and reloads data', async () => {
        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for initial load
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Update limit
        await act(async () => {
            result.current.updateLimit(25);
        });

        // Should reload with new limit
        expect(stocksRepository.getStocks).toHaveBeenCalledWith(
            25, null, 'ticker', 'asc'
        );
    });

    it('handles API errors', async () => {
        // Mock API error
        const apiError = { message: 'API Error', code: 'ERROR_CODE' };
        (stocksRepository.getStocks as jest.Mock).mockRejectedValueOnce(apiError);

        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for error to be set
        await waitFor(() => expect(result.current.error).not.toBeNull());

        expect(result.current.error).toEqual(apiError);
        expect(result.current.stocks).toEqual([]);
    });

    it('skips loadMoreStocks when already loading more', async () => {
        // Render the hook with loadingMore initially set to true
        const { result } = renderHook(() => useStocksListViewModel({ loadingMore: true }));

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Try to load more while loadingMore is true
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Should not call API
        expect(stocksRepository.getStocks).not.toHaveBeenCalled();
    });

    it('skips loadMoreStocks when error exists', async () => {
        // Create a custom error object
        const apiError = {
            message: 'API Error',
            code: 'ERROR'
        };

        // Make the initial getStocks call return successfully
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: mockStocks,
            pagination: mockPagination
        });

        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for initial load to complete
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Now mock the next call to reject with an error
        (stocksRepository.getStocks as jest.Mock).mockRejectedValueOnce(apiError);

        // Try to load more, which should set error state
        await act(async () => {
            await result.current.loadMoreStocks();
        });

        // Verify error was set
        expect(result.current.error).toEqual(apiError);

        // Clear previous API calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Try to load more again - this should be skipped due to error
        await act(async () => {
            await result.current.loadMoreStocks();
        });

        // Should not call API
        expect(stocksRepository.getStocks).not.toHaveBeenCalled();
    });

    it('skips loadMoreStocks when no more pages', async () => {
        // Create a hook with hasMore=false
        (stocksRepository.getStocks as jest.Mock).mockResolvedValueOnce({
            stocks: mockStocks,
            pagination: { nextCursor: null, hasMore: false }
        });

        const { result } = renderHook(() => useStocksListViewModel());

        // Wait for initial load to complete
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Clear previous calls
        (stocksRepository.getStocks as jest.Mock).mockClear();

        // Try to load more
        await act(async () => {
            result.current.loadMoreStocks();
        });

        // Should not call API
        expect(stocksRepository.getStocks).not.toHaveBeenCalled();
    });
});