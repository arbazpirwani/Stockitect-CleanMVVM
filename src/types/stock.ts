/**
 * Stock data type definitions
 */

/**
 * Basic stock information
 */
export interface Stock {
    /**
     * Stock ticker symbol (e.g., AAPL, MSFT)
     */
    ticker: string;

    /**
     * Full company name
     */
    name: string;

    /**
     * Primary exchange where the stock is listed
     */
    exchange?: string;

    /**
     * Type of stock or security
     */
    type?: string;

    /**
     * Market capitalization (when available)
     */
    marketCap?: number;

    /**
     * Currency used for trading
     */
    currency?: string;
}

/**
 * Stock price information
 */
export interface StockPrice {
    /**
     * Stock ticker symbol
     */
    ticker: string;

    /**
     * Current price
     */
    price: number;

    /**
     * Price change
     */
    change: number;

    /**
     * Percentage price change
     */
    changePercent: number;

    /**
     * Previous close price
     */
    previousClose?: number;

    /**
     * Opening price for the current day
     */
    open?: number;

    /**
     * High price for the current day
     */
    high?: number;

    /**
     * Low price for the current day
     */
    low?: number;

    /**
     * Trading volume
     */
    volume?: number;
}