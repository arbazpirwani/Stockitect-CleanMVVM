import { StocksRepository } from '@/repositories/StocksRepository';
import * as stocksApi from '@/api/polygon/stocksApi';
import * as caching from '@/utils/caching';

// Mock the API and caching modules
jest.mock('@/api/polygon/stocksApi');
jest.mock('@/utils/caching');

const mockStocks = [
    { ticker: 'AAPL', name: 'Apple Inc.' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
];

describe('StocksRepository', () => {
    let repository: StocksRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new StocksRepository();

        // Setup default mocks for API calls
        (stocksApi.fetchStocks as jest.Mock).mockResolvedValue({
            stocks: mockStocks,
            nextCursor: 'mock-cursor'
        });
        (stocksApi.searchStocks as jest.Mock).mockResolvedValue(mockStocks);

        // Setup default mocks for caching functions
        (caching.getCachedData as jest.Mock).mockResolvedValue(null); // No cache for getStocks
        (caching.setCachedData as jest.Mock).mockResolvedValue(undefined);
        (caching.getCachedSearchResults as jest.Mock).mockResolvedValue(null); // No cache for search
        (caching.setCachedSearchResults as jest.Mock).mockResolvedValue(undefined);
    });

    describe('getStocks', () => {
        it('fetches stocks from API when not in cache', async () => {
            const result = await repository.getStocks();

            expect(caching.getCachedData).toHaveBeenCalled();
            // Update expectation to include default values for new parameters
            expect(stocksApi.fetchStocks).toHaveBeenCalledWith(50, null, 'ticker', 'asc');
            expect(caching.setCachedData).toHaveBeenCalled();
            expect(result.stocks).toEqual(mockStocks);
            expect(result.pagination.nextCursor).toBe('mock-cursor');
            expect(result.pagination.hasMore).toBe(true);
        });

        it('returns cached data when available', async () => {
            (caching.getCachedData as jest.Mock)
                .mockImplementation((key: string) => {
                    if (key.includes('stocks_list')) return mockStocks;
                    if (key.includes('next_cursor')) return 'cached-cursor';
                    return null;
                });

            const result = await repository.getStocks();

            expect(result.stocks).toEqual(mockStocks);
            expect(result.pagination.nextCursor).toBe('cached-cursor');
            expect(result.pagination.hasMore).toBe(true);
            expect(stocksApi.fetchStocks).not.toHaveBeenCalled();
        });

        it('fetches with cursor when loading next page', async () => {
            const cursor = 'page-2-cursor';
            await repository.getStocks(50, cursor);

            // Update expectation to include default values for new parameters
            expect(stocksApi.fetchStocks).toHaveBeenCalledWith(50, cursor, 'ticker', 'asc');
            // Should not try to access cache when using cursor
            expect(caching.getCachedData).not.toHaveBeenCalled();
        });

        it('propagates errors from the API', async () => {
            const apiError = { message: 'API Error', code: '500' };
            (stocksApi.fetchStocks as jest.Mock).mockRejectedValue(apiError);

            await expect(repository.getStocks()).rejects.toEqual(apiError);
        });
    });

    describe('searchStocks', () => {
        it('returns empty array for empty query', async () => {
            const result = await repository.searchStocks('');
            expect(result).toEqual([]);
            expect(stocksApi.searchStocks).not.toHaveBeenCalled();
        });

        it('fetches search results from API when not in cache', async () => {
            const result = await repository.searchStocks('apple');

            // Update expectation for the new cache key format
            expect(caching.getCachedSearchResults).toHaveBeenCalledWith('apple_ticker_asc_50');
            expect(stocksApi.searchStocks).toHaveBeenCalledWith('apple', 50, 'ticker', 'asc');
            expect(caching.setCachedSearchResults).toHaveBeenCalled();
            expect(result).toEqual(mockStocks);
        });
    });

    describe('deduplicateStocks', () => {
        it('removes duplicate stocks by ticker', () => {
            const duplicateStocks = [
                { ticker: 'AAPL', name: 'Apple Inc.' },
                { ticker: 'AAPL', name: 'Apple Inc. (duplicate)' },
                { ticker: 'MSFT', name: 'Microsoft Corporation' },
            ];

            const result = repository.deduplicateStocks(duplicateStocks);

            expect(result.length).toBe(2);
            expect(result[0].ticker).toBe('AAPL');
            expect(result[1].ticker).toBe('MSFT');
        });
    });
});