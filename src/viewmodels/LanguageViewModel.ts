import { useState, useCallback } from 'react';
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
     * Set the application language
     */
    const setLanguage = useCallback(async (language: string) => {
        if (!SUPPORTED_LANGUAGES.includes(language)) {
            console.error(`Unsupported language: ${language}`);
            return;
        }

        try {
            setSelectedLanguage(language);
            setLoading(true);

            await changeLanguage(language);
            onLanguageChanged();
        } catch (error) {
            console.error('Error changing language:', error);
        } finally {
            setLoading(false);
        }
    }, [onLanguageChanged]);

    return {
        selectedLanguage,
        loading,
        setLanguage
    };
}