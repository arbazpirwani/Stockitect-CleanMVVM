import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/api/apiClient';
import { API_CONFIG } from '@/constants';

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

        // We should have exactly 3 attempts (one initial + 2 retries = MAX_RETRIES)
        expect(callCount).toBe(3);
        expect(response.data).toEqual(responseData);
    });

    it('should respect MAX_RETRIES from API_CONFIG', async () => {
        let callCount = 0;

        // Simulate an endpoint always returning 429
        mock.onGet('/always-429').reply(() => {
            callCount++;
            return [429, { error: 'Rate limit exceeded' }];
        });

        const config = { url: '/always-429', method: 'get' };

        await expect(axiosInstance(config)).rejects.toMatchObject({
            response: { status: 429 },
        });

        // Should attempt exactly 1 + MAX_RETRIES times
        expect(callCount).toBe(1 + API_CONFIG.MAX_RETRIES);
    });
});