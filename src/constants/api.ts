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
export const DEFAULT_PAGE_SIZE = 20;