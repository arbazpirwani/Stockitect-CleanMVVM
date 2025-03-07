import React from 'react';
import { render, fireEvent } from '../utils/test-utils';
import { Button } from '@/components/atoms/Button';

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
        const { queryByText, toJSON } = render(
            <Button title="Loading Button" onPress={() => {}} loading={true} />
        );

        expect(queryByText('Loading Button')).toBeNull();
        const json = toJSON();
        expect(json).toMatchSnapshot();
    });

    it('is disabled when disabled prop is true', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <Button title="Disabled Button" onPress={onPressMock} disabled={true} />
        );

        fireEvent.press(getByText('Disabled Button'));
        expect(onPressMock).not.toHaveBeenCalled();
    });
});