import { useState, useCallback } from 'react';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import { changeLanguage } from '@/i18n';
import { SUPPORTED_LANGUAGES } from '@/constants';

/**
 * ViewModel for the Language Selection screen
 */
export function useLanguageViewModel(
    initialLanguage: string,
    onLanguageChanged: () => void
) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(initialLanguage);
    const [loading, setLoading] = useState(false);

    /**
     * Set the application language and adjust layout direction if needed.
     */
    const setLanguage = useCallback(async (language: string) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            console.error(`Unsupported language: ${language}`);
            return;
        }

        try {
            setLoading(true);
            setSelectedLanguage(language);

            // Save language setting first (so it persists through restart)
            await changeLanguage(language);

            // Determine if the new language requires RTL (e.g., Arabic)
            const isRTL = language === 'ar';
            if (I18nManager.isRTL !== isRTL) {
                I18nManager.forceRTL(isRTL);
                // The onLanguageChanged callback won't be needed because we're restarting
                // and the app will navigate correctly based on saved language
                RNRestart.Restart();
                return; // End execution here since we're restarting
            }

            // Only call this if we're not restarting
            onLanguageChanged();
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            // Only reached if we didn't restart
            setLoading(false);
        }
    }, [onLanguageChanged]);

    return {
        selectedLanguage,
        loading,
        setLanguage
    };
}