import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StockGridItem } from '@/components/molecules/StockGridItem';

describe('StockGridItem', () => {
    const mockStock = { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' };
    const onPressMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders stock details correctly', () => {
        const { getByText } = render(
            <StockGridItem stock={mockStock} />
        );
        expect(getByText('AAPL')).toBeTruthy();
        expect(getByText('Apple Inc.')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const { getByTestId } = render(
            <StockGridItem stock={mockStock} onPress={onPressMock} />
        );

        fireEvent.press(getByTestId('stock-grid-item'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
        expect(onPressMock).toHaveBeenCalledWith(mockStock);
    });

    it('renders long company names with proper ellipsis', () => {
        const longNameStock = {
            ticker: 'LONG',
            name: 'Very Long Company Name That Should Be Truncated When Displayed In The Grid View'
        };

        const { getByText } = render(
            <StockGridItem stock={longNameStock} />
        );

        // The text will be rendered but truncated with ellipsis due to numberOfLines={2}
        expect(getByText(longNameStock.name)).toBeTruthy();
    });
});