import axios from 'axios';
import { fetchStocks, searchStocks } from '@/api/polygon/stocksApi';
import { Stock } from '@/types/stock';

// Mock axios completely
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn()
    })),
    isAxiosError: jest.fn()
}));

describe('stocksApi', () => {
    // Get the mocked axios client
    const mockAxiosGet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup the axios mock
        (axios.create as jest.Mock).mockReturnValue({
            get: mockAxiosGet
        });
        // Fix the TypeScript error by using a proper cast
        ((axios.isAxiosError as unknown) as jest.Mock).mockReturnValue(true);
    });

    describe('fetchStocks', () => {
        it('should fetch stocks successfully', async () => {
            // Setup successful response
            const mockApiResponse = {
                data: {
                    results: [
                        {
                            ticker: 'AAPL',
                            name: 'Apple Inc.',
                            primary_exchange: 'NASDAQ',
                            type: 'CS',
                            market_cap: 2000000000000,
                            currency_name: 'USD'
                        }
                    ]
                }
            };

            mockAxiosGet.mockResolvedValueOnce(mockApiResponse);

            const result = await fetchStocks();

            expect(axios.create).toHaveBeenCalled();
            expect(mockAxiosGet).toHaveBeenCalled();
            expect(result).toEqual([
                {
                    ticker: 'AAPL',
                    name: 'Apple Inc.',
                    exchange: 'NASDAQ',
                    type: 'CS',
                    marketCap: 2000000000000,
                    currency: 'USD'
                }
            ]);
        });

        it('should handle API error', async () => {
            const mockError = {
                response: {
                    status: 429,
                    data: { error: 'Rate limit exceeded' }
                }
            };

            mockAxiosGet.mockRejectedValueOnce(mockError);

            await expect(fetchStocks()).rejects.toMatchObject({
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Rate limit exceeded. Please try again later.'
            });
        });
    });

    describe('searchStocks', () => {
        it('should return empty array for empty query', async () => {
            const result = await searchStocks('');
            expect(result).toEqual([]);
            expect(mockAxiosGet).not.toHaveBeenCalled();
        });

        it('should search stocks successfully', async () => {
            const mockApiResponse = {
                data: {
                    results: [
                        {
                            ticker: 'AAPL',
                            name: 'Apple Inc.',
                            primary_exchange: 'NASDAQ',
                            type: 'CS',
                            market_cap: 2000000000000,
                            currency_name: 'USD'
                        }
                    ]
                }
            };

            mockAxiosGet.mockResolvedValueOnce(mockApiResponse);

            const result = await searchStocks('apple');

            expect(mockAxiosGet).toHaveBeenCalled();
            expect(result).toEqual([
                {
                    ticker: 'AAPL',
                    name: 'Apple Inc.',
                    exchange: 'NASDAQ',
                    type: 'CS',
                    marketCap: 2000000000000,
                    currency: 'USD'
                }
            ]);
        });
    });
});