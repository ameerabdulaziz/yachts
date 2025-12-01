# Nauttec - De Antonio Yachts Mobile App

A complete Flutter mobile application for the Nauttec yacht platform featuring all four access modalities (OWN, EARN, CO-OWN, INVEST), yacht browsing, charter booking, and investment opportunities.

## Features

- **Home Screen**: Welcome dashboard with modality cards and featured yachts
- **Charter Screen**: Browse and book De Antonio yachts for charter with filters
- **Invest Screen**: Investment tiers and available yacht investment opportunities
- **Ownership Screen**: Explore OWN, EARN, and CO-OWN modalities
- **Profile Screen**: User account management and settings
- **Yacht Details**: Full yacht specifications and access options
- **Onboarding**: Beautiful introduction to the platform

## De Antonio Yacht Fleet

- D29 (7.99m) - €213,750 - Ibiza, Spain
- D32 (9.9m) - €309,000 - Miami, Florida
- D36 (10.4m) - €426,000 - Sydney, Australia
- D42 (11.4m) - €650,000 - Monaco, Mediterranean
- D50 (12.65m) - €950,000 - Fort Lauderdale, Florida
- D60 (18.5m) - €2,000,000 - Saint-Tropez, France

## Four Access Modalities

1. **OWN**: Full ownership with flexible financing (25% down payment)
2. **EARN**: Charter & earn with 6-18% projected annual yield
3. **CO-OWN**: Fractional ownership (1/5 share, 73 days/year)
4. **INVEST**: Pure investment with 8-15% projected yields

## Getting Started

### Prerequisites

- Flutter SDK 3.0.0 or higher
- Dart SDK 3.0.0 or higher

### Installation

1. Extract the flutter_app directory
2. Run `flutter pub get` to install dependencies
3. Run `flutter run` to start the app

### Build APK

```bash
flutter build apk --release
```

### Build iOS

```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── models/                # Data models
│   ├── yacht.dart
│   └── modality.dart
├── providers/             # Riverpod providers
│   └── yacht_provider.dart
├── routes/                # GoRouter configuration
│   └── app_router.dart
├── screens/               # All app screens
│   ├── home_screen.dart
│   ├── charter_screen.dart
│   ├── invest_screen.dart
│   ├── ownership_screen.dart
│   ├── profile_screen.dart
│   ├── yacht_detail_screen.dart
│   ├── onboarding_screen.dart
│   ├── modality_detail_screen.dart
│   └── main_shell.dart
├── theme/                 # App theming
│   └── app_theme.dart
├── utils/                 # Utility functions
│   └── formatters.dart
└── widgets/               # Reusable widgets
    └── yacht_card.dart
```

## Tech Stack

- Flutter 3.x
- Riverpod for state management
- GoRouter for navigation
- Google Fonts for typography
- Cached Network Image for image caching

## Brand Colors

- Primary Blue: #2563EB
- Secondary (Blue Zodiac): #0E2047
- Accent (Cyan): #06B6D4
- Success (Green): #16A34A
- Warning (Amber): #F59E0B

## License

Copyright © 2025 Nauttec. All rights reserved.
