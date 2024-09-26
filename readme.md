# News Feed App

A React Native application that displays a news feed in the form of short cards, allowing users to swipe through articles related to Hyderabad.

## Prerequisites

- Node.js (v18.17.0)
- React Native (v18.2.0)
- Expo CLI

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/vishwajithBarad1/newsFeedApp.git
   cd news-feed-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm run web
   ```

## Usage

The main feature of this app is to show users a news feed in the form of short cards. Users can swipe through articles and view details about each one.

To use the app:

1. Launch the expo app on your device.
2. Scan the QR code then app launches 
3. Swipe right to unlock the content.
4. Browse through articles using the "Prev" and "Next" buttons.

Note: The app currently uses an open API key. For production use, it's recommended to replace this with your own API key from [News API](https://newsapi.org/).

## Architecture Overview

The app is built using React Native and Expo. Key components and libraries used include:

- React hooks (`useState`, `useEffect`, `useRef`) for state management and side effects
- React Native's `Animated` and `PanResponder` for gesture handling and animations
- Expo's `SplashScreen` for managing the splash screen
- `fetch` API for data fetching from the News API

The main components of the app are:

- Loading screen
- Swipe-to-unlock mechanism
- Article display with image, title, and description
- Navigation buttons for browsing articles

## Testing

Currently, there are no testing frameworks included in this project.

## License

This project is licensed under the MIT License.
