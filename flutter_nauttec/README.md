# Nauttec Flutter Mobile App

A comprehensive Flutter mobile application for the Nauttec premium yacht fractional ownership and rental platform. Built with modern Flutter architecture patterns and designed for iOS and Android.

## 🌊 Features

### Core Functionality
- **Phone-based Authentication** - OTP verification system
- **Yacht Fleet Management** - Browse and explore De Antonio yacht models (D23-D60)
- **Booking System** - Complete rental booking lifecycle management
- **Fractional Ownership** - Track and manage yacht ownership shares
- **Fuel Wallet System** - Prepaid fuel credit management with transactions
- **User Profiles** - Visitor, Owner, and Administrator role management

### Technical Features
- **State Management** - Riverpod with code generation
- **Navigation** - GoRouter with stateful shell navigation
- **API Integration** - Complete Django REST API integration
- **Payment Processing** - Stripe integration for payments
- **Offline Support** - Local storage with SharedPreferences
- **Platform Features** - iOS/Android specific optimizations

## 🏗️ Architecture

### Clean Architecture Structure
```
lib/
├── core/                    # Core infrastructure
│   ├── config/             # App configuration
│   ├── router/             # Navigation setup
│   ├── services/           # Core services (API, storage)
│   └── theme/              # UI theme and styling
├── features/               # Feature modules
│   ├── auth/              # Authentication
│   ├── boats/             # Yacht management
│   ├── bookings/          # Rental bookings
│   ├── ownership/         # Fractional ownership
│   ├── fuel_wallet/       # Fuel credit system
│   └── profile/           # User management
└── shared/                # Shared utilities
```

### State Management
- **Riverpod** - Reactive state management
- **Code Generation** - Type-safe providers and models
- **Freezed** - Immutable data classes
- **JSON Serialization** - Automatic API model generation

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.16.0 or higher
- Dart SDK 3.0.0 or higher
- iOS 12.0+ / Android 7.0+ (API 24+)

### Installation

1. **Clone and setup**:
   ```bash
   cd flutter_nauttec
   flutter pub get
   ```

2. **Generate code**:
   ```bash
   flutter packages pub run build_runner build
   ```

3. **Configure API endpoint**:
   Update `lib/core/config/app_config.dart`:
   ```dart
   static const String baseUrl = 'https://your-django-api.com';
   ```

4. **Add Stripe keys**:
   Update the Stripe publishable key in `app_config.dart`

5. **Run the app**:
   ```bash
   flutter run
   ```

## 📱 Platform Setup

### iOS Setup
1. Open `ios/Runner.xcworkspace` in Xcode
2. Update bundle identifier and signing
3. Configure capabilities for camera, location if needed
4. Build and test on device/simulator

### Android Setup
1. Update `android/app/build.gradle` with your app details
2. Configure signing in `android/app/build.gradle`
3. Update package name in `AndroidManifest.xml`
4. Build APK: `flutter build apk`

## 🔧 Configuration

### API Configuration
The app connects to your Django backend. Update these endpoints in `app_config.dart`:

```dart
// Authentication
static const String authRegisterEndpoint = '/auth/register/';
static const String authSendOtpEndpoint = '/auth/send-otp/';

// Boats & Bookings
static const String boatsEndpoint = '/boats/';
static const String bookingsEndpoint = '/bookings/';

// Ownership & Fuel Wallet
static const String ownershipEndpoint = '/ownership/';
static const String fuelWalletEndpoint = '/fuel-wallet/';
```

### Theme Customization
Ocean-themed design matching your web platform:
- Primary color: `#2563EB` (Ocean Blue)
- SF Pro font family
- iOS-native styling patterns
- Responsive design for all screen sizes

## 🧪 Development

### Code Generation
```bash
# Watch for changes and auto-generate
flutter packages pub run build_runner watch

# One-time generation
flutter packages pub run build_runner build --delete-conflicting-outputs
```

### Testing
```bash
# Run all tests
flutter test

# Run integration tests
flutter test integration_test/
```

### Build for Production
```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release
```

## 📦 Dependencies

### Core Dependencies
- `flutter_riverpod` - State management
- `go_router` - Navigation
- `dio` - HTTP client
- `freezed` - Immutable classes
- `json_annotation` - JSON serialization

### UI Dependencies
- `country_code_picker` - Phone number input
- `pinput` - OTP input widget
- `cached_network_image` - Image caching
- `shimmer` - Loading animations

### Platform Dependencies
- `flutter_secure_storage` - Secure key storage
- `shared_preferences` - Local preferences
- `url_launcher` - Deep links and external URLs
- `permission_handler` - Device permissions

## 🔐 Security

- **Secure Storage** - Sensitive data encrypted locally
- **API Token Management** - Automatic token refresh
- **Input Validation** - Client and server-side validation
- **Deep Link Security** - Validated navigation parameters

## 📊 Features by User Role

### Visitors
- Browse yacht fleet
- View yacht details and specifications
- Create rental bookings
- Basic profile management

### Owners
- All visitor features
- Fractional ownership dashboard
- Usage quota tracking
- Fuel wallet management
- Booking priority access

### Administrators
- All user features
- Fleet management tools
- Booking administration
- User management dashboard
- System health monitoring

## 🛠️ Customization

### Adding New Features
1. Create feature module in `lib/features/`
2. Implement models, services, and providers
3. Add UI pages and widgets
4. Update navigation in `app_router.dart`
5. Add tests and documentation

### Styling Updates
- Update colors in `lib/core/theme/app_colors.dart`
- Modify typography in `lib/core/theme/app_text_styles.dart`
- Customize theme in `lib/core/theme/app_theme.dart`

## 🚢 Integration with Django Backend

This Flutter app is designed to work seamlessly with your Nauttec Django backend:

- **Authentication** - Phone-based OTP system
- **Real-time Data** - Live yacht availability and booking updates
- **Payment Processing** - Integrated Stripe payment flows
- **Push Notifications** - Firebase messaging (ready to implement)
- **File Uploads** - Image handling for profiles and documentation

## 📋 Production Checklist

- [ ] Update API base URL for production
- [ ] Configure Stripe live keys
- [ ] Set up proper app signing
- [ ] Test on physical devices
- [ ] Configure push notifications
- [ ] Set up app store metadata
- [ ] Implement crash reporting
- [ ] Add analytics tracking

## 🤝 Support

For technical support or questions about the Nauttec Flutter app:
- Review the Django backend API documentation
- Check the Flutter documentation for platform-specific issues
- Ensure proper network connectivity to your Django API

---

**Built with Flutter for the Nauttec Premium Yacht Platform**
*Designed for luxury yacht enthusiasts and fractional ownership investors*