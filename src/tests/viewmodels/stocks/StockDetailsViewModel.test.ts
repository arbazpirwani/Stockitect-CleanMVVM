import { renderHook, act } from '@testing-library/react-hooks';
import { useStockDetailsViewModel } from '@/viewmodels/stocks/StockDetailsViewModel';

// Mock timers for animation delay testing
jest.useFakeTimers();

describe('StockDetailsViewModel', () => {
    it('initializes with empty state', () => {
        const { result } = renderHook(() => useStockDetailsViewModel());

        expect(result.current.selectedStock).toBeNull();
        expect(result.current.isBottomSheetVisible).toBe(false);
    });

    it('shows stock details', () => {
        const { result } = renderHook(() => useStockDetailsViewModel());

        const stock = { ticker: 'AAPL', name: 'Apple Inc.' };

        // Show stock details
        act(() => {
            result.current.showStockDetails(stock);
        });

        // Check state is updated
        expect(result.current.selectedStock).toEqual(stock);
        expect(result.current.isBottomSheetVisible).toBe(true);
    });

    it('hides stock details with animation delay', () => {
        const { result } = renderHook(() => useStockDetailsViewModel());

        // Setup state
        const stock = { ticker: 'AAPL', name: 'Apple Inc.' };
        act(() => {
            result.current.showStockDetails(stock);
        });

        // Hide stock details
        act(() => {
            result.current.hideStockDetails();
        });

        // Bottom sheet should be hidden immediately
        expect(result.current.isBottomSheetVisible).toBe(false);

        // But selected stock should still be present for animation
        expect(result.current.selectedStock).not.toBeNull();

        // After delay, selected stock should be cleared
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current.selectedStock).toBeNull();
    });

    it('can show different stock details in sequence', () => {
        const { result } = renderHook(() => useStockDetailsViewModel());

        // Show first stock
        const stock1 = { ticker: 'AAPL', name: 'Apple Inc.' };
        act(() => {
            result.current.showStockDetails(stock1);
        });

        expect(result.current.selectedStock).toEqual(stock1);

        // Show second stock
        const stock2 = { ticker: 'MSFT', name: 'Microsoft Corp.' };
        act(() => {
            result.current.showStockDetails(stock2);
        });

        // Should update to show the second stock
        expect(result.current.selectedStock).toEqual(stock2);
        expect(result.current.isBottomSheetVisible).toBe(true);
    });
});