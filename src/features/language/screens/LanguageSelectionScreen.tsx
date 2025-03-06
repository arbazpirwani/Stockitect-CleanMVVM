import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../../navigation/types';
import { colors, typography, spacing } from '../../../theme';
import { Button } from '../../../components/atoms/Button';

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
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * Handle language selection and save to storage
     *
     * @param language The selected language code
     */
    const selectLanguage = async (language: Language) => {
        try {
            setSelectedLanguage(language);
            setLoading(true);

            // Save selected language to AsyncStorage
            await AsyncStorage.setItem('userLanguage', language);

            // Navigate to the main app screen
            navigation.replace('Explore');
        } catch (error) {
            console.error('Error saving language preference:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Language</Text>
            <Text style={styles.subtitle}>Choose your preferred language</Text>

            <View style={styles.buttonContainer}>
                <Button
                    title="English"
                    onPress={() => selectLanguage('en')}
                    variant={selectedLanguage === 'en' ? 'primary' : 'outline'}
                    style={styles.button}
                    loading={loading && selectedLanguage === 'en'}
                />

                <Button
                    title="العربية"
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