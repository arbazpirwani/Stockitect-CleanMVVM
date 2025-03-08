import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SortFilterBar } from '@/components/molecules/SortFilterBar';

describe('SortFilterBar', () => {
    const defaultProps = {
        sortBy: 'ticker' as const,
        orderBy: 'asc' as const,
        limit: 50 as const,
        viewType: 'list' as const,
        onSortByChange: jest.fn(),
        onOrderByChange: jest.fn(),
        onLimitChange: jest.fn(),
        onViewTypeChange: jest.fn(),
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders in collapsed state by default', () => {
        const { getByTestId, queryByTestId } = render(<SortFilterBar {...defaultProps} />);

        // Should render expand button
        expect(getByTestId('expand-filter-bar')).toBeTruthy();

        // Should not render collapse button yet
        expect(queryByTestId('collapse-filter-bar')).toBeNull();
    });

    it('expands when clicked', () => {
        const { getByTestId, queryByTestId } = render(<SortFilterBar {...defaultProps} />);

        // Click to expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Should now render collapse button
        expect(getByTestId('collapse-filter-bar')).toBeTruthy();

        // Should not render expand button anymore
        expect(queryByTestId('expand-filter-bar')).toBeNull();
    });

    it('collapses when clicked in expanded state', () => {
        const { getByTestId, queryByTestId } = render(<SortFilterBar {...defaultProps} />);

        // First expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Then collapse
        fireEvent.press(getByTestId('collapse-filter-bar'));

        // Should render expand button again
        expect(getByTestId('expand-filter-bar')).toBeTruthy();

        // Should not render collapse button anymore
        expect(queryByTestId('collapse-filter-bar')).toBeNull();
    });

    it('calls onSortByChange when sort option is pressed', () => {
        const { getByTestId } = render(<SortFilterBar {...defaultProps} />);

        // First expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Select name sorting
        fireEvent.press(getByTestId('sort-by-name'));
        expect(defaultProps.onSortByChange).toHaveBeenCalledWith('name');
    });

    it('calls onOrderByChange when order option is pressed', () => {
        const { getByTestId } = render(<SortFilterBar {...defaultProps} />);

        // First expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Select descending order
        fireEvent.press(getByTestId('order-desc'));
        expect(defaultProps.onOrderByChange).toHaveBeenCalledWith('desc');
    });

    it('calls onLimitChange when limit option is pressed', () => {
        const { getByTestId } = render(<SortFilterBar {...defaultProps} />);

        // First expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Select limit 25
        fireEvent.press(getByTestId('limit-25'));
        expect(defaultProps.onLimitChange).toHaveBeenCalledWith(25);
    });

    it('calls onViewTypeChange when view type option is pressed', () => {
        const { getByTestId } = render(<SortFilterBar {...defaultProps} />);

        // First expand
        fireEvent.press(getByTestId('expand-filter-bar'));

        // Select grid view
        fireEvent.press(getByTestId('view-grid'));
        expect(defaultProps.onViewTypeChange).toHaveBeenCalledWith('grid');
    });
});