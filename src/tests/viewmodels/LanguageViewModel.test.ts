// Add a mock for i18next so that changeLanguage resolves successfully
jest.mock('i18next', () => ({
    changeLanguage: jest.fn(() => Promise.resolve(true)),
    language: 'en',
}));

import { renderHook, act } from '@testing-library/react-hooks';
import { useLanguageViewModel } from '@/viewmodels/LanguageViewModel';

// Also ensure that react-i18next is mocked (if needed for other parts of your hook)
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            changeLanguage: jest.fn(() => Promise.resolve(true)),
        },
    }),
}));

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

    it('should update language and call callback when setLanguage is invoked', async () => {
        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        // Change the language to 'ar'
        await act(async () => {
            await result.current.setLanguage('ar');
        });

        expect(result.current.selectedLanguage).toBe('ar');
        expect(result.current.loading).toBe(false);
        expect(onSuccessMock).toHaveBeenCalled();
    });
});
