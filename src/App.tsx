import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { colors } from '@/theme';
import { initI18n } from '@/i18n';

/**
 * Main App component
 *
 * Entry point for the application that sets up the navigation structure,
 * initializes i18n for localization, and global components like StatusBar.
 */
const App: React.FC = () => {
    const [isI18nInitialized, setIsI18nInitialized] = useState(false);

    useEffect(() => {
        // Initialize i18n
        const setupI18n = async () => {
            await initI18n();
            setIsI18nInitialized(true);
        };

        setupI18n();
    }, []);

    if (!isI18nInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />
            <AppNavigator />
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});

export default App;