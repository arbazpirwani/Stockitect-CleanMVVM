# Stockitect-CleanMVVM

<p align="center">
  <img src="./assets/images/nasdaq-logo.png" height="80" alt="Nasdaq Logo"/>
</p>

A modern React Native mobile application for browsing stocks listed on the Nasdaq exchange. Built with clean architecture principles (MVVM), TypeScript, and industry best practices.

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
   npm install
   # or
   yarn install
   ```

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

- **Test Suites**: 17 passed (17 total)
- **Total Tests**: 128 passed (128 total)
- **Total Test Time**: 2.263 seconds

### Test Coverage

| Module                      | Statements | Branch    | Functions | Lines     | Key Uncovered Lines |
|:----------------------------|:----------:|:---------:|:---------:|:----------:|:-------------------:|
| **Overall**                 |   88.64%   |   84.23%  |   84.69%  |   88.88%   |         -           |
| **Core App**                |   100%     |   100%    |   100%    |   100%     |         -           |
| **API Modules**             |   76.47%   |   90.00%  |   75.00%  |   80.00%   |      25-27          |
| **Polygon API**             |   95.00%   |   85.71%  |   100%    |   94.87%   |    35, 166          |
| **Components - Atoms**      |   86.66%   |   85.71%  |   100%    |   86.66%   |    83, 99           |
| **Components - Molecules**  |   92.75%   |   96.47%  |   80.76%  |   92.53%   |         -           |
| **Repositories**            |   93.75%   |   86.20%  |   100%    |   93.75%   |    106, 120         |
| **ViewModels**              |   87.15%   |   84.21%  |   88.88%  |   87.15%   |      Various        |
| **Screens**                 |   72.72%   |   68.42%  |   70.00%  |   74.19%   |    72-73, 181-184   |
| **i18n**                    |   63.33%   |   33.33%  |   60.00%  |   63.33%   |    28-29, 38-39     |

### Detailed Coverage Insights

- **Highest Coverage**:
   - Core App Modules (100%)
   - Repositories (93.75%)
   - Components - Molecules (92.75%)

- **Areas for Improvement**:
   - i18n Translations (0% coverage)
   - Screens Module (72.72% coverage)
   - Some i18n Modules (63.33% coverage)

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