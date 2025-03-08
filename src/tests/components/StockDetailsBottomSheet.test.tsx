import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StockDetailsBottomSheet } from '@/components/molecules/StockDetailsBottomSheet';

describe('StockDetailsBottomSheet', () => {
    const mockStock = {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        type: 'Common Stock',
        marketCap: 2500000000000,
        currency: 'USD'
    };

    const onCloseMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders nothing when stock is null', () => {
        const { toJSON } = render(
            <StockDetailsBottomSheet
                stock={null}
                visible={true}
                onClose={onCloseMock}
            />
        );
        expect(toJSON()).toBeNull();
    });

    it('renders stock details when stock is provided and visible is true', () => {
        const { getByText, getAllByText } = render(
            <StockDetailsBottomSheet
                stock={mockStock}
                visible={true}
                onClose={onCloseMock}
            />
        );

        // Use testID or more specific queries to avoid duplicate matches
        expect(getByText('AAPL')).toBeTruthy();
        expect(getByText('Apple Inc.')).toBeTruthy();
        // Multiple elements might exist for these texts, so use getAllByText
        expect(getAllByText('NASDAQ').length).toBeGreaterThan(0);
        expect(getAllByText('Common Stock').length).toBeGreaterThan(0);
        // Market cap should be formatted as $2500.00B
        expect(getByText('$2500.00B')).toBeTruthy();
        expect(getAllByText('USD').length).toBeGreaterThan(0);
    });

    it('calls onClose when the close button is pressed', () => {
        const { getByTestId } = render(
            <StockDetailsBottomSheet
                stock={mockStock}
                visible={true}
                onClose={onCloseMock}
            />
        );

        fireEvent.press(getByTestId('close-button'));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the overlay is pressed', () => {
        const { getByTestId } = render(
            <StockDetailsBottomSheet
                stock={mockStock}
                visible={true}
                onClose={onCloseMock}
            />
        );

        fireEvent.press(getByTestId('close-overlay'));
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('renders not available for missing data', () => {
        const incompleteStock = {
            ticker: 'TEST',
            name: 'Test Inc.',
            // Missing other properties
        };

        const { getByText } = render(
            <StockDetailsBottomSheet
                stock={incompleteStock}
                visible={true}
                onClose={onCloseMock}
            />
        );

        expect(getByText('stockDetails.notAvailable')).toBeTruthy();
    });
});