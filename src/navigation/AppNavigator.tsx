import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '@screens/splash/SplashScreen';
import { LanguageSelectionScreen } from '@screens/language/LanguageSelectionScreen';
import { ExploreScreen } from '@screens/stocks/ExploreScreen';
import { RootStackParamList } from './types';

/**
 * Main stack navigator for the application
 */
const Stack = createStackNavigator<RootStackParamList>();

/**
 * AppNavigator component
 *
 * Defines the main navigation structure of the application.
 */
export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
                <Stack.Screen name="Explore" component={ExploreScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};