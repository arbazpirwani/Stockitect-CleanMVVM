module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/features/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@viewmodels/(.*)$': '<rootDir>/src/viewmodels/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@react-native-community/netinfo$': '<rootDir>/__mocks__/@react-native-community/netinfo.ts'

  },
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|@react-native-community/netinfo)/)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/types/**',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage'
};
