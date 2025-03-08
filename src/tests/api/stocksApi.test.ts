import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/api/apiClient';
import { fetchStocks, searchStocks } from '@/api/polygon/stocksApi';
import { ENDPOINTS } from '@/constants';
import { AxiosError } from 'axios';

describe('stocksApi tests with short-circuited rate limiting', () => {
    let mock: MockAdapter;

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.reset();
    });

    test('fetchStocks: success (no rate limit)', async () => {
        const responseData = {
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
            status: 'OK',
            request_id: 'test-request',
            count: 1,
            next_url: 'https://api.polygon.io/v3/reference/tickers?cursor=test-cursor'
        };

        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, responseData);

        const result = await fetchStocks(50);
        expect(result.stocks).toEqual([
            {
                ticker: 'AAPL',
                name: 'Apple Inc.',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 2000000000000,
                currency: 'USD',
            },
        ]);
        expect(result.nextCursor).toBe('test-cursor');
    });

    test('fetchStocks: with cursor parameter', async () => {
        const responseData = {
            results: [
                {
                    ticker: 'MSFT',
                    name: 'Microsoft Corporation',
                    primary_exchange: 'NASDAQ',
                    type: 'CS',
                    market_cap: 1800000000000,
                    currency_name: 'USD',
                },
            ],
            status: 'OK',
            request_id: 'test-request-2',
            count: 1,
            next_url: 'https://api.polygon.io/v3/reference/tickers?cursor=next-cursor'
        };

        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(config => {
            // Verify the cursor was passed in the request
            const hasCursor = config.params && config.params.cursor === 'test-cursor';
            return hasCursor ? [200, responseData] : [400, { error: 'Missing cursor' }];
        });

        const result = await fetchStocks(50, 'test-cursor');
        expect(result.stocks).toEqual([
            {
                ticker: 'MSFT',
                name: 'Microsoft Corporation',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 1800000000000,
                currency: 'USD',
            },
        ]);
        expect(result.nextCursor).toBe('next-cursor');
    });

    test('fetchStocks: handles next_url with special characters in cursor', async () => {
        const responseData = {
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
            status: 'OK',
            request_id: 'test-request',
            count: 1,
            next_url: 'https://api.polygon.io/v3/reference/tickers?cursor=YWN0aXZlPXRydWUmYXA9QUNJQyU3QzMyZWM3OGU0YmViN2Q3YzdjZjU0OGRlNDg5ZjIwZjI3ZDc2ZDc5MzIzMjU5ZjU2YTg1MzFmY2M4NDZhYzJlYWYmYXM9JmRhdGU9MjAyNS0wMy0wOCZleGNoYW5nZT1YTkFTJmxpbWl0PTUwJm1hcmtldD1zdG9ja3Mmb3JkZXI9YXNjJnNvcnQ9dGlja2Vy'
        };

        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, responseData);

        const result = await fetchStocks(50);
        expect(result.nextCursor).toBe('YWN0aXZlPXRydWUmYXA9QUNJQyU3QzMyZWM3OGU0YmViN2Q3YzdjZjU0OGRlNDg5ZjIwZjI3ZDc2ZDc5MzIzMjU5ZjU2YTg1MzFmY2M4NDZhYzJlYWYmYXM9JmRhdGU9MjAyNS0wMy0wOCZleGNoYW5nZT1YTkFTJmxpbWl0PTUwJm1hcmtldD1zdG9ja3Mmb3JkZXI9YXNjJnNvcnQ9dGlja2Vy');
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
                    status: 'OK',
                    count: 1,
                    next_url: null
                },
            ];
        });

        const result = await fetchStocks(50);
        expect(attemptCount).toBe(3);
        expect(result.stocks).toEqual([
            {
                ticker: 'AAPL',
                name: 'Apple Inc.',
                exchange: 'NASDAQ',
                type: 'CS',
                marketCap: 2000000000000,
                currency: 'USD',
            },
        ]);
        expect(result.nextCursor).toBeNull();
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
            status: 'OK',
            count: 1
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

    // New tests for better coverage
    test('handleApiError: handles 401 unauthorized error', async () => {
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(401, {
            error: 'Invalid API key'
        });

        await expect(fetchStocks(50)).rejects.toMatchObject({
            code: 'INVALID_API_KEY',
            message: 'Invalid API key. Please check your API key.'
        });
    });

    test('handleApiError: handles general API error with message', async () => {
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(400, {
            error: 'Bad request parameter'
        });

        await expect(fetchStocks(50)).rejects.toMatchObject({
            code: '400',
            message: 'Bad request parameter'
        });
    });

    test('handleApiError: handles network error', async () => {
        // Create a properly typed axios error for network errors
        const axiosNetworkError = new Error('Network Error') as AxiosError;
        axiosNetworkError.isAxiosError = true;
        axiosNetworkError.request = {}; // Has request but no response
        axiosNetworkError.response = undefined;

        // Override axios to throw this custom error
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(() => {
            throw axiosNetworkError;
        });

        await expect(fetchStocks(50)).rejects.toMatchObject({
            code: 'NETWORK_ERROR',
            message: 'Network error. Please check your internet connection.'
        });
    });

    test('handleApiError: handles unexpected error', async () => {
        // Force an unexpected error
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(() => {
            throw new Error('Unexpected error');
        });

        await expect(fetchStocks(50)).rejects.toMatchObject({
            message: 'An unexpected error occurred'
        });
    });

    test('extractCursorFromUrl: handles null or undefined URL', () => {
        // This is testing a function that's not exported
        // We'll test it indirectly through fetchStocks result
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, {
            results: [],
            status: 'OK',
            count: 0,
            next_url: undefined
        });

        return fetchStocks(50).then(result => {
            expect(result.nextCursor).toBeNull();
        });
    });

    test('extractCursorFromUrl: handles URL without cursor parameter', () => {
        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, {
            results: [],
            status: 'OK',
            count: 0,
            next_url: 'https://api.polygon.io/v3/reference/tickers?other=param'
        });

        return fetchStocks(50).then(result => {
            expect(result.nextCursor).toBeNull();
        });
    });

    test('extractCursorFromUrl: handles URL decoding errors', () => {
        // Create URL with invalid encoding that will throw when decoded
        const badUrl = 'https://api.polygon.io/v3/reference/tickers?cursor=%invalid%';

        mock.onGet(new RegExp(`${ENDPOINTS.TICKERS}.*`)).reply(200, {
            results: [],
            status: 'OK',
            count: 0,
            next_url: badUrl
        });

        // Mock console.error to prevent error output in test
        const originalConsoleError = console.error;
        console.error = jest.fn();

        return fetchStocks(50).then(result => {
            expect(result.nextCursor).toBeNull();
            expect(console.error).toHaveBeenCalled();
            // Restore console.error
            console.error = originalConsoleError;
        });
    });
});