import { renderHook, act } from '@testing-library/react-hooks';
import { useLanguageViewModel } from '@/viewmodels/LanguageViewModel';

// Mock i18next so that changeLanguage resolves successfully
jest.mock('i18next', () => ({
    changeLanguage: jest.fn(() => Promise.resolve(true)),
    language: 'en',
}));

// Also ensure that react-i18next is mocked (if needed for other parts of your hook)
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            changeLanguage: jest.fn(() => Promise.resolve(true)),
        },
    }),
}));

// Mock react-native-restart so we can assert that Restart is called when switching to Arabic
jest.mock('react-native-restart', () => ({
    Restart: jest.fn(),
}));

import RNRestart from 'react-native-restart';

describe('LanguageViewModel', () => {
    const initialLanguage = 'en';
    const onSuccessMock = jest.fn();

    it('should return the initial state correctly', () => {
        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        expect(result.current.selectedLanguage).toBe(initialLanguage);
        expect(result.current.loading).toBe(false);
    });

    it('should update language, call callback, and restart app when setLanguage is invoked with "ar"', async () => {
        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        await act(async () => {
            await result.current.setLanguage('ar');
        });

        expect(result.current.selectedLanguage).toBe('ar');
        expect(result.current.loading).toBe(false);
        expect(onSuccessMock).toHaveBeenCalled();
        // Verify that the app restart was triggered for RTL layout
        expect(RNRestart.Restart).toHaveBeenCalled();
    });
});
