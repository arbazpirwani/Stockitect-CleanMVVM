import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme';
import { Stock } from '../../types/stock';

/**
 * StockListItem component props
 */
interface StockListItemProps {
    /**
     * Stock data to display
     */
    stock: Stock;

    /**
     * Optional callback when item is pressed
     */
    onPress?: (stock: Stock) => void;

    /**
     * Optional additional container style
     */
    style?: ViewStyle;

    /**
     * Whether to show exchange info
     * @default false
     */
    showExchange?: boolean;
}

/**
 * StockListItem component
 *
 * Displays a single stock item with ticker and company name.
 *
 * @example
 * ```tsx
 * <StockListItem
 *   stock={{ ticker: 'AAPL', name: 'Apple Inc.' }}
 *   onPress={(stock) => console.log(`Selected ${stock.ticker}`)}
 * />
 * ```
 */
export const StockListItem: React.FC<StockListItemProps> = memo(({
                                                                     stock,
                                                                     onPress,
                                                                     style,
                                                                     showExchange = false,
                                                                 }) => {
    const { t } = useTranslation();

    /**
     * Handle press event
     */
    const handlePress = () => {
        if (onPress) {
            onPress(stock);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={handlePress}
            activeOpacity={onPress ? 0.7 : 1}
            testID="stock-list-item"
        >
            <View style={styles.tickerContainer}>
                <Text style={styles.ticker}>{stock.ticker}</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {stock.name}
                </Text>

                {showExchange && stock.exchange && (
                    <Text style={styles.exchange}>{stock.exchange}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.stockItem.background,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.stockItem.border,
        padding: spacing.m,
        marginBottom: spacing.s,
        ...shadows.small,
    },
    tickerContainer: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.small,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.s,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticker: {
        ...typography.subtitle,
        color: colors.secondary,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1,
        marginLeft: spacing.m,
        justifyContent: 'center',
    },
    name: {
        ...typography.body,
        color: colors.text.primary,
    },
    exchange: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
});