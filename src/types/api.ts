/**
 * API response type definitions for Polygon.io
 */

/**
 * Base response interface for paginated Polygon.io API responses
 */
export interface PolygonBaseResponse {
    /**
     * Response status message
     */
    status: string;

    /**
     * Request ID
     */
    request_id?: string;

    /**
     * Number of results in this response
     */
    count: number;

    /**
     * URL for the next page of results
     */
    next_url?: string;
}

/**
 * Stock ticker result from Polygon.io
 */
export interface PolygonTickerResult {
    /**
     * Ticker symbol
     */
    ticker: string;

    /**
     * Company or security name
     */
    name: string;

    /**
     * Market type
     */
    market: string;

    /**
     * Stock locale
     */
    locale: string;

    /**
     * Primary exchange
     */
    primary_exchange: string;

    /**
     * Security type
     */
    type: string;

    /**
     * Whether the stock is active
     */
    active: boolean;

    /**
     * Currency used for trading
     */
    currency_name: string;

    /**
     * Composite FIGI identifier
     */
    composite_figi?: string;

    /**
     * Share class FIGI identifier
     */
    share_class_figi?: string;

    /**
     * Market cap (if available)
     */
    market_cap?: number;

    /**
     * Last updated timestamp
     */
    last_updated_utc: string;
}

/**
 * Tickers response from Polygon.io
 */
export interface PolygonTickersResponse extends PolygonBaseResponse {
    /**
     * Array of ticker results
     */
    results: PolygonTickerResult[];
}

/**
 * Error response from Polygon.io
 */
export interface PolygonErrorResponse {
    /**
     * Error status
     */
    status: string;

    /**
     * Error message
     */
    error: string;

    /**
     * Request ID
     */
    request_id?: string;
}

/**
 * Normalized API error
 */
export interface ApiError {
    /**
     * Error message
     */
    message: string;

    /**
     * Error code (if available)
     */
    code?: string;

    /**
     * Original error
     */
    originalError?: any;
}