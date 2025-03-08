import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@/components/molecules/SearchBar';

describe('SearchBar', () => {
    const onChangeTextMock = jest.fn();
    const onClearMock = jest.fn();
    const onSubmitMock = jest.fn();

    const defaultProps = {
        value: '',
        onChangeText: onChangeTextMock,
        onClear: onClearMock,
        onSubmit: onSubmitMock,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with empty value', () => {
        const { getByPlaceholderText, queryByTestId } = render(<SearchBar {...defaultProps} />);
        // Since the translation mock returns the key, the placeholder is "exploreScreen.searchPlaceholder"
        const input = getByPlaceholderText('exploreScreen.searchPlaceholder');
        expect(input).toBeTruthy();
        // When value is empty, clear button should not appear
        expect(queryByTestId('clear-button')).toBeNull();
    });

    it('calls onChangeText when text is entered', () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
        const input = getByPlaceholderText('exploreScreen.searchPlaceholder');
        fireEvent.changeText(input, 'apple');
        expect(onChangeTextMock).toHaveBeenCalledWith('apple');
    });

    it('shows loading indicator when loading is true', () => {
        const { queryByTestId } = render(<SearchBar {...defaultProps} value="a" loading={true} />);
        // The loading indicator should appear when loading is true
        expect(queryByTestId('loading-indicator')).toBeTruthy();
        // Clear button should not be shown when loading
        expect(queryByTestId('clear-button')).toBeNull();
    });

    it('shows clear button when there is text and not loading', () => {
        const { getByTestId } = render(<SearchBar {...defaultProps} value="apple" loading={false} />);
        // The clear button should appear when there's text and not loading
        expect(getByTestId('clear-button')).toBeTruthy();
    });

    it('calls onClear and resets text when clear button is pressed', () => {
        const onChangeTextMock = jest.fn();
        const onClearMock = jest.fn();

        const { getByTestId } = render(
            <SearchBar
                value="test query"
                onChangeText={onChangeTextMock}
                onClear={onClearMock}
            />
        );

        const clearButton = getByTestId('clear-button');
        fireEvent.press(clearButton);
        expect(onChangeTextMock).toHaveBeenCalledWith('');
        expect(onClearMock).toHaveBeenCalled();
    });

    it('calls onSubmit when submit editing is triggered', () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} value="apple" />);
        const input = getByPlaceholderText('exploreScreen.searchPlaceholder');
        fireEvent(input, 'submitEditing');
        expect(onSubmitMock).toHaveBeenCalled();
    });

    it('handles different input scenarios', () => {
        const { getByPlaceholderText, rerender } = render(
            <SearchBar
                {...defaultProps}
                value=""
            />
        );

        const input = getByPlaceholderText('exploreScreen.searchPlaceholder');

        // Test short input
        fireEvent.changeText(input, 'a');
        expect(onChangeTextMock).toHaveBeenCalledWith('a');

        // Test long input
        rerender(
            <SearchBar
                {...defaultProps}
                value="very long search query with multiple words"
            />
        );
        expect(input.props.value).toBe('very long search query with multiple words');
    });

    it('manages focus and blur states', () => {
        const { getByPlaceholderText } = render(<SearchBar {...defaultProps} />);
        const input = getByPlaceholderText('exploreScreen.searchPlaceholder');

        // Simulate focus
        fireEvent(input, 'focus');

        // Simulate blur
        fireEvent(input, 'blur');
    });
});