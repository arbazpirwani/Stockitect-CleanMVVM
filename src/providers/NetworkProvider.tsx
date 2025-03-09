import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { useTranslation } from 'react-i18next';

interface NetworkContextType {
    isConnected: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: null });

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
    children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Subscribe to network status changes
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected === false) {
                setShowOfflineBanner(true);
            } else if (state.isConnected === true) {
                // Hide the banner after a short delay when connection is restored
                setTimeout(() => setShowOfflineBanner(false), 2000);
            }
        });

        // Get initial network status
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected);
            setShowOfflineBanner(state.isConnected === false);
        });

        return () => unsubscribe();
    }, []);

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