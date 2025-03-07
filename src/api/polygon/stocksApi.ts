import axios, { AxiosError, AxiosInstance } from 'axios';
import { POLYGON_API_KEY } from '@env';
import { PolygonTickersResponse, PolygonErrorResponse, ApiError } from '@/types/api';
import { Stock } from '@/types/stock';
import { API_BASE_URL, API_CONFIG, ENDPOINTS, STOCK_FILTERS } from '@/constants';

// Create a configured client.
function createApiClient(): AxiosInstance {
    return axios.create({
        baseURL: API_BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
    });
}

// Transforms thrown Axios errors into our `ApiError`.
// Transforms thrown Axios errors into our `ApiError`.
function handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<PolygonErrorResponse>;
        if (axiosError.response) {
            const status = axiosError.response.status;
            const errData = axiosError.response.data;

            if (status === 429) {
                throw {
                    message: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED',
                    originalError: error,
                } as ApiError;
            } else if (status === 401) {
                throw {
                    message: 'Invalid API key. Please check your API key.',
                    code: 'INVALID_API_KEY',
                    originalError: error,
                } as ApiError;
            } else if (errData?.error) {
                throw {
                    message: errData.error,
                    code: String(status),
                    originalError: error,
                } as ApiError;
            } else {
                throw {
                    message: `API error: ${status}`,
                    code: String(status),
                    originalError: error,
                } as ApiError;
            }
        } else if (axiosError.request) {
            throw {
                message: 'Network error. Please check your internet connection.',
                code: 'NETWORK_ERROR',
                originalError: error,
            } as ApiError;
        }
    }

    // Default error case
    throw {
        message: 'An unexpected error occurred',
        originalError: error,
    } as ApiError;
}

function mapTickerToStock(t: any): Stock {
    return {
        ticker: t.ticker,
        name: t.name,
        exchange: t.primary_exchange,
        type: t.type,
        marketCap: t.market_cap,
        currency: t.currency_name,
    };
}

/**
 * Fetch a list of stocks from the NASDAQ exchange
 */
export async function fetchStocks(limit: number = 50): Promise<Stock[]> {
    try {
        const client = createApiClient();

        const response = await client.get<PolygonTickersResponse>(ENDPOINTS.TICKERS, {
            params: {
                market: STOCK_FILTERS.MARKET,
                exchange: STOCK_FILTERS.EXCHANGE,
                active: STOCK_FILTERS.ACTIVE,
                sort: STOCK_FILTERS.SORT,
                order: STOCK_FILTERS.SORT_ORDER,
                limit,
                // No offset parameter since we're not paginating
                apiKey: POLYGON_API_KEY,
            },
        });

        return response.data.results.map(mapTickerToStock);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Search for stocks by query
 */
export async function searchStocks(query: string, limit: number = 50): Promise<Stock[]> {
    if (!query.trim()) {
        return [];
    }

    try {
        const client = createApiClient();
        const response = await client.get<PolygonTickersResponse>(ENDPOINTS.TICKERS, {
            params: {
                market: STOCK_FILTERS.MARKET,
                exchange: STOCK_FILTERS.EXCHANGE,
                active: STOCK_FILTERS.ACTIVE,
                search: query,
                sort: STOCK_FILTERS.SORT,
                order: STOCK_FILTERS.SORT_ORDER,
                limit,
                apiKey: POLYGON_API_KEY,
            },
        });

        return response.data.results.map(mapTickerToStock);
    } catch (error) {
        return handleApiError(error);
    }
}