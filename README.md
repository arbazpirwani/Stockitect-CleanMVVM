# StockitectCleanMVVM

A stock market app built using React Native with a clean MVVM architecture. This application displays stocks listed on the Nasdaq exchange, allows users to search for specific stocks, and caches API responses to reduce redundant requests. The project emphasizes scalability, maintainability, and a clear separation of concerns.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Screenshots & Demo](#screenshots--demo)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture Overview

The project follows a structured and scalable architecture:

- **MVVM Pattern:**  
  - **ViewModels:** Encapsulate business logic and state (e.g., `ExploreViewModel`, `LanguageViewModel`).  
  - **Views:** React Native components (e.g., `SplashScreen`, `ExploreScreen`, `LanguageSelectionScreen`) that observe ViewModel state.

- **Repository Pattern:**  
  - **Repositories:** Abstract data sources and handle API interactions and caching (e.g., `StocksRepository`).

- **Utilities & Helpers:**  
  - Contains common helper functions and caching utilities.

- **Navigation:**  
  - Utilizes React Navigation for managing screen transitions.

- **Configuration & Aliases:**  
  - Custom Babel and TypeScript configurations with path aliases are used for cleaner and more maintainable imports.

---

## Features

- **Splash Screen:**  
  - Displays the Nasdaq logo and developer credit.
  - Automatically navigates to the language selection screen after a short delay.

- **Language Selection:**  
  - Supports multiple languages (English and Arabic).
  - Implements RTL support for Arabic (layout flips appropriately).

- **Explore Screen:**  
  - Lists stocks on the Nasdaq exchange, displaying tickers and company names.
  - Provides live search functionality that updates as the user types.
  - Supports pull-to-refresh and infinite scrolling.

- **Caching:**  
  - Caches API responses to minimize redundant requests.

- **Error Handling:**  
  - Displays error messages with a retry option when API calls fail.

---

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd StockitectCleanMVVM

2. **Install Dependencies:**

   Use npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**

    - Copy the example environment file:

      ```bash
      cp .env.example .env
      ```

    - Open `.env` and insert your API key:

      ```
      POLYGON_API_KEY=your_polygon_api_key_here
      ```

4. **Verify Path Aliases:**

   The project uses path aliases defined in `tsconfig.json` and `babel.config.js`. These aliases include:
    - `@/` → `src/`
    - `@components/` → `src/components/`
    - `@screens/splash/` → `src/features/splash/screens/`
    - `@screens/language/` → `src/features/language/screens/`
    - `@screens/stocks/` → `src/features/stocks/screens/`
    - `@repositories/` → `src/repositories/`
    - `@viewmodels/` → `src/viewmodels/`
    - `@api/` → `src/api/`
    - `@utils/` → `src/utils/`
    - `@appTypes/` → `src/types/`
    - `@theme/` → `src/theme/`
    - `@navigation/` → `src/navigation/`
    - `@i18n/` → `src/i18n/`
    - `@assets/` → `assets/`

   Ensure your file imports use these aliases for consistency.

---

## Running the Project

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

### Start the Metro Bundler

```bash
npm start
```

---

## Testing

Unit tests are written using Jest and React Native Testing Library. To run tests:

```bash
npm test
```

Tests cover components, viewmodels, repositories, and caching utilities.

---

## Screenshots & Demo

### Screenshots

<p align="center">
  <img src="./assets/screenshots/splash-screen.jpg" width="300" alt="Splash Screen" />
  <img src="./assets/screenshots/explore-screen.jpg" width="300" alt="Explore Screen" />
  <img src="./assets/screenshots/language-selection.jpg" width="300" alt="Language Selection" />
</p>

### Demo

<p align="center">
  <img src="./assets/demo/demo.gif" width="600" alt="Demo GIF" />
</p>


---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Follow the existing coding style and add tests for any new features.
