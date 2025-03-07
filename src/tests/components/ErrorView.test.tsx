import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorView } from '@/components/molecules/ErrorView';

describe('ErrorView', () => {
    const onRetryMock = jest.fn();
    const errorMessage = 'Test error message';
    const errorTitle = 'Test error title';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders error message and title when provided', () => {
        const { getByText } = render(
            <ErrorView message={errorMessage} onRetry={onRetryMock} title={errorTitle} />
        );
        expect(getByText(errorTitle)).toBeTruthy();
        expect(getByText(errorMessage)).toBeTruthy();
        // Since the translation mock returns the key, the button's title will be "exploreScreen.retryButton"
        expect(getByText('exploreScreen.retryButton')).toBeTruthy();
    });

    it('renders without title when not provided', () => {
        const { queryByText, getByText } = render(
            <ErrorView message={errorMessage} onRetry={onRetryMock} />
        );
        expect(queryByText(errorTitle)).toBeNull();
        expect(getByText(errorMessage)).toBeTruthy();
        expect(getByText('exploreScreen.retryButton')).toBeTruthy();
    });

    it('calls onRetry when retry button is pressed', () => {
        const { getByText } = render(
            <ErrorView message={errorMessage} onRetry={onRetryMock} title={errorTitle} />
        );
        const retryButton = getByText('exploreScreen.retryButton');
        fireEvent.press(retryButton);
        expect(onRetryMock).toHaveBeenCalledTimes(1);
    });
});
