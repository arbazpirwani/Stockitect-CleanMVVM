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
    refreshStocks: jest.Mock;
    loadMoreStocks: jest.Mock;
    searchStocks: jest.Mock;
    clearSearch: jest.Mock;
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
    refreshStocks: jest.fn(),
    loadMoreStocks: jest.fn(),
    searchStocks: jest.fn(),
    clearSearch: jest.fn(),
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

    it('does not show loading indicator when no more items', () => {
        mockUseExploreViewModel.stocksPagination.hasMore = false;
        mockUseExploreViewModel.stocksLoadingMore = true;
        const { queryByText } = render(<ExploreScreen />);
        expect(queryByText('loading')).toBeNull();
    });

    // Optional: If you have added a testID to the FlatList, you can uncomment and update:
    // it('calls loadMoreStocks on end reached', () => {
    //   const { getByTestId } = render(<ExploreScreen />);
    //   fireEvent(getByTestId('stocks-list'), 'onEndReached');
    //   expect(mockUseExploreViewModel.loadMoreStocks).toHaveBeenCalled();
    // });
});