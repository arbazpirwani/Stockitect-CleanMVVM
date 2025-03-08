/**
 * API related constants
 */

// Base URLs
export const API_BASE_URL = 'https://api.polygon.io';

// Endpoints
export const ENDPOINTS = {
    TICKERS: '/v3/reference/tickers',
};

// Request configuration
export const API_CONFIG = {
    TIMEOUT: 10000,
    CONTENT_TYPE: 'application/json',
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 2000, // Increased base delay to 2 seconds
    RETRY_DELAY_FACTOR: 2.5, // Use a larger factor for more aggressive backoff
};

// Stock filters
export const STOCK_FILTERS = {
    MARKET: 'stocks',
    EXCHANGE: 'XNAS', // "XNAS" is the primary exchange code for Nasdaq
    ACTIVE: true,
    SORT: 'ticker', // Default sort field
    SORT_ORDER: 'asc', // Default sort order
};

// Sort options
export const SORT_OPTIONS = {
    TICKER: 'ticker',
    NAME: 'name',
};

// Order options
export const ORDER_OPTIONS = {
    ASC: 'asc',
    DESC: 'desc',
};

// Limit options
export const LIMIT_OPTIONS = [10, 25, 50];

// Page size for stock listings
export const DEFAULT_BATCH_SIZE = 50;