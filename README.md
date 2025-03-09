# Stockitect-CleanMVVM

<p align="center">
  <img src="./assets/images/nasdaq-logo.png" height="80" alt="Nasdaq Logo"/>
</p>

A modern React Native mobile application for browsing stocks listed on the Nasdaq exchange. Built with clean
architecture principles (MVVM), TypeScript, and industry best practices.

## 🏗️ Architecture

This project follows the MVVM (Model-View-ViewModel) architecture pattern for clear separation of concerns:

```
src/
├── api/         # API clients and data fetching
├── components/  # UI components (atoms, molecules)
├── constants/   # App-wide constants and configuration
├── features/    # Feature-specific screens
├── i18n/        # Internationalization
├── navigation/  # Navigation configuration
├── providers/   # Context providers (i18n, etc.)
├── repositories/# Data repositories (bridge between API and ViewModels)
├── theme/       # Styling system
├── types/       # TypeScript type definitions
├── utils/       # Helper utilities
└── viewmodels/  # Business logic and state management
```

## ✨ Features

- **Multi-language Support** - English and Arabic with RTL layout support
- **Stock Exploration** - Browse stocks listed on the Nasdaq exchange
- **Real-time Search** - Search stocks by ticker or company name
- **Error Handling** - Graceful error handling with retry options
- **Clean UI** - Modern, responsive interface following design best practices
- **Caching** - Smart caching system to reduce redundant API calls
- **Offline Support** - Basic functionality when offline via cache
- **Optimized Performance** - FlatList optimizations for smooth scrolling

## 📱Demo

<div align="center">
    <img src="./assets/demo/demo1.gif" width="250" alt="Demo GIF 1" style="margin: 0 16px" /> 
    <img src="./assets/demo/demo2.gif" width="250" alt="Demo GIF 2" style="margin: 0 16px" /> 
    <img src="./assets/demo/demo3.gif" width="250" alt="Demo GIF 3" style="margin: 0 16px" /> 
</div>

## 🛠️ Tech Stack

- **React Native** - Core framework
- **TypeScript** - Type safety and better developer experience
- **MVVM Architecture** - Clean separation of concerns
- **Jest & Testing Library** - Comprehensive unit testing
- **React Navigation** - Navigation between screens
- **i18next** - Internationalization
- **Axios** - API requests with interceptors for clean error handling
- **AsyncStorage** - Local data persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- React Native CLI
- Android Studio / Xcode

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Stockitect-CleanMVVM.git
   cd Stockitect-CleanMVVM
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install --legacy-peer-deps
   ```

   > **Note:** This project uses the latest React 19 with React Native 0.78, which requires using the legacy peer deps
   flag during installation.

3. Set up your Polygon.io API key:
    - Copy `.env.example` to `.env`
    - Add your API key to the `.env` file:
      ```
      POLYGON_API_KEY=your_api_key_here
      ```

### Running the App

#### iOS

```bash
npm run ios
# or
npx react-native run-ios
```

#### Android

```bash
npm run android
# or
npx react-native run-android
```

## 🧪 Testing

### Test Statistics

- **Total Test Files**: 22
- **Passing Tests**: ✅ All passing

| Metric             | Count   |
|--------------------|---------|
| Total Tests        | 158     |
| Passed Tests       | 158     |
| Obsolete Snapshots | 1       |
| Test Duration      | 1.684 s |

### Coverage Summary

| Module                       | Statements | Branch | Functions | Lines  | Key Uncovered Lines                |
|------------------------------|------------|--------|-----------|--------|------------------------------------|
| **Overall**                  | 88.91%     | 82.83% | 87.38%    | 89.10% | -                                  |
| **Core Components**          | 100%       | 100%   | 100%      | 100%   | -                                  |
| **API Client**               | 76.47%     | 90.00% | 75.00%    | 80.00% | 25-27                              |
| **Stocks Repository**        | 86.04%     | 80.00% | 100%      | 86.04% | 59, 116, 122, 139                  |
| **Network Provider** *(new)* | 93.54%     | 71.42% | 100%      | 93.33% | 53-54                              |
| **Language Selection**       | 90.00%     | 50.00% | 80.00%    | 90.00% | 77-79, 85-86                       |
| **Explore Screen**           | 65.11%     | 65.90% | 63.63%    | 65.85% | 77-78, 84-87, 122-125, 171-179     |
| **ViewModels**               | 90.62%     | 92.30% | 100%      | 90.62% | -                                  |
| **Internationalization**     | 63.33%     | 33.33% | 60.00%    | 63.33% | 28-29, 38-39, 50, 55, 77-79, 85-86 |

### Detailed Coverage Insights

- **Highest Coverage:**
    - Core Components: 100%
    - Network Provider: 93.54%
    - Language Selection: 90.00%
    - Stocks Repository: 86.04%

- **Areas for Improvement:**
    - Internationalization: 63.33%
    - Explore Screen: 65.11%
    - API Client: 76.47%
    

### Running Tests

```bash
# Run all tests
npm test
```

## 🧰 Project Structure

- **Atomic Design Pattern** - Components organized as atoms, molecules, and organisms
- **Feature-based Organization** - Code organized by feature rather than by type
- **Dependency Injection** - Using dependency inversion for testable code
- **Repository Pattern** - Abstracting data sources
- **Provider Pattern** - Context providers for shared state and services

## 🌐 API Integration

This app uses the [Polygon.io](https://polygon.io/) API to fetch stock data. The integration is built to be:

- **Resilient** - Handles rate limiting and network errors
- **Efficient** - Implements caching to reduce API calls
- **Testable** - Mocked in tests for reliable testing

## 📚 Internationalization

The app supports multiple languages with full RTL support:

- English (LTR)
- Arabic (RTL)

All text is managed through i18n translation files for easy expansion to other languages.

## 🔄 State Management

State management follows MVVM principles with:

- **ViewModels** - Encapsulate business logic and state
- **Repositories** - Handle data access
- **Unidirectional Data Flow** - Clear and predictable state updates

## 🤝 Contributing

Feel free to contribute to this project. Please follow the existing code style and add appropriate tests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- [Polygon.io](https://polygon.io/) for the stock market API
- [React Native](https://reactnative.dev/) team for the amazing framework
- [Nasdaq](https://www.nasdaq.com/) for providing stock data