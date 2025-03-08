import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/api/apiClient';
import { fetchStocks, searchStocks } from '@/api/polygon/stocksApi';
import { ENDPOINTS } from '@/constants';

describe('stocksApi tests with short-circuited rate limiting', () => {
    let mock: MockAdapter;

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.reset();
    });

    test('fetchStocks: success (no rate limit)', async () => {
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, {
            results: [
                {
                    ticker: 'AAPL',
                    name: 'Apple Inc.',
                    primary_exchange: 'NASDAQ',
                    type: 'CS',
                    market_cap: 2000000000000,
                    currency_name: 'USD',
                },
            ],
        });

        const result = await fetchStocks(50);
        expect(result).toEqual([
            {
                ticker: 'AAPL',
                name: 'Apple Inc.',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 2000000000000,
                currency: 'USD',
            },
        ]);
    });

    test('fetchStocks: hits rate limit (429) twice, then succeeds', async () => {
        let attemptCount = 0;
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(() => {
            attemptCount++;
            if (attemptCount < 3) {
                // Return rate limit
                return [429, { error: 'Rate limit exceeded' }];
            }
            // Return success
            return [
                200,
                {
                    results: [
                        {
                            ticker: 'AAPL',
                            name: 'Apple Inc.',
                            primary_exchange: 'NASDAQ',
                            type: 'CS',
                            market_cap: 2000000000000,
                            currency_name: 'USD',
                        },
                    ],
                },
            ];
        });

        const result = await fetchStocks(50);
        expect(attemptCount).toBe(3);
        expect(result).toEqual([
            {
                ticker: 'AAPL',
                name: 'Apple Inc.',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 2000000000000,
                currency: 'USD',
            },
        ]);
    });

    test('fetchStocks: fails after max retries (429)', async () => {
        mock
            .onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`))
            .reply(429, { error: 'Rate limit exceeded' });

        await expect(fetchStocks(50)).rejects.toMatchObject({
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please try again later.',
        });
    });

    test('searchStocks: returns empty array for empty query', async () => {
        const result = await searchStocks('', 50);
        expect(result).toEqual([]);
    });

    test('searchStocks: success for a valid query', async () => {
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, {
            results: [
                {
                    ticker: 'AAPL',
                    name: 'Apple Inc.',
                    primary_exchange: 'NASDAQ',
                    type: 'CS',
                    market_cap: 2000000000000,
                    currency_name: 'USD',
                },
            ],
        });

        const result = await searchStocks('apple', 50);
        expect(result).toEqual([
            {
                ticker: 'AAPL',
                name: 'Apple Inc.',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 2000000000000,
                currency: 'USD',
            },
        ]);
    });
});
