import { TextStyle } from 'react-native';

/**
 * Typography styles for consistent text appearance throughout the app
 */
export type TypographyStyles = {
  headline: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  button: TextStyle;
};

export const typography: TypographyStyles = {
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
};