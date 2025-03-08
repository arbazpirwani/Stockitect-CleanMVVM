import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorView } from '@/components/molecules/ErrorView';

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(() => ({
        t: (key: string) => key
    })),
}));

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

    // New tests start here
    it('handles very long error messages', () => {
        const longErrorMessage = 'A'.repeat(500);
        const { getByText } = render(
            <ErrorView
                message={longErrorMessage}
                onRetry={onRetryMock}
            />
        );

        expect(getByText(longErrorMessage)).toBeTruthy();
    });

    it('renders with different message configurations', () => {
        const { getByText, rerender } = render(
            <ErrorView
                message="Short error"
                onRetry={onRetryMock}
            />
        );

        // Rerender with a different message
        rerender(
            <ErrorView
                message="Another error message"
                onRetry={onRetryMock}
                title="Different Error"
            />
        );

        expect(getByText('Another error message')).toBeTruthy();
        expect(getByText('Different Error')).toBeTruthy();
    });

    it('handles multiple retry attempts', () => {
        const { getByText } = render(
            <ErrorView
                message={errorMessage}
                onRetry={onRetryMock}
            />
        );

        const retryButton = getByText('exploreScreen.retryButton');

        // Press retry multiple times
        fireEvent.press(retryButton);
        fireEvent.press(retryButton);
        fireEvent.press(retryButton);

        expect(onRetryMock).toHaveBeenCalledTimes(3);
    });
});