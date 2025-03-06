import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { colors } from './theme';

/**
 * Main App component
 *
 * Entry point for the application that sets up the navigation structure
 * and global components like StatusBar.
 */
const App: React.FC = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />
            <AppNavigator />
        </>
    );
};

export default App;