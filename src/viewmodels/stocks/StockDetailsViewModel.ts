import { useState, useCallback } from 'react';
import { Stock } from '@/types/stock';

export function useStockDetailsViewModel() {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

    const showStockDetails = useCallback((stock: Stock) => {
        setSelectedStock(stock);
        setIsBottomSheetVisible(true);
    }, []);

    const hideStockDetails = useCallback(() => {
        setIsBottomSheetVisible(false);
        // Keep the selected stock until animation completes
        setTimeout(() => {
            setSelectedStock(null);
        }, 300);
    }, []);

    return {
        selectedStock,
        isBottomSheetVisible,
        showStockDetails,
        hideStockDetails
    };
}