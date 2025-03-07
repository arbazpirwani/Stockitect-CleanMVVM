import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { colors, typography, spacing } from '@/theme';
import { Button } from '@/components/atoms/Button';
import { useLanguageViewModel } from '@/viewmodels';

/**
 * Props for the LanguageSelectionScreen component
 */
type LanguageSelectionScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'LanguageSelection'>;
};

/**
 * Available languages in the application
 */
type Language = 'en' | 'ar';

/**
 * LanguageSelectionScreen component
 *
 * Allows users to select their preferred language before proceeding to the main app.
 */
export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ navigation }) => {
    const { t, i18n } = useTranslation();

    // Use the ViewModel
    const { selectedLanguage, loading, setLanguage } = useLanguageViewModel(
        i18n.language,
        () => navigation.replace('Explore')
    );

    /**
     * Handle language selection
     */
    const handleLanguageSelection = async (language: Language) => {
        await setLanguage(language);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('languageSelection.title')}</Text>
            <Text style={styles.subtitle}>{t('languageSelection.subtitle')}</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title={t('languageSelection.english')}
                    onPress={() => handleLanguageSelection('en')}
                    variant={selectedLanguage === 'en' ? 'primary' : 'outline'}
                    style={styles.button}
                    loading={loading && selectedLanguage === 'en'}
                />

                <Button
                    title={t('languageSelection.arabic')}
                    onPress={() => handleLanguageSelection('ar')}
                    variant={selectedLanguage === 'ar' ? 'primary' : 'outline'}
                    style={styles.button}
                    loading={loading && selectedLanguage === 'ar'}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.l,
    },
    title: {
        ...typography.headline,
        color: colors.text.primary,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    button: {
        marginBottom: spacing.m,
        width: '100%',
    },
});