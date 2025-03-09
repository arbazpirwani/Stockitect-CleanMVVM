import { NetInfoState } from '@react-native-community/netinfo';

export default {
    addEventListener: jest.fn(() => () => {}),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true })),

    // Add other methods you're using
    configure: jest.fn(),
    refresh: jest.fn(),
};