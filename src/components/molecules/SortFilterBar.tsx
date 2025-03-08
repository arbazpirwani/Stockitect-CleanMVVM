import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { LIMIT_OPTIONS } from '@/constants';

export type SortOption = 'ticker' | 'name';
export type OrderOption = 'asc' | 'desc';
export type LimitOption = typeof LIMIT_OPTIONS[number];

interface SortFilterBarProps {
    sortBy: SortOption;
    orderBy: OrderOption;
    limit: LimitOption;
    viewType: 'list' | 'grid';
    onSortByChange: (sort: SortOption) => void;
    onOrderByChange: (order: OrderOption) => void;
    onLimitChange: (limit: LimitOption) => void;
    onViewTypeChange: (viewType: 'list' | 'grid') => void;
}

export const SortFilterBar: React.FC<SortFilterBarProps> = ({
                                                                sortBy,
                                                                orderBy,
                                                                limit,
                                                                viewType,
                                                                onSortByChange,
                                                                onOrderByChange,
                                                                onLimitChange,
                                                                onViewTypeChange,
                                                            }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Simplified display when collapsed
    if (!expanded) {
        return (
            <TouchableOpacity
                style={styles.collapsedContainer}
                onPress={toggleExpand}
                activeOpacity={0.7}
                testID="expand-filter-bar"
            >
                <View style={styles.collapsedContent}>
                    <Text style={styles.sortByLabel}>{t('exploreScreen.sortBy')}: </Text>
                    <Text style={styles.sortByValue}>{t(`stockItem.${sortBy}`)} </Text>
                    <Icon
                        name={orderBy === 'asc' ? 'arrow-up' : 'arrow-down'}
                        size={16}
                        color={colors.primary}
                    />
                </View>
                <View style={styles.viewTypeToggle}>
                    <TouchableOpacity
                        onPress={() => onViewTypeChange('list')}
                        style={[styles.viewTypeButton, viewType === 'list' && styles.activeViewType]}
                    >
                        <Icon
                            name="list"
                            size={16}
                            color={viewType === 'list' ? colors.primary : colors.text.secondary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onViewTypeChange('grid')}
                        style={[styles.viewTypeButton, viewType === 'grid' && styles.activeViewType]}
                    >
                        <Icon
                            name="grid"
                            size={16}
                            color={viewType === 'grid' ? colors.primary : colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    // Expanded view with all options
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.headerRow}
                onPress={toggleExpand}
                activeOpacity={0.7}
                testID="collapse-filter-bar"
            >
                <Text style={styles.expandedTitle}>{t('exploreScreen.filterOptions')}</Text>
                <Icon name="chevron-up" size={20} color={colors.text.secondary} />
            </TouchableOpacity>

            <View style={styles.optionsSection}>
                <Text style={styles.sectionLabel}>{t('exploreScreen.sortBy')}</Text>
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            sortBy === 'ticker' && styles.selectedPill,
                        ]}
                        onPress={() => onSortByChange('ticker')}
                        testID="sort-by-ticker"
                    >
                        <Text
                            style={[
                                styles.pillText,
                                sortBy === 'ticker' && styles.selectedPillText,
                            ]}
                        >
                            {t('stockItem.ticker')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            sortBy === 'name' && styles.selectedPill,
                        ]}
                        onPress={() => onSortByChange('name')}
                        testID="sort-by-name"
                    >
                        <Text
                            style={[
                                styles.pillText,
                                sortBy === 'name' && styles.selectedPillText,
                            ]}
                        >
                            {t('stockItem.name')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.optionsSection}>
                <Text style={styles.sectionLabel}>{t('exploreScreen.order')}</Text>
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            orderBy === 'asc' && styles.selectedPill,
                        ]}
                        onPress={() => onOrderByChange('asc')}
                        testID="order-asc"
                    >
                        <Icon
                            name="arrow-up"
                            size={16}
                            color={orderBy === 'asc' ? colors.secondary : colors.text.secondary}
                            style={styles.buttonIcon}
                        />
                        <Text
                            style={[
                                styles.pillText,
                                orderBy === 'asc' && styles.selectedPillText,
                            ]}
                        >
                            {t('exploreScreen.ascending')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            orderBy === 'desc' && styles.selectedPill,
                        ]}
                        onPress={() => onOrderByChange('desc')}
                        testID="order-desc"
                    >
                        <Icon
                            name="arrow-down"
                            size={16}
                            color={orderBy === 'desc' ? colors.secondary : colors.text.secondary}
                            style={styles.buttonIcon}
                        />
                        <Text
                            style={[
                                styles.pillText,
                                orderBy === 'desc' && styles.selectedPillText,
                            ]}
                        >
                            {t('exploreScreen.descending')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.optionsSection}>
                <Text style={styles.sectionLabel}>{t('exploreScreen.limit')}</Text>
                <View style={styles.optionsRow}>
                    {LIMIT_OPTIONS.map((value) => (
                        <TouchableOpacity
                            key={value}
                            style={[
                                styles.pillButton,
                                styles.smallPill,
                                limit === value && styles.selectedPill,
                            ]}
                            onPress={() => onLimitChange(value as LimitOption)}
                            testID={`limit-${value}`}
                        >
                            <Text
                                style={[
                                    styles.pillText,
                                    limit === value && styles.selectedPillText,
                                ]}
                            >
                                {value}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.optionsSection}>
                <Text style={styles.sectionLabel}>{t('exploreScreen.view')}</Text>
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            viewType === 'list' && styles.selectedPill,
                        ]}
                        onPress={() => onViewTypeChange('list')}
                        testID="view-list"
                    >
                        <Icon
                            name="list"
                            size={16}
                            color={viewType === 'list' ? colors.secondary : colors.text.secondary}
                            style={styles.buttonIcon}
                        />
                        <Text
                            style={[
                                styles.pillText,
                                viewType === 'list' && styles.selectedPillText,
                            ]}
                        >
                            {t('exploreScreen.listView')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.pillButton,
                            viewType === 'grid' && styles.selectedPill,
                        ]}
                        onPress={() => onViewTypeChange('grid')}
                        testID="view-grid"
                    >
                        <Icon
                            name="grid"
                            size={16}
                            color={viewType === 'grid' ? colors.secondary : colors.text.secondary}
                            style={styles.buttonIcon}
                        />
                        <Text
                            style={[
                                styles.pillText,
                                viewType === 'grid' && styles.selectedPillText,
                            ]}
                        >
                            {t('exploreScreen.gridView')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // Collapsed state styles
    collapsedContainer: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.medium,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
        marginVertical: spacing.s,
        marginHorizontal: spacing.xs,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.stockItem.border,
    },
    collapsedContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortByLabel: {
        ...typography.body,
        color: colors.text.secondary,
    },
    sortByValue: {
        ...typography.body,
        color: colors.primary,
        fontWeight: 'bold',
    },
    viewTypeToggle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewTypeButton: {
        padding: spacing.xs,
        marginLeft: spacing.s,
    },
    activeViewType: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },

    // Expanded state styles
    container: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.medium,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.m,
        marginVertical: spacing.s,
        marginHorizontal: spacing.xs,
        borderWidth: 1,
        borderColor: colors.stockItem.border,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    expandedTitle: {
        ...typography.subtitle,
        color: colors.text.primary,
    },
    optionsSection: {
        marginBottom: spacing.m,
    },
    sectionLabel: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.xs,
    },
    pillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light,
        borderRadius: borderRadius.medium,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        marginRight: spacing.s,
        marginBottom: spacing.xs,
    },
    smallPill: {
        minWidth: 50,
        justifyContent: 'center',
    },
    selectedPill: {
        backgroundColor: colors.primary,
    },
    pillText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    selectedPillText: {
        color: colors.secondary,
        fontWeight: 'bold',
    },
    buttonIcon: {
        marginRight: spacing.xs,
    },
});