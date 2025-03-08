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
-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   77.12 |    65.16 |   73.97 |   77.29 |                  
 src/api                       |   76.47 |    80.00 |   75.00 |   80.00 |                  
  apiClient.ts                 |   76.47 |    80.00 |   75.00 |   80.00 | 25-27            
 src/api/polygon               |   70.00 |    50.00 |  100.00 |   69.23 |                  
  stocksApi.ts                 |   70.00 |    50.00 |  100.00 |   69.23 | 22-49,81-84,149  
 src/components/atoms          |   73.33 |    76.19 |  100.00 |   73.33 |                  
  Button.tsx                   |   73.33 |    76.19 |  100.00 |   73.33 | 79,83,95,99      
 src/components/molecules      |   92.00 |    88.23 |   75.00 |   92.00 |                  
  SearchBar.tsx                |   85.71 |    85.71 |   60.00 |   85.71 | 100-101          
  StockListItem.tsx            |  100.00 |    87.50 |  100.00 |  100.00 | 59               
 src/repositories              |   93.10 |    84.00 |  100.00 |   93.10 |                  
  StocksRepository.ts          |   93.10 |    84.00 |  100.00 |   93.10 | 88,102           
 src/viewmodels                |   80.68 |    78.94 |   90.90 |   80.68 |                  
  ExploreViewModel.ts          |   79.71 |    80.00 |   88.88 |   79.71 | 53-54,66,86-87,103,111-114,128,143-145
  LanguageViewModel.ts         |   84.21 |    75.00 |  100.00 |   84.21 | 22-23,46         
-------------------------------|---------|----------|---------|---------|-------------------
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