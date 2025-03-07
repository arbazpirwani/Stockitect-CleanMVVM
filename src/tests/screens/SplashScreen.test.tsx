import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashScreen } from '@/features/splash/screens/SplashScreen';

// Activate fake timers
jest.useFakeTimers();

// Create a mock for the navigation prop
const navigationMock = {
    replace: jest.fn(),
};

// Mock i18next translation
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('SplashScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders Nasdaq logo and developer name', () => {
        const { getByText } = render(<SplashScreen navigation={navigationMock as any} />);
        // Since t returns the key, expect the developer credit key to be rendered
        expect(getByText('developerCredit')).toBeTruthy();
    });

    it('navigates to LanguageSelection after the splash duration', () => {
        render(<SplashScreen navigation={navigationMock as any} />);
        // Fast-forward all timers (simulate the splash screen delay)
        jest.runAllTimers();
        expect(navigationMock.replace).toHaveBeenCalledWith('LanguageSelection');
    });
});
