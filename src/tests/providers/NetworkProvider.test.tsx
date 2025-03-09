import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Text, View } from 'react-native';
import { NetworkProvider, useNetwork } from '@/providers/NetworkProvider';
import {act} from "@testing-library/react-hooks";

// Explicitly mock the entire NetInfo module
jest.mock('@react-native-community/netinfo', () => ({
    addEventListener: jest.fn(),
    fetch: jest.fn(),
}));

// Mock translation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// Test component to consume network context and display status
const TestConsumer: React.FC = () => {
    const { isConnected } = useNetwork();
    return (
        <View>
            <Text testID="connection-status">
                {isConnected === null ? 'Checking' : isConnected ? 'Connected' : 'Disconnected'}
            </Text>
        </View>
    );
};

describe('NetworkProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('provides initial network connection state', async () => {
        // Mock NetInfo to return connected state
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: true });

        // Mock addEventListener to simulate callback
        (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback: (state: any) => void) => {
                callback({ isConnected: true });
                return () => {};
            }
        );

        // Render the component
        const { getByTestId } = render(
            <NetworkProvider>
                <TestConsumer />
            </NetworkProvider>
        );

        // Wait for the state to update
        await waitFor(() => {
            expect(getByTestId('connection-status').props.children).toBe('Connected');
        });
    });
    it('shows offline banner when disconnected', async () => {
        // Mock NetInfo to return disconnected state
        (NetInfo.fetch as jest.Mock).mockResolvedValue({ isConnected: false });

        // Mock addEventListener to simulate callback
        (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback: (state: NetInfoState) => void) => {
                callback({ isConnected: false } as NetInfoState);
                return () => {};
            }
        );

        const { getByTestId, getByText } = render(
            <NetworkProvider>
                <TestConsumer />
            </NetworkProvider>
        );

        // Wait for the state to update
        await waitFor(() => {
            // Check that the consumer shows disconnected status
            expect(getByTestId('connection-status').props.children).toBe('Disconnected');

            // Check for offline banner text
            expect(getByText('errors.offline')).toBeTruthy();
        });
    });

    it('handles null network state', async () => {
        // Mock NetInfo to return null or undefined
        (NetInfo.fetch as jest.Mock).mockResolvedValue(null);

        // Mock addEventListener to simulate callback with null
        (NetInfo.addEventListener as jest.Mock).mockImplementation(
            (callback: (state: NetInfoState) => void) => {
                callback({ isConnected: null } as NetInfoState);
                return () => {};
            }
        );

        const { getByTestId, getByText } = render(
            <NetworkProvider>
                <TestConsumer />
            </NetworkProvider>
        );

        // Wait for the state to update
        await waitFor(() => {
            // Check that the consumer shows disconnected status
            expect(getByTestId('connection-status').props.children).toBe('Disconnected');

            // Check for offline banner text
            expect(getByText('errors.offline')).toBeTruthy();
        });
    });

    it('handles network status check failure', async () => {
        // Create a mock error handler
        const mockErrorHandler = jest.fn();

        // Mock NetInfo to throw an error
        (NetInfo.fetch as jest.Mock).mockRejectedValue(new Error('Network check failed'));

        // Mock addEventListener to not be called
        (NetInfo.addEventListener as jest.Mock).mockReturnValue(() => {});

        const { getByTestId, getByText } = render(
            <NetworkProvider onError={mockErrorHandler}>
                <TestConsumer />
            </NetworkProvider>
        );

        // Wait for the state to update
        await waitFor(() => {
            // Check that the consumer shows disconnected status
            expect(getByTestId('connection-status').props.children).toBe('Disconnected');

            // Check for offline banner text
            expect(getByText('errors.offline')).toBeTruthy();

            // Verify error handler was called
            expect(mockErrorHandler).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});