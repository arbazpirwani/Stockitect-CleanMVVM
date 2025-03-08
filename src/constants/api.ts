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
    SORT: 'ticker',
    SORT_ORDER: 'asc',
};

// Page size for stock listings
export const DEFAULT_BATCH_SIZE = 50;