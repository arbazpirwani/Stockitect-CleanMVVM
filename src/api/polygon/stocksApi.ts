import axios, { AxiosError, AxiosInstance } from 'axios';
import { POLYGON_API_KEY } from '@env';
import { PolygonTickersResponse, PolygonErrorResponse, ApiError } from '@/types/api';
import { Stock } from '@/types/stock';
import { API_BASE_URL, API_CONFIG, ENDPOINTS, STOCK_FILTERS, DEFAULT_PAGE_SIZE } from '@/constants';

// Create a configured client.
function createApiClient(): AxiosInstance {
    return axios.create({
        baseURL: API_BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: { 'Content-Type': API_CONFIG.CONTENT_TYPE },
    });
}

// Transforms thrown Axios errors into our `ApiError`.
function handleApiError(error: any): never {
    let apiError: ApiError = {
        message: 'An unexpected error occurred',
        originalError: error,
    };

    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<PolygonErrorResponse>;
        if (axiosError.response) {
            const status = axiosError.response.status;
            const errData = axiosError.response.data;

            if (status === 429) {
                apiError = {
                    message: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED',
                    originalError: error,
                };
            } else if (status === 401) {
                apiError = {
                    message: 'Invalid API key. Please check your API key.',
                    code: 'INVALID_API_KEY',
                    originalError: error,
                };
            } else if (errData?.error) {
                apiError = {
                    message: errData.error,
                    code: String(status),
                    originalError: error,
                };
            } else {
                apiError = {
                    message: `API error: ${status}`,
                    code: String(status),
                    originalError: error,
                };
            }
        } else if (axiosError.request) {
            apiError = {
                message: 'Network error. Please check your internet connection.',
                code: 'NETWORK_ERROR',
                originalError: error,
            };
        }
    }

    throw apiError;
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
 * Fetch a paginated list of stocks from the NASDAQ exchange
 */
export async function fetchStocks(
    page: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
): Promise<Stock[]> {
    try {
        const client = createApiClient();
        const offset = (page - 1) * limit;

        const response = await client.get<PolygonTickersResponse>(ENDPOINTS.TICKERS, {
            params: {
                market: STOCK_FILTERS.MARKET,
                exchange: STOCK_FILTERS.EXCHANGE,
                active: STOCK_FILTERS.ACTIVE,
                sort: STOCK_FILTERS.SORT,
                order: STOCK_FILTERS.SORT_ORDER,
                limit,
                offset,
                apiKey: POLYGON_API_KEY,
            },
        });

        // response.data.results might be empty if you have free-tier restrictions
        return response.data.results.map(mapTickerToStock);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Optionally, a search function if you want to do search-based queries
 */
export async function searchStocks(query: string, limit: number = DEFAULT_PAGE_SIZE): Promise<Stock[]> {
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