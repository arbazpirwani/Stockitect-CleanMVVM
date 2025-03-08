import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/atoms/Button';
import { ActivityIndicator } from 'react-native';

describe('Button component', () => {
    it('renders correctly with title', () => {
        const { getByText } = render(
            <Button title="Test Button" onPress={() => {}} />
        );
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Pressable Button" onPress={onPressMock} />
        );
        fireEvent.press(getByText('Pressable Button'));
        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('shows loading indicator when loading prop is true', () => {
        const { queryByText, UNSAFE_getByType } = render(
            <Button title="Loading Button" onPress={() => {}} loading={true} />
        );

        // Check that the title is not visible
        expect(queryByText('Loading Button')).toBeNull();

        // Check that the ActivityIndicator is rendered
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('is disabled when disabled prop is true', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Disabled Button" onPress={onPressMock} disabled={true} />
        );

        fireEvent.press(getByText('Disabled Button'));
        expect(onPressMock).not.toHaveBeenCalled();
    });

    it('renders with different button variants', () => {
        const { getByText, rerender } = render(
            <Button title="Primary Button" onPress={() => {}} variant="primary" />
        );
        expect(getByText('Primary Button')).toBeTruthy();

        rerender(
            <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
        );
        expect(getByText('Secondary Button')).toBeTruthy();

        rerender(
            <Button title="Outline Button" onPress={() => {}} variant="outline" />
        );
        expect(getByText('Outline Button')).toBeTruthy();
    });

    it('handles custom styling', () => {
        const customStyle = { backgroundColor: 'red' };
        const customTextStyle = { color: 'blue' };

        const { getByText } = render(
            <Button
                title="Custom Styled Button"
                onPress={() => {}}
                style={customStyle}
                textStyle={customTextStyle}
            />
        );

        expect(getByText('Custom Styled Button')).toBeTruthy();
    });

    it('prevents multiple press when loading', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button
                title="Loading Button"
                onPress={onPressMock}
                loading={true}
            />
        );

        // When loading, the button should not display its title
        const loadingButton = () => getByText('Loading Button');
        expect(() => loadingButton()).toThrow();
    });

    it('handles custom styling', () => {
        const customStyle = { backgroundColor: 'red' };
        const customTextStyle = { color: 'blue' };

        const { getByText } = render(
            <Button
                title="Custom Styled Button"
                onPress={() => {}}
                style={customStyle}
                textStyle={customTextStyle}
            />
        );

        const button = getByText('Custom Styled Button');
        expect(button).toBeTruthy();
    });
});