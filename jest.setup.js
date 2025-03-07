import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Fix the NativeAnimatedHelper mock (handled via moduleNameMapper if needed)
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => {
//     return {
//         __esModule: true,
//         default: {
//             setWaitingForIdentifier: jest.fn(),
//             unsetWaitingForIdentifier: jest.fn(),
//         },
//     };
// });

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            language: 'en',
            changeLanguage: jest.fn()
        }
    })
}));

// The '@env' module is now resolved via moduleNameMapper

// Mock navigation
jest.mock('@react-navigation/native', () => {
    return {
        useNavigation: () => ({
            navigate: jest.fn(),
            replace: jest.fn()
        })
    };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
global.console = {
    ...console
    // Uncomment below to ignore specific expected warnings:
    // warn: jest.fn(),
};
