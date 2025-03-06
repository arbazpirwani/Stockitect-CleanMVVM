import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

/**
 * ExploreScreen component
 *
 * Main screen for displaying and searching Nasdaq stocks.
 */
export const ExploreScreen: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Explore Stocks</Text>
                {/* Search bar will be added here */}
            </View>

            <View style={styles.content}>
                <Text style={styles.placeholder}>
                    Stock listings will appear here
                </Text>
                {/* Stock listing will be added here */}
            </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
    },
    placeholder: {
        ...typography.body,
        color: colors.text.secondary,
    },
});