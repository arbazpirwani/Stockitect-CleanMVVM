import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { colors, typography, spacing } from '../../../theme';

/**
 * Props for the SplashScreen component
 */
type SplashScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

/**
 * SplashScreen component
 *
 * Displays the app's splash screen with the Nasdaq logo and developer name.
 * Automatically navigates to the LanguageSelection screen after a delay.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    useEffect(() => {
        // Navigate to the LanguageSelection screen after a delay
        const timer = setTimeout(() => {
            navigation.replace('LanguageSelection');
        }, 2000);

        // Clear the timeout when the component unmounts
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/images/nasdaq-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.developerName}>Developed by Arbaz Pirwani</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    logo: {
        width: 200,
        height: 100,
    },
    developerName: {
        position: 'absolute',
        bottom: spacing.xl,
        ...typography.caption,
        color: colors.text.secondary,
    },
});