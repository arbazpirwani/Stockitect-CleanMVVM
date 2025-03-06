import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../../../navigation/types';
import { colors, typography, spacing } from '../../../theme';
import { Button } from '../../../components/atoms/Button';
import { changeLanguage } from '../../../i18n';

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
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(i18n.language as Language);
    const [loading, setLoading] = useState(false);

    /**
     * Handle language selection, save to storage, and update i18n
     *
     * @param language The selected language code
     */
    const selectLanguage = async (language: Language) => {
        try {
            setSelectedLanguage(language);
            setLoading(true);

            // Change the language using i18n
            await changeLanguage(language);

            // Navigate to the main app screen
            navigation.replace('Explore');
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('languageSelection.title')}</Text>
            <Text style={styles.subtitle}>{t('languageSelection.subtitle')}</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title={t('languageSelection.english')}
                    onPress={() => selectLanguage('en')}
                    variant={selectedLanguage === 'en' ? 'primary' : 'outline'}
                    style={styles.button}
                    loading={loading && selectedLanguage === 'en'}
                />

                <Button
                    title={t('languageSelection.arabic')}
                    onPress={() => selectLanguage('ar')}
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