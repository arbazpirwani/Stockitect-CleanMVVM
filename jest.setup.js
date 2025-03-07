import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock react-native-localize to avoid TurboModuleRegistry errors
jest.mock('react-native-localize', () => ({
    getLocales: jest.fn(() => [{ countryCode: 'US', languageTag: 'en-US', isRTL: false }]),
    getNumberFormatSettings: jest.fn(() => ({})),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
}));

// Stub out image and asset imports are handled via moduleNameMapper in jest.config.js

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Create a chainable mock for i18next so that .use() returns an object with .init()
jest.mock('i18next', () => {
    const chain = {
        use: function (plugin) {
            return chain;
        },
        init: jest.fn(() => Promise.resolve(chain)),
        changeLanguage: jest.fn(() => Promise.resolve()),
        t: (key) => key,
        language: 'en',
    };
    return chain;
});

// Also, mock react-i18next to use our i18next chain
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            changeLanguage: jest.fn(() => Promise.resolve()),
            language: 'en',
        },
    }),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        createNavigatorFactory: () => () => ({
            Navigator: ({ children }) => children,
            Screen: ({ children }) => children,
        }),
        useNavigation: () => ({
            navigate: jest.fn(),
            replace: jest.fn(),
        }),
    };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
global.console = {
    ...console,
    // Optionally, to suppress expected warnings:
    // warn: jest.fn(),
};
