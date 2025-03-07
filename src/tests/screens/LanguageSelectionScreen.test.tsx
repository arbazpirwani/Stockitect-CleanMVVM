// src/tests/screens/LanguageSelectionScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageSelectionScreen } from '@/features/language/screens/LanguageSelectionScreen';

// Move the definition of setLanguageMock inside the factory function and export it
jest.mock('@/viewmodels', () => {
    const setLanguageMock = jest.fn();
    return {
        useLanguageViewModel: (currentLanguage: string, callback: () => void) => ({
            selectedLanguage: currentLanguage,
            loading: false,
            setLanguage: setLanguageMock,
        }),
        __setLanguageMock: setLanguageMock,
    };
});

// Create a mock for the navigation prop
const navigationMock = {
    replace: jest.fn(),
};

// @ts-ignore
import { __setLanguageMock } from '@/viewmodels';

describe('LanguageSelectionScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the title, subtitle, and language buttons', () => {
        const { getByText } = render(
            <LanguageSelectionScreen navigation={navigationMock as any} />
        );

        // Since the translation mock returns the key, check for the keys.
        expect(getByText('languageSelection.title')).toBeTruthy();
        expect(getByText('languageSelection.subtitle')).toBeTruthy();
        expect(getByText('languageSelection.english')).toBeTruthy();
        expect(getByText('languageSelection.arabic')).toBeTruthy();
    });

    it('calls setLanguage when a language button is pressed', () => {
        const { getByText } = render(
            <LanguageSelectionScreen navigation={navigationMock as any} />
        );

        // Press the English button
        fireEvent.press(getByText('languageSelection.english'));
        expect(__setLanguageMock).toHaveBeenCalledWith('en');

        // Press the Arabic button
        fireEvent.press(getByText('languageSelection.arabic'));
        expect(__setLanguageMock).toHaveBeenCalledWith('ar');
    });
});
