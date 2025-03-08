import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CONFIG } from '@/constants';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const { config, response } = error;
        if (response && response.status === 429) {
            config.__retryCount = config.__retryCount || 0;
            if (config.__retryCount < API_CONFIG.MAX_RETRIES) {
                config.__retryCount += 1;

                // **Short-Circuit** the real delay in test mode
                if (process.env.NODE_ENV === 'test') {
                    // No real waiting:
                    await new Promise<void>((resolve) => setImmediate(resolve));
                } else {
                    // Real exponential backoff for normal usage with increased delay
                    const delay = API_CONFIG.RETRY_DELAY_BASE * Math.pow(API_CONFIG.RETRY_DELAY_FACTOR, config.__retryCount);
                    console.warn(`Rate limit reached. Retrying in ${Math.round(delay/1000)} seconds...`);
                    await new Promise<void>((resolve) => setTimeout(resolve, delay));
                }

                return axiosInstance(config);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;