/**
 * Storage key constants and defaults
 */

// Prefix for all app storage keys to avoid conflicts
export const STORAGE_PREFIX = 'stockitect_';

// Cache related keys
export const CACHE_KEYS = {
    STOCKS_PAGE: `${STORAGE_PREFIX}stocks_page_`,
    STOCKS_LIST: `${STORAGE_PREFIX}stocks_list`,
    STOCKS_NEXT_CURSOR: `${STORAGE_PREFIX}stocks_next_cursor`, // Added for pagination
    SEARCH_RESULTS: `${STORAGE_PREFIX}search_results_`,
    LAST_UPDATE: `${STORAGE_PREFIX}last_update_`,
    USER_LANGUAGE: `${STORAGE_PREFIX}user_language`,
};

// Cache expiration times (in milliseconds)
export const CACHE_EXPIRATION = {
    DEFAULT: 30 * 60 * 1000, // 30 minutes
    STOCKS: 60 * 60 * 1000,  // 1 hour
    SEARCH: 15 * 60 * 1000,  // 15 minutes
};

// Default values
export const DEFAULTS = {
    LANGUAGE: 'en',
};