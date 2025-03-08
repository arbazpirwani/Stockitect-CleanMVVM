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

## 📱 Screenshots & Demo

### Screenshots

<p align="center">
  <img src="./assets/screenshots/splash-screen.jpg" width="200" alt="Splash Screen" />
  <img src="./assets/screenshots/language-selection.jpg" width="200" alt="Language Selection" />
  <img src="./assets/screenshots/explore-screen.jpg" width="200" alt="Explore Screen" />
</p>

### Demo
<p align="center"> <img src="./assets/demo/demo.gif" width="200" alt="Demo GIF" /> </p>

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

The project includes comprehensive unit tests to ensure reliability. Run the test suite with:

```bash
npm test
```

Test coverage report:
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   76.62 |    60.95 |   74.28 |   76.87 |
 api                  |   77.77 |    80.00 |     75  |   81.25 |
  stocksApi.ts        |   65.38 |    31.25 |    100  |   65.38 | 
 components           |   73.33 |    76.19 |    100  |   73.33 |
  Button.tsx          |   94.7  |    87.50 |    100  |   94.74 | 88
  SearchBar.tsx       |   83.3  |    77.78 |     75  |   83.33 | 49,69-72
 repositories         |    92   |    81.25 |    100  |    92   |
  StocksRepository.ts |    92   |    81.25 |    100  |    92   | 
 viewmodels           |   80.82 |    78.57 |     90  |   80.82 |
  ExploreViewModel.ts |   87.5  |    81.82 |     80  |   87.5  | 84,96-98,121-123
  LanguageViewModel.ts|   85.71 |       80 |   66.67 |   85.71 | 32-35
----------------------|---------|----------|---------|---------|-------------------
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