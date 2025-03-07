module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/features',
          '@hooks': './src/hooks',
          '@api': './src/api',
          '@utils': './src/utils',
          '@types': './src/types',
          '@theme': './src/theme',
          '@navigation': './src/navigation',
          '@i18n': './src/i18n'
        }
      }
    ]
  ],
};