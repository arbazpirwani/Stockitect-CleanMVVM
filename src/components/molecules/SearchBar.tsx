import React, {useState, useRef} from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {colors, spacing, borderRadius} from '../../theme';

/**
 * SearchBar component props
 */
interface SearchBarProps extends TextInputProps {
    /**
     * Search query value
     */
    value: string;

    /**
     * Callback when text changes
     */
    onChangeText: (text: string) => void;

    /**
     * Loading state indicator
     */
    loading?: boolean;

    /**
     * Optional callback for clear button
     */
    onClear?: () => void;

    /**
     * Optional callback for search submission
     */
    onSubmit?: () => void;
}

/**
 * SearchBar component
 *
 * A search input field with loading indicator and clear button.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   loading={isSearching}
 *   onSubmit={handleSearch}
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
                                                        value,
                                                        onChangeText,
                                                        loading = false,
                                                        onClear,
                                                        onSubmit,
                                                        ...restProps
                                                    }) => {
    const {t} = useTranslation();
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    /**
     * Handle clear button press
     */
    const handleClear = () => {
        onChangeText('');
        onClear?.();
        inputRef.current?.focus();
    };

    /**
     * Handle submission
     */
    const handleSubmit = () => {
        onSubmit?.();
    };

    return (
        <View style={[styles.container, isFocused && styles.containerFocused]}>
            <Icon name="search" size={20} color={colors.text.secondary} style={styles.searchIcon}/>

            <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={t('exploreScreen.searchPlaceholder')}
                placeholderTextColor={colors.text.secondary}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="never" // We use our own clear button
                {...restProps}
            />

            {loading ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.loadingIndicator}/>
            ) : value.length > 0 ? (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Icon name="close-circle" size={16} color={colors.text.secondary}/>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: colors.stockItem.border,
        paddingHorizontal: spacing.m,
        height: 44,
    },
    containerFocused: {
        borderColor: colors.primary,
    },
    searchIcon: {
        marginRight: spacing.s,
    },
    input: {
        flex: 1,
        height: '100%',
        color: colors.text.primary,
        padding: 0, // Remove default padding on Android
    },
    clearButton: {
        padding: spacing.xs,
    },
    loadingIndicator: {
        marginLeft: spacing.xs,
    },
});