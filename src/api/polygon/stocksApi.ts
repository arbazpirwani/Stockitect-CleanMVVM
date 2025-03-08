import { AxiosError } from 'axios';
import { POLYGON_API_KEY } from '@env';
import { PolygonTickersResponse, PolygonErrorResponse, ApiError } from '@/types/api';
import { Stock } from '@/types/stock';
import { ENDPOINTS, STOCK_FILTERS } from '@/constants';
import axiosInstance from '@/api/apiClient';

// Transforms thrown Axios errors into our `ApiError`.
function handleApiError(error: any): never {
    if (error.isAxiosError) {
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
 * Extract cursor from next_url in the API response
 * @param nextUrl The next_url from the API response
 * @returns The cursor parameter or null if not found
 */
function extractCursorFromUrl(nextUrl: string | undefined): string | null {
    if (!nextUrl) return null;

    try {
        // Manually extract the cursor parameter using regex
        const cursorMatch = nextUrl.match(/[?&]cursor=([^&]+)/);
        if (cursorMatch && cursorMatch[1]) {
            // Handle URL encoding if needed
            return decodeURIComponent(cursorMatch[1]);
        }
        return null;
    } catch (error) {
        console.error('Failed to parse next_url:', error);
        return null;
    }
}

/**
 * Fetch a list of stocks from the NASDAQ exchange.
 * @param limit Number of stocks to fetch per page
 * @param cursor Optional cursor for pagination
 * @returns Promise with stocks array and pagination info
 */
export async function fetchStocks(limit: number = 50, cursor?: string | null): Promise<{
    stocks: Stock[];
    nextCursor: string | null;
}> {
    try {
        const params: Record<string, any> = {
            market: STOCK_FILTERS.MARKET,
            exchange: STOCK_FILTERS.EXCHANGE,
            active: STOCK_FILTERS.ACTIVE,
            sort: STOCK_FILTERS.SORT,
            order: STOCK_FILTERS.SORT_ORDER,
            limit,
            apiKey: POLYGON_API_KEY,
        };

        // Add cursor for pagination if provided
        if (cursor) {
            params.cursor = cursor;
        }

        const response = await axiosInstance.get<PolygonTickersResponse>(ENDPOINTS.TICKERS, {
            params
        });

        const stocks = response.data.results.map(mapTickerToStock);
        const nextCursor = extractCursorFromUrl(response.data.next_url);

        return { stocks, nextCursor };
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * Search for stocks by query.
 */
export async function searchStocks(query: string, limit: number = 50): Promise<Stock[]> {
    if (!query.trim()) {
        return [];
    }
    try {
        const response = await axiosInstance.get<PolygonTickersResponse>(ENDPOINTS.TICKERS, {
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