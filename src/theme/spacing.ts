/**
 * Spacing system for consistent layout throughout the app
 * Using a 4-point grid system
 */
export const spacing = {
  xs: 4,    // Extra small spacing
  s: 8,     // Small spacing
  m: 16,    // Medium spacing
  l: 24,    // Large spacing
  xl: 32,   // Extra large spacing
  xxl: 48,  // Extra extra large spacing
};

/**
 * Border radius values for consistent component styling
 */
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  round: 9999, // For circular elements
};

/**
 * Shadow styles for elevation effects
 * Compatible with both iOS and Android
 */
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};