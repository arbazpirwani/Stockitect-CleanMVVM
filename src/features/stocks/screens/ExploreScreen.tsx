import React from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Text,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing } from '@/theme';
import { PAGINATION } from '@/constants';

import { SearchBar } from '@/components/molecules/SearchBar';
import { StockListItem } from '@/components/molecules/StockListItem';
import { StockGridItem } from '@/components/molecules/StockGridItem';
import { ErrorView } from '@/components/molecules/ErrorView';
import { SortFilterBar } from '@/components/molecules/SortFilterBar';
import { StockDetailsBottomSheet } from '@/components/molecules/StockDetailsBottomSheet';

// Import our ViewModel
import { useExploreViewModel } from '@/viewmodels';
import { Stock } from '@appTypes/stock';

export const ExploreScreen: React.FC = () => {
    const { t } = useTranslation();

    // Use the ViewModel
    const {
        displayedStocks,
        isLoading,
        stocksLoadingMore,
        stocksPagination,
        error,
        isSearchMode,
        searchQuery,
        hasSearched,

        sortBy,
        orderBy,
        limit,
        viewType,
        selectedStock,
        isBottomSheetVisible,

        refreshStocks,
        loadMoreStocks,
        searchStocks,
        clearSearch,
        updateSortBy,
        updateOrderBy,
        updateLimit,
        updateViewType,
        showStockDetails,
        hideStockDetails
    } = useExploreViewModel();

    // Handle search query change
    const handleSearchChange = (text: string) => {
        searchStocks(text);
    };

    // Handle search clear
    const handleSearchClear = () => {
        clearSearch();
    };

    // Handle load more when reaching end of list
    const handleEndReached = () => {
        // Only load more if not in search mode and there are more items to load
        if (!isSearchMode && stocksPagination.hasMore) {
            loadMoreStocks();
        }
    };

    // Render item based on view type
    const renderStockItem = ({ item }: { item: Stock }) => {
        if (viewType === 'grid') {
            return <StockGridItem stock={item} onPress={showStockDetails} />;
        }
        return <StockListItem stock={item} onPress={showStockDetails} showExchange />;
    };

    // If there's an error, show the ErrorView
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('exploreScreen.title')}</Text>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        onClear={handleSearchClear}
                    />
                </View>

                <ErrorView
                    message={error.message || t('exploreScreen.errorMessage')}
                    onRetry={() => {
                        if (isSearchMode) {
                            searchStocks(searchQuery);
                        } else {
                            refreshStocks();
                        }
                    }}
                />
            </SafeAreaView>
        );
    }

    // Normal UI with FlatList
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('exploreScreen.title')}</Text>
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onClear={handleSearchClear}
                    loading={isSearchMode && isLoading}
                />

                <SortFilterBar
                    sortBy={sortBy}
                    orderBy={orderBy}
                    limit={limit}
                    viewType={viewType}
                    onSortByChange={updateSortBy}
                    onOrderByChange={updateOrderBy}
                    onLimitChange={updateLimit}
                    onViewTypeChange={updateViewType}
                />
            </View>

            <FlatList
                data={displayedStocks}
                keyExtractor={(item) => item.ticker}
                renderItem={renderStockItem}
                numColumns={viewType === 'grid' ? 2 : 1}
                key={viewType} // This forces a re-render when changing view types
                contentContainerStyle={[
                    styles.listContent,
                    viewType === 'grid' && styles.gridContent
                ]}
                onEndReached={handleEndReached}
                onEndReachedThreshold={PAGINATION.END_REACHED_THRESHOLD}
                ListEmptyComponent={() => {
                    // Show nothing while loading the first time, or a placeholder when done
                    if (isLoading && !displayedStocks.length) return null;
                    return (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {isSearchMode && hasSearched
                                    ? t('exploreScreen.noResults')
                                    : t('exploreScreen.stockListingPlaceholder')}
                            </Text>
                        </View>
                    );
                }}
                ListFooterComponent={() => {
                    // Don't show footer for search results or when there are no more items
                    if (isSearchMode || !stocksPagination.hasMore) return null;

                    // Show spinner if loading more or initial loading
                    if (stocksLoadingMore || isLoading) {
                        return (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator color={colors.primary}/>
                                <Text style={styles.loadingText}>{t('loading')}</Text>
                            </View>
                        );
                    }

                    return null;
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && displayedStocks.length > 0}
                        onRefresh={() => {
                            if (isSearchMode) {
                                searchStocks(searchQuery);
                            } else {
                                refreshStocks();
                            }
                        }}
                        tintColor={colors.primary}
                    />
                }
            />

            {/* Bottom sheet for stock details */}
            <StockDetailsBottomSheet
                stock={selectedStock}
                visible={isBottomSheetVisible}
                onClose={hideStockDetails}
            />
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.m,
        paddingBottom: spacing.s,
        backgroundColor: colors.secondary,
    },
    title: {
        ...typography.title,
        color: colors.text.primary,
        marginBottom: spacing.m,
        textAlign: 'center',
        fontSize: 22,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
        paddingTop: spacing.s,
    },
    gridContent: {
        alignItems: 'stretch',
        paddingHorizontal: spacing.s, // Smaller horizontal padding for grid
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    footerLoader: {
        padding: spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.s,
        marginBottom: spacing.l,
    },
    loadingText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
});