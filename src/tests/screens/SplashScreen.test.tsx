import React from 'react';
import { render, act } from '@testing-library/react-native';
import { SplashScreen } from '@/features/splash/screens/SplashScreen';
import { hasLanguageBeenSelected } from '@/i18n';

// Mock the i18n module
jest.mock('@/i18n', () => ({
    hasLanguageBeenSelected: jest.fn().mockResolvedValue(false),
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Activate fake timers
jest.useFakeTimers();

describe('SplashScreen', () => {
    const navigationMock = {
        replace: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Nasdaq logo and developer name', () => {
        const { getByText } = render(<SplashScreen navigation={navigationMock as any} />);
        expect(getByText('developerCredit')).toBeTruthy();
    });

    it('navigates to LanguageSelection when no language is selected', async () => {
        // Mock that no language is selected
        (hasLanguageBeenSelected as jest.Mock).mockResolvedValue(false);

        render(<SplashScreen navigation={navigationMock as any} />);

        // Run timers and flush promises
        await act(async () => {
            jest.runAllTimers();
        });

        // Now the navigation should have been called
        expect(navigationMock.replace).toHaveBeenCalledWith('LanguageSelection');
    });

    it('navigates to Explore when language is already selected', async () => {
        // Mock that language is already selected
        (hasLanguageBeenSelected as jest.Mock).mockResolvedValue(true);

        render(<SplashScreen navigation={navigationMock as any} />);

        // Run timers and flush promises
        await act(async () => {
            jest.runAllTimers();
        });

        // Should navigate to Explore screen
        expect(navigationMock.replace).toHaveBeenCalledWith('Explore');
    });
});