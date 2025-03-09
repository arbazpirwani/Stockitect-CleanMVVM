import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { colors } from '@/theme';
import { I18nProvider } from '@/providers/I18nProvider';

/**
 * Main App component
 *
 * Entry point for the application that sets up the navigation structure,
 * initializes i18n for localization, and global components like StatusBar.
 */
const App: React.FC = () => {
    return (
        <I18nProvider>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />
            <AppNavigator />
        </I18nProvider>
    );
};

export default App;