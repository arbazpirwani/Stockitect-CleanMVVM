import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Stock } from '@appTypes/stock';

/**
 * StockGridItem component props
 */
interface StockGridItemProps {
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
}

/**
 * StockGridItem component
 *
 * Displays a single stock item in a grid cell format with ticker and company name.
 *
 * @example
 * ```tsx
 * <StockGridItem
 *   stock={{ ticker: 'AAPL', name: 'Apple Inc.' }}
 *   onPress={(stock) => console.log(`Selected ${stock.ticker}`)}
 * />
 * ```
 */
export const StockGridItem: React.FC<StockGridItemProps> = memo(({
                                                                     stock,
                                                                     onPress,
                                                                     style,
                                                                 }) => {
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
            testID="stock-grid-item"
        >
            <View style={styles.innerContainer}>
                <View style={styles.tickerContainer}>
                    <Text style={styles.ticker}>{stock.ticker}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                        {stock.name}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: spacing.xs,
        borderRadius: borderRadius.medium,
        height: 130,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: colors.stockItem.background,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.stockItem.border,
        padding: spacing.s,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tickerContainer: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.small,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.s,
        marginBottom: spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        minWidth: 80,
        height: 40,
    },
    ticker: {
        ...typography.subtitle,
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    name: {
        ...typography.caption,
        color: colors.text.primary,
        textAlign: 'center',
        fontSize: 12,
    },
});