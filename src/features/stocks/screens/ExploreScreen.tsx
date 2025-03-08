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
import {useTranslation} from 'react-i18next';
import {colors, typography, spacing} from '@/theme';
import {PAGINATION} from '@/constants';

import {SearchBar} from '@/components/molecules/SearchBar';
import {StockListItem} from '@/components/molecules/StockListItem';
import {ErrorView} from '@/components/molecules/ErrorView';

// Import our ViewModel
import {useExploreViewModel} from '@/viewmodels';

export const ExploreScreen: React.FC = () => {
    const {t} = useTranslation();

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

        refreshStocks,
        loadMoreStocks,
        searchStocks,
        clearSearch
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
            </View>

            <FlatList
                data={displayedStocks}
                keyExtractor={(item) => item.ticker}
                renderItem={({item}) => <StockListItem stock={item}/>}
                contentContainerStyle={styles.listContent}
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
        borderBottomWidth: 1,
        borderBottomColor: colors.stockItem.border,
    },
    title: {
        ...typography.title,
        color: colors.text.primary,
        marginBottom: spacing.s,
    },
    listContent: {
        padding: spacing.m,
        paddingBottom: spacing.xxl,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
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
    },
    loadingText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    }
});