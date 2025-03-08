import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/api/apiClient';

describe('apiClient rate limiting', () => {
    let mock: MockAdapter;

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.reset();
    });

    it('should retry on 429 errors (short-circuited delay) and eventually succeed', async () => {
        const responseData = {
            results: [
                {
                    ticker: 'AAPL',
                    name: 'Apple Inc.',
                    primary_exchange: 'NASDAQ',
                    type: 'common',
                    market_cap: 1000000,
                    currency_name: 'USD',
                },
            ],
        };

        let callCount = 0;
        // Simulate an endpoint returning 429 for the first two calls, then 200
        mock.onGet('/test-endpoint').reply(() => {
            callCount++;
            if (callCount < 3) {
                return [429, { error: 'Rate limit exceeded' }];
            }
            return [200, responseData];
        });

        const config = { url: '/test-endpoint', method: 'get' };
        const response = await axiosInstance(config);

        // We no longer check elapsed time, because test mode short-circuits the wait
        expect(callCount).toBe(3);
        expect(response.data).toEqual(responseData);
    });

    it('should reject after maximum retries on repeated 429 errors', async () => {
        mock.onGet('/always-429').reply(429, { error: 'Rate limit exceeded' });

        const config = { url: '/always-429', method: 'get' };

        await expect(axiosInstance(config)).rejects.toMatchObject({
            response: { status: 429 },
        });
    });
});
