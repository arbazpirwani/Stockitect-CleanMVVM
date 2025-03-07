import React from 'react';
import { render } from '@testing-library/react-native';
import { ExploreScreen } from '@/features/stocks/screens/ExploreScreen';

// Create a default mock viewmodel object
interface ExploreViewModelMock {
    displayedStocks: Array<{ ticker: string; name: string }>;
    isLoading: boolean;
    error: { message: string } | null;
    isSearchMode: boolean;
    searchQuery: string;
    hasSearched: boolean;
    refreshStocks: jest.Mock;
    searchStocks: jest.Mock;
    clearSearch: jest.Mock;
}

const defaultMockViewModel: ExploreViewModelMock = {
    displayedStocks: [
        { ticker: 'AAPL', name: 'Apple Inc.' },
        { ticker: 'MSFT', name: 'Microsoft Corporation' },
    ],
    isLoading: false,
    error: null,
    isSearchMode: false,
    searchQuery: '',
    hasSearched: false,
    refreshStocks: jest.fn(),
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

    // Optional: If you have added a testID (e.g. "refresh-control") to the RefreshControl,
    // you can uncomment and update the following test.
    // it('calls refreshStocks on pull-to-refresh', () => {
    //   const { getByTestId } = render(<ExploreScreen />);
    //   fireEvent(getByTestId('refresh-control'), 'refresh');
    //   expect(mockUseExploreViewModel.refreshStocks).toHaveBeenCalled();
    // });
});
