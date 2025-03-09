// src/providers/NetworkProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { useTranslation } from 'react-i18next';
import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

interface NetworkContextType {
    isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
    children: React.ReactNode;
    // Optional error handler for testing
    onError?: (error: Error) => void;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({
                                                                    children,
                                                                    onError
                                                                }) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        let unsubscribe: NetInfoSubscription | null = null;

        const checkNetworkStatus = async () => {
            try {
                const state = await NetInfo.fetch();

                // Additional null check and fallback
                const connectionStatus = state?.isConnected ?? false;

                setIsConnected(connectionStatus);
                setShowOfflineBanner(!connectionStatus);

                // Subscribe to network state changes
                unsubscribe = NetInfo.addEventListener(networkState => {
                    const newConnectionStatus = networkState?.isConnected ?? false;
                    setIsConnected(newConnectionStatus);
                    setShowOfflineBanner(!newConnectionStatus);
                });
            } catch (error) {
                // Use custom error handler if provided, otherwise fallback to console
                if (onError) {
                    onError(error instanceof Error ? error : new Error(String(error)));
                } else if (process.env.NODE_ENV !== 'test') {
                    console.error('Network status check failed', error);
                }

                setIsConnected(false);
                setShowOfflineBanner(true);
            }
        };

        checkNetworkStatus();

        // Cleanup subscription
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [onError]);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
            {showOfflineBanner && (
                <View style={styles.offlineBanner}>
                    <Text style={styles.offlineText}>
                        {t('errors.offline')}
                    </Text>
                </View>
            )}
        </NetworkContext.Provider>
    );
};

const styles = StyleSheet.create({
    offlineBanner: {
        backgroundColor: colors.warning,
        padding: spacing.m,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
    },
    offlineText: {
        ...typography.body,
        color: colors.dark,
        textAlign: 'center',
    },
});