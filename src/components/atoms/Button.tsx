import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

/**
 * Button component props
 */
interface ButtonProps {
    /**
     * Text displayed in the button
     */
    title: string;

    /**
     * Function called when the button is pressed
     */
    onPress: () => void;

    /**
     * Button style variant
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'outline';

    /**
     * Whether the button is in a loading state
     * @default false
     */
    loading?: boolean;

    /**
     * Whether the button is disabled
     * @default false
     */
    disabled?: boolean;

    /**
     * Additional style for the button container
     */
    style?: ViewStyle;

    /**
     * Additional style for the button text
     */
    textStyle?: TextStyle;
}

/**
 * Button component
 *
 * A reusable button component that can be styled in different ways.
 *
 * @example
 * ```tsx
 * <Button
 *   title="Press Me"
 *   onPress={() => console.log('Button pressed')}
 *   variant="primary"
 * />
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
                                                  title,
                                                  onPress,
                                                  variant = 'primary',
                                                  loading = false,
                                                  disabled = false,
                                                  style,
                                                  textStyle,
                                              }) => {
    /**
     * Get the container style based on the variant
     */
    const getContainerStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryContainer;
            case 'secondary':
                return styles.secondaryContainer;
            case 'outline':
                return styles.outlineContainer;
            default:
                return styles.primaryContainer;
        }
    };

    /**
     * Get the text style based on the variant
     */
    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'outline':
                return styles.outlineText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                getContainerStyle(),
                disabled && styles.disabledContainer,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? colors.primary : colors.secondary}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        getTextStyle(),
                        disabled && styles.disabledText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        borderRadius: borderRadius.medium,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        ...shadows.small,
    },
    text: {
        ...typography.button,
    },
    // Primary variant
    primaryContainer: {
        backgroundColor: colors.primary,
    },
    primaryText: {
        color: colors.secondary,
    },
    // Secondary variant
    secondaryContainer: {
        backgroundColor: colors.light,
    },
    secondaryText: {
        color: colors.dark,
    },
    // Outline variant
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    // Disabled state
    disabledContainer: {
        backgroundColor: colors.light,
        opacity: 0.6,
        ...shadows.small,
    },
    disabledText: {
        color: colors.text.secondary,
    },
});