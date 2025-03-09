import { useStocksListViewModel } from './stocks/StocksListViewModel';
import { useStocksSearchViewModel } from './stocks/StocksSearchViewModel';
import { useStockDetailsViewModel } from './stocks/StockDetailsViewModel';
import { useStocksViewTypeViewModel } from './stocks/StocksViewTypeViewModel';

// Add a testMode parameter with a default value of false
export function useExploreViewModel(testMode = false) {
    // Compose domain-specific ViewModels
    const stocksList = useStocksListViewModel();
    const stocksViewType = useStocksViewTypeViewModel();

    // Pass testMode to the search ViewModel
    const stocksSearch = useStocksSearchViewModel(
        stocksList.limit,
        stocksList.sortBy,
        stocksList.orderBy,
        { testMode } // Pass the option object with testMode
    );

    const stockDetails = useStockDetailsViewModel();

    // Computed values
    const isSearchMode = stocksSearch.searchQuery.trim().length > 0;
    const displayedStocks = isSearchMode ? stocksSearch.searchResults : stocksList.stocks;
    const isLoading = isSearchMode ? stocksSearch.loading : stocksList.loading;
    const error = isSearchMode ? stocksSearch.error : stocksList.error;

    // Refresh function based on mode
    const refreshStocks = () => {
        if (isSearchMode) {
            // In test mode, we want to ensure searchStocksWithQuery is called immediately
            stocksSearch.searchStocks(stocksSearch.searchQuery);
        } else {
            stocksList.loadStocks();
        }
    };

    return {
        // Original state - flattened from composed ViewModels
        stocks: stocksList.stocks,
        stocksLoading: stocksList.loading,
        stocksLoadingMore: stocksList.loadingMore,
        stocksError: stocksList.error,
        stocksPagination: stocksList.pagination,
        searchResults: stocksSearch.searchResults,
        searchQuery: stocksSearch.searchQuery,
        searchLoading: stocksSearch.loading,
        searchError: stocksSearch.error,
        hasSearched: stocksSearch.hasSearched,
        isSearchMode,
        displayedStocks,
        isLoading,
        error,

        // Filtering and view options
        sortBy: stocksList.sortBy,
        orderBy: stocksList.orderBy,
        limit: stocksList.limit,
        viewType: stocksViewType.viewType,
        selectedStock: stockDetails.selectedStock,
        isBottomSheetVisible: stockDetails.isBottomSheetVisible,

        // Actions
        refreshStocks,
        loadMoreStocks: stocksList.loadMoreStocks,
        searchStocks: stocksSearch.searchStocks,
        clearSearch: stocksSearch.clearSearch,
        updateSortBy: stocksList.updateSortBy,
        updateOrderBy: stocksList.updateOrderBy,
        updateLimit: stocksList.updateLimit,
        updateViewType: stocksViewType.updateViewType,
        showStockDetails: stockDetails.showStockDetails,
        hideStockDetails: stockDetails.hideStockDetails
    };
}