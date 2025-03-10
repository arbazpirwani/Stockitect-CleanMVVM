import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '@/navigation/types';
import { colors, typography, spacing } from '@/theme';
import { TIMING, DIMENSIONS } from '@/constants';
import { hasLanguageBeenSelected } from '@/i18n';

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
 * Automatically navigates to the LanguageSelection screen or Explore screen after a delay.
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();

    useEffect(() => {
        // Navigate to the appropriate screen after a delay
        const timer = setTimeout(async () => {
            // Check if the user has previously selected a language
            const languageSelected = await hasLanguageBeenSelected();

            if (languageSelected) {
                // If language already selected, go straight to Explore screen
                navigation.replace('Explore');
            } else {
                // Otherwise, go to language selection
                navigation.replace('LanguageSelection');
            }
        }, TIMING.SPLASH_SCREEN_DURATION);

        // Clear the timeout when the component unmounts
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/images/nasdaq-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.developerName}>{t('developerCredit')}</Text>
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
        width: DIMENSIONS.LOGO_WIDTH,
        height: DIMENSIONS.LOGO_HEIGHT,
    },
    developerName: {
        position: 'absolute',
        bottom: spacing.xl,
        ...typography.caption,
        color: colors.text.secondary,
    },
});