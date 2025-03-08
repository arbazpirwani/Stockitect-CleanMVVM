import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, API_CONFIG } from '@/constants';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
});

const MAX_RETRIES = 3;

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const { config, response } = error;
        if (response && response.status === 429) {
            config.__retryCount = config.__retryCount || 0;
            if (config.__retryCount < MAX_RETRIES) {
                config.__retryCount += 1;

                // **Short-Circuit** the real delay in test mode
                if (process.env.NODE_ENV === 'test') {
                    // No real waiting:
                    await new Promise<void>((resolve) => setImmediate(resolve));
                } else {
                    // Real exponential backoff for normal usage
                    const delay = 1000 * Math.pow(2, config.__retryCount);
                    console.warn(`Rate limit reached. Retrying in ${delay} ms...`);
                    await new Promise<void>((resolve) => setTimeout(resolve, delay));
                }

                return axiosInstance(config);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
