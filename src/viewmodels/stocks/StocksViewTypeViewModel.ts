import { useState, useCallback } from 'react';

export type ViewType = 'list' | 'grid';

export function useStocksViewTypeViewModel() {
    const [viewType, setViewType] = useState<ViewType>('list');

    const updateViewType = useCallback((type: ViewType) => {
        // Only update if type is a valid ViewType ('list' or 'grid')
        if (type === 'list' || type === 'grid') {
            setViewType(type);
        }
    }, []);

    return {
        viewType,
        updateViewType
    };
}