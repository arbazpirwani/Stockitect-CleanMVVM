import { renderHook, act } from '@testing-library/react-hooks';
import { useStocksViewTypeViewModel } from '@/viewmodels/stocks/StocksViewTypeViewModel';

describe('StocksViewTypeViewModel', () => {
    it('initializes with list view type', () => {
        const { result } = renderHook(() => useStocksViewTypeViewModel());

        expect(result.current.viewType).toBe('list');
    });

    it('updates view type to grid', () => {
        const { result } = renderHook(() => useStocksViewTypeViewModel());

        act(() => {
            result.current.updateViewType('grid');
        });

        expect(result.current.viewType).toBe('grid');
    });

    it('updates view type back to list', () => {
        const { result } = renderHook(() => useStocksViewTypeViewModel());

        // Set to grid first
        act(() => {
            result.current.updateViewType('grid');
        });

        expect(result.current.viewType).toBe('grid');

        // Change back to list
        act(() => {
            result.current.updateViewType('list');
        });

        expect(result.current.viewType).toBe('list');
    });

    // Let's change this test to avoid TypeScript errors
    it('safely handles unexpected view type values', () => {
        const { result } = renderHook(() => useStocksViewTypeViewModel());

        // First set it to grid
        act(() => {
            result.current.updateViewType('grid');
        });

        expect(result.current.viewType).toBe('grid');

        // Now try with an invalid value (using any type assertion for testing)
        act(() => {
            (result.current.updateViewType as any)('invalid');
        });

        // The view type should remain as grid, not change to invalid
        expect(result.current.viewType).toBe('grid');
    });
});