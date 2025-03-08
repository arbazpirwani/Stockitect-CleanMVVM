import MockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/api/apiClient';
import {API_CONFIG} from '@/constants';

describe('apiClient rate limiting', () => {
    let mock: MockAdapter;

    beforeAll(() => {
        mock = new MockAdapter(axiosInstance);
    });

    beforeEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
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
                    currency_name: 'USD'
                },
            ],
        };

        let callCount = 0;
        mock.onGet('/test-endpoint').reply(() => {
            callCount++;
            return callCount < 3 ? [429, {error: 'Rate limit exceeded'}] : [200, responseData];
        });

        const response = await axiosInstance.get('/test-endpoint');
        expect(callCount).toBe(3);
        expect(response.data).toEqual(responseData);
    });

    it('should respect MAX_RETRIES from API_CONFIG', async () => {
        let callCount = 0;
        mock.onGet('/always-429').reply(() => {
            callCount++;
            return [429, {error: 'Rate limit exceeded'}];
        });

        await expect(axiosInstance.get('/always-429')).rejects.toMatchObject({
            response: {status: 429},
        });
        expect(callCount).toBe(1 + API_CONFIG.MAX_RETRIES);
    });

    it('should use retry mechanism for 429 errors', async () => {
        let callCount = 0;
        mock.onGet('/delay-test').reply(() => {
            callCount++;
            return callCount < 3 ? [429, {error: 'Rate limit exceeded'}] : [200, {success: true}];
        });

        const response = await axiosInstance.get('/delay-test');
        expect(callCount).toBe(3);
        expect(response.data).toEqual({success: true});
    });

    it('should handle a successful API request without retries', async () => {
        const responseData = {data: 'success'};
        mock.onGet('/success').reply(200, responseData);

        const response = await axiosInstance.get('/success');
        expect(response.status).toBe(200);
        expect(response.data).toEqual(responseData);
        expect(mock.history.get.length).toBe(1);
    });

    it('should reject immediately on non-429 errors', async () => {
        mock.onGet('/not-found').reply(404, {error: 'Not found'});

        await expect(axiosInstance.get('/not-found')).rejects.toMatchObject({
            response: {status: 404},
        });
        expect(mock.history.get.length).toBe(1);
    });


    it('should handle malformed JSON response', async () => {
        const originalTransform = axiosInstance.defaults.transformResponse;
        axiosInstance.defaults.transformResponse = [(data) => {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    throw new SyntaxError('Invalid JSON');
                }
            }
            return data;
        }];

        mock.onGet('/malformed').reply(200, 'invalid json', {'Content-Type': 'application/json'});

        await expect(axiosInstance.get('/malformed')).rejects.toThrow('Invalid JSON');
        expect(mock.history.get.length).toBe(1);

        axiosInstance.defaults.transformResponse = originalTransform;
    });

});