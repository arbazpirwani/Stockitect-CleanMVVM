import { renderHook, act } from '@testing-library/react-hooks';
import { I18nManager } from 'react-native';
import { useLanguageViewModel } from '@/viewmodels/LanguageViewModel';
import { changeLanguage } from '@/i18n';
import RNRestart from 'react-native-restart';

// Mock I18nManager
jest.mock('react-native', () => ({
    I18nManager: {
        isRTL: false,
        forceRTL: jest.fn(),
    },
}));

// Mock i18n's changeLanguage
jest.mock('@/i18n', () => ({
    changeLanguage: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-restart
jest.mock('react-native-restart', () => ({
    Restart: jest.fn(),
}));

describe('LanguageViewModel', () => {
    const initialLanguage = 'en';
    const onSuccessMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the initial state correctly', () => {
        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        expect(result.current.selectedLanguage).toBe(initialLanguage);
        expect(result.current.loading).toBe(false);
    });

    it('should update language, call callback, and restart app when setLanguage is invoked with "ar"', async () => {
        // Setup mock to ensure isRTL is false (different from what we'll set for Arabic)
        (I18nManager.isRTL as boolean) = false;

        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        await act(async () => {
            await result.current.setLanguage('ar');
        });

        // Verify the mocked functions were called correctly
        expect(changeLanguage).toHaveBeenCalledWith('ar');
        expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
        expect(RNRestart.Restart).toHaveBeenCalled();

        // The following might not be accurate since we're restarting
        // and the hook execution stops before these state updates
        expect(result.current.selectedLanguage).toBe('ar');
    });

    it('should call callback but not restart for same RTL setting', async () => {
        // If already RTL and choosing Arabic (or vice versa) - no need to restart
        (I18nManager.isRTL as boolean) = true;

        const { result } = renderHook(() =>
            useLanguageViewModel(initialLanguage, onSuccessMock)
        );

        await act(async () => {
            await result.current.setLanguage('ar'); // 'ar' needs RTL=true, which matches current I18nManager.isRTL
        });

        expect(changeLanguage).toHaveBeenCalledWith('ar');
        expect(I18nManager.forceRTL).not.toHaveBeenCalled(); // Should not be called
        expect(RNRestart.Restart).not.toHaveBeenCalled(); // Should not restart
        expect(onSuccessMock).toHaveBeenCalled(); // Should call success callback instead
        expect(result.current.loading).toBe(false);
    });
});