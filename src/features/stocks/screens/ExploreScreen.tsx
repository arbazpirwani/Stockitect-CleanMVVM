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
        error,
        hasMoreStocks,
        isSearchMode,
        searchQuery,
        hasSearched,

        loadMore,
        refreshStocks,
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
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (!isSearchMode && !isLoading && hasMoreStocks) {
                        loadMore();
                    }
                }}
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
                    // Show spinner if loading more and not in search
                    if (!isLoading || isSearchMode) return null;
                    return (
                        <View style={{padding: spacing.m}}>
                            <ActivityIndicator color={colors.primary}/>
                        </View>
                    );
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