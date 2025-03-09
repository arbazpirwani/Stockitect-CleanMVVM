import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors, typography, spacing} from '@/theme';
import {Button} from '@components/atoms/Button';
import Icon from "react-native-vector-icons/Ionicons";

/**
 * ErrorView component props
 */
interface ErrorViewProps {
    /**
     * Error message to display
     */
    message: string;

    /**
     * Callback when retry button is pressed
     */
    onRetry: () => void;

    /**
     * Optional title for the error
     */
    title?: string;

    /**
     * Whether the error is related to network connectivity
     */
    isNetworkError?: boolean;
}

/**
 * ErrorView component
 *
 * Displays an error message with a retry button.
 *
 * @example
 * ```tsx
 * <ErrorView
 *   message="Failed to load stocks"
 *   onRetry={handleRetry}
 * />
 * ```
 */
export const ErrorView: React.FC<ErrorViewProps> = ({
                                                        message,
                                                        onRetry,
                                                        title,
                                                        isNetworkError
                                                    }) => {
    const {t} = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {isNetworkError && (
                    <Icon
                        name="cloud-offline"
                        size={48}
                        color={colors.warning}
                        style={styles.icon}
                    />
                )}
                {title && <Text style={styles.title}>{title}</Text>}
                <Text style={styles.message}>{message}</Text>
                <Button
                    title={t('exploreScreen.retryButton')}
                    onPress={onRetry}
                    variant="primary"
                    style={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.l,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        ...typography.title,
        color: colors.text.primary,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    message: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.l,
        textAlign: 'center',
    },
    button: {
        minWidth: 120,
    },
    icon: {
        marginBottom: spacing.m,
    },
});