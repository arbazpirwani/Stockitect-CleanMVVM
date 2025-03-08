import React from 'react';
import { render } from '@testing-library/react-native';
import { ExploreScreen } from '@/features/stocks/screens/ExploreScreen';

// Create a default mock viewmodel object
interface ExploreViewModelMock {
    displayedStocks: Array<{ ticker: string; name: string }>;
    isLoading: boolean;
    stocksLoadingMore: boolean;
    stocksPagination: { nextCursor: string | null; hasMore: boolean };
    error: { message: string } | null;
    isSearchMode: boolean;
    searchQuery: string;
    hasSearched: boolean;

    // New properties
    sortBy: 'ticker' | 'name';
    orderBy: 'asc' | 'desc';
    limit: 10 | 25 | 50;
    viewType: 'list' | 'grid';
    selectedStock: any | null;
    isBottomSheetVisible: boolean;

    // Original methods
    refreshStocks: jest.Mock;
    loadMoreStocks: jest.Mock;
    searchStocks: jest.Mock;
    clearSearch: jest.Mock;

    // New methods
    updateSortBy: jest.Mock;
    updateOrderBy: jest.Mock;
    updateLimit: jest.Mock;
    updateViewType: jest.Mock;
    showStockDetails: jest.Mock;
    hideStockDetails: jest.Mock;
}

const defaultMockViewModel: ExploreViewModelMock = {
    displayedStocks: [
        { ticker: 'AAPL', name: 'Apple Inc.' },
        { ticker: 'MSFT', name: 'Microsoft Corporation' },
    ],
    isLoading: false,
    stocksLoadingMore: false,
    stocksPagination: {
        nextCursor: 'test-cursor',
        hasMore: true
    },
    error: null,
    isSearchMode: false,
    searchQuery: '',
    hasSearched: false,

    // New properties
    sortBy: 'ticker',
    orderBy: 'asc',
    limit: 50,
    viewType: 'list',
    selectedStock: null,
    isBottomSheetVisible: false,

    // Original methods
    refreshStocks: jest.fn(),
    loadMoreStocks: jest.fn(),
    searchStocks: jest.fn(),
    clearSearch: jest.fn(),

    // New methods
    updateSortBy: jest.fn(),
    updateOrderBy: jest.fn(),
    updateLimit: jest.fn(),
    updateViewType: jest.fn(),
    showStockDetails: jest.fn(),
    hideStockDetails: jest.fn(),
};

// We'll use a variable so we can override values in individual tests.
let mockUseExploreViewModel = { ...defaultMockViewModel };

// Mock the useExploreViewModel hook to return our mock data
jest.mock('@/viewmodels', () => ({
    useExploreViewModel: () => mockUseExploreViewModel,
}));

describe('ExploreScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
        // Reset the viewmodel to default values after each test
        mockUseExploreViewModel = { ...defaultMockViewModel };
    });

    it('renders the title and SearchBar', () => {
        const { getByText, getByPlaceholderText } = render(<ExploreScreen />);
        expect(getByText('exploreScreen.title')).toBeTruthy();
        expect(getByPlaceholderText('exploreScreen.searchPlaceholder')).toBeTruthy();
    });

    it('renders the SortFilterBar', () => {
        const { getByTestId, getByText } = render(<ExploreScreen />);
        // Look for the collapsed filter bar which contains sortBy text (no longer a standalone label)
        expect(getByTestId('expand-filter-bar')).toBeTruthy();
        // Also check if the sort value is displayed in the collapsed filter bar
        expect(getByText('stockItem.ticker')).toBeTruthy();
    });

    it('renders FlatList with stocks when available', () => {
        const { getByText } = render(<ExploreScreen />);
        // Check that stock items are rendered
        expect(getByText('AAPL')).toBeTruthy();
        expect(getByText('Apple Inc.')).toBeTruthy();
        expect(getByText('MSFT')).toBeTruthy();
    });

    it('shows ErrorView when error exists', () => {
        // Override the error state in the mock viewmodel using a type cast to avoid TS error
        mockUseExploreViewModel.error = { message: 'Test Error' } as any;
        const { getByText } = render(<ExploreScreen />);
        expect(getByText('Test Error')).toBeTruthy();
    });

    it('renders loading indicator when loading more stocks', () => {
        mockUseExploreViewModel.stocksLoadingMore = true;
        const { getByText } = render(<ExploreScreen />);
        expect(getByText('loading')).toBeTruthy();
    });

    it('does not show loading indicator for search mode', () => {
        mockUseExploreViewModel.isSearchMode = true;
        mockUseExploreViewModel.stocksLoadingMore = true;
        const { queryByText } = render(<ExploreScreen />);
        expect(queryByText('loading')).toBeNull();
    });

    it('renders StockDetailsBottomSheet when selected stock exists', () => {
        mockUseExploreViewModel.selectedStock = { ticker: 'AAPL', name: 'Apple Inc.' };
        mockUseExploreViewModel.isBottomSheetVisible = true;
        const { queryByTestId } = render(<ExploreScreen />);
        // We'd expect the bottom sheet elements to be present in the rendered output
        // The exact query will depend on what testIDs you've assigned to the bottom sheet elements
        // For example, if you added a testID 'close-button' to the close button:
        expect(queryByTestId('close-button')).toBeTruthy();
    });

    it('uses grid view when viewType is grid', () => {
        mockUseExploreViewModel.viewType = 'grid';
        const { queryAllByTestId } = render(<ExploreScreen />);
        // We'd expect grid items instead of list items
        expect(queryAllByTestId('stock-grid-item').length).toBe(2); // 2 stocks in our mock data
        expect(queryAllByTestId('stock-list-item').length).toBe(0);
    });

    it('uses list view when viewType is list', () => {
        mockUseExploreViewModel.viewType = 'list';
        const { queryAllByTestId } = render(<ExploreScreen />);
        // We'd expect list items instead of grid items
        expect(queryAllByTestId('stock-list-item').length).toBe(2); // 2 stocks in our mock data
        expect(queryAllByTestId('stock-grid-item').length).toBe(0);
    });
});