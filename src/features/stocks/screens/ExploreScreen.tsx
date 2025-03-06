import React, {useState, useEffect} from 'react';
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
import {colors, typography, spacing} from '../../../theme';

import {SearchBar} from '../../../components/molecules/SearchBar';
import {StockListItem} from '../../../components/molecules/StockListItem';
import {ErrorView} from '../../../components/molecules/ErrorView';

// Our pagination hook from above
import {useStocks} from '../../../hooks/useStocks';

// If you have a separate "search" hook:
import {useSearch} from '../../../hooks/useSearch';

export const ExploreScreen: React.FC = () => {
    const {t} = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    // 1) normal paginated stocks
    const {
        stocks,
        loading: stocksLoading,
        error: stocksError,
        hasMore,
        loadMore,
        refresh: refreshStocks,
    } = useStocks(1, 20);

    // 2) if you want to do searching, e.g. separate logic:
    const {
        results: searchResults,
        loading: searchLoading,
        error: searchError,
        search,
    } = useSearch();

    // Trigger search when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim()) {
            search(searchQuery);
        }
    }, [searchQuery, search]);

    // Decide if we're "searching" vs "normal listing"
    const isSearchMode = searchQuery.trim().length > 0;

    // Combine or pick whichever error is relevant
    const combinedError = isSearchMode ? searchError : stocksError;
    const combinedLoading = isSearchMode ? searchLoading : stocksLoading;
    // Show search results if searching, else show normal paginated stocks
    const displayedData = isSearchMode ? searchResults : stocks;

    /**
     * Handle search query change
     */
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    /**
     * Handle search clear
     */
    const handleSearchClear = () => {
        setSearchQuery('');
    };

    /**
     * If there's an error, show the ErrorView
     */
    if (combinedError) {
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
                    message={combinedError.message || t('exploreScreen.errorMessage')}
                    onRetry={() => {
                        if (isSearchMode) {
                            // Re-run the search for `searchQuery`
                            search(searchQuery);
                        } else {
                            // normal stocks refresh
                            refreshStocks();
                        }
                    }}
                />
            </SafeAreaView>
        );
    }

    /**
     * Normal UI with FlatList
     */
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('exploreScreen.title')}</Text>
                <SearchBar
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onClear={handleSearchClear}
                    loading={searchLoading}
                />
            </View>

            <FlatList
                data={displayedData}
                keyExtractor={(item) => item.ticker}
                renderItem={({item}) => <StockListItem stock={item}/>}
                contentContainerStyle={styles.listContent}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!isSearchMode && !combinedLoading && hasMore) {
                        loadMore();
                    }
                }}
                ListEmptyComponent={() => {
                    // Show nothing while loading the first time, or a placeholder when done
                    if (combinedLoading && !displayedData.length) return null;
                    return (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {isSearchMode
                                    ? t('exploreScreen.noResults')
                                    : t('exploreScreen.stockListingPlaceholder')}
                            </Text>
                        </View>
                    );
                }}
                ListFooterComponent={() => {
                    // Show spinner if loading more and not in search
                    if (!combinedLoading || isSearchMode) return null;
                    return (
                        <View style={{padding: spacing.m}}>
                            <ActivityIndicator color={colors.primary}/>
                        </View>
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={combinedLoading && displayedData.length > 0}
                        onRefresh={() => {
                            if (isSearchMode) {
                                // If you want to "refresh" the search,
                                search(searchQuery);
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
});
