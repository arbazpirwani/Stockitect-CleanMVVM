import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StockListItem } from '@/components/molecules/StockListItem';

describe('StockListItem', () => {
    const mockStock = { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' };
    const onPressMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders stock details correctly when showExchange is true', () => {
        const { getByText } = render(
            <StockListItem stock={mockStock} showExchange={true} />
        );
        expect(getByText('AAPL')).toBeTruthy();
        expect(getByText('Apple Inc.')).toBeTruthy();
        expect(getByText('NASDAQ')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const { getByTestId } = render(
            <StockListItem stock={mockStock} onPress={onPressMock} showExchange={true} />
        );
        // The component should have testID="stock-list-item" on the TouchableOpacity
        fireEvent.press(getByTestId('stock-list-item'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders without exchange info when not provided', () => {
        const { queryByText } = render(
            <StockListItem stock={{ ...mockStock, exchange: undefined }} />
        );
        // Should not render the exchange text if exchange is undefined
        expect(queryByText('NASDAQ')).toBeNull();
    });
});
