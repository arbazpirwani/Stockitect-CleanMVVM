
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initI18n } from '@/i18n';
import { colors } from '@/theme';

interface I18nProviderProps {
    children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
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

    return <>{children}</>;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});