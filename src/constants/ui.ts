/**
 * UI related constants
 */

// Animation durations (in milliseconds)
export const ANIMATION = {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
};

// Timing constants
export const TIMING = {
    SPLASH_SCREEN_DURATION: 2000,
    DEBOUNCE_DELAY: 300,
};

// UI dimensions that aren't in theme
export const DIMENSIONS = {
    STOCK_ITEM_MIN_HEIGHT: 70,
    SEARCH_BAR_HEIGHT: 44,
    LOGO_WIDTH: 200,
    LOGO_HEIGHT: 100,
    LIST_ITEM_HEIGHT: 90,
    GRID_ITEM_HEIGHT: 150,
};

// Pagination constants
export const PAGINATION = {
    END_REACHED_THRESHOLD: 0.5,  // When to trigger loading more data (0-1)
    MAX_RETRIES: 3,              // Maximum retry attempts for failed pagination
};