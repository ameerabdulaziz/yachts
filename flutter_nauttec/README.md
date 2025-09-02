# Nauttec Flutter Mobile App

A premium Flutter mobile application for yacht fractional ownership and rental platform, featuring modern architecture and seamless integration with Django backend.

## 🎯 Features

### Authentication & User Management
- **Phone-based OTP Authentication** - Secure login with SMS verification
- **User Registration** - Multi-role account creation (Visitor/Owner/Administrator)
- **Profile Management** - User profile editing and role-based access
- **Secure Storage** - Token management with flutter_secure_storage

### Core Yacht Platform Features
- **Yacht Fleet Browser** - Browse De Antonio yacht models D23-D60
- **Boat Details** - Comprehensive yacht specifications and features
- **Booking System** - Complete rental booking flow with calendar integration
- **Fractional Ownership** - Share tracking and ownership management
- **Fuel Wallet** - Prepaid fuel credit system with transaction history

### Modern Mobile Experience
- **Ocean-themed UI** - Custom design with #2563EB primary color
- **Bottom Navigation** - 5 main sections with smooth transitions
- **Pull-to-refresh** - Data synchronization across all screens
- **Offline Support** - Local data caching with automatic sync
- **iOS/Android** - Native styling for both platforms

## 🏗️ Architecture

### Clean Architecture Structure
```
lib/
├── core/                    # Core infrastructure
│   ├── config/             # App configuration & API endpoints
│   ├── router/             # GoRouter navigation setup
│   ├── services/           # API service and HTTP client
│   └── theme/              # Ocean-themed UI styling
│
├── features/               # Feature modules
│   ├── auth/              # Authentication flow
│   │   ├── models/        # User models and auth state
│   │   ├── services/      # Auth API service
│   │   ├── providers/     # Riverpod state management
│   │   └── presentation/  # Login, register, OTP pages
│   │
│   ├── boats/             # Yacht management
│   ├── bookings/          # Rental booking system
│   ├── ownership/         # Fractional ownership
│   ├── fuel_wallet/       # Fuel credit system
│   └── profile/           # User profile management
│
└── shared/                # Shared utilities and widgets
```

### State Management
- **Riverpod 2.5.1** - Modern reactive state management
- **Code Generation** - Automatic provider and model generation
- **Freezed** - Immutable data classes with unions
- **JSON Serialization** - Automatic API model conversion

### Navigation
- **GoRouter 14.6.1** - Declarative routing with type safety
- **Stateful Shell** - Bottom navigation with nested routes
- **Deep Linking** - External app integration support
- **Route Guards** - Authentication-based access control

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.16.0+
- Dart SDK 3.2.0+
- iOS 12.0+ / Android 7.0+ (API 24+)
- Xcode 14+ (for iOS development)
- Android Studio / VS Code

### Installation

1. **Extract and navigate**:
   ```bash
   tar -xzf nauttec_flutter_complete.tar.gz
   cd flutter_nauttec
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Generate code** (required for Riverpod/Freezed):
   ```bash
   flutter packages pub run build_runner build --delete-conflicting-outputs
   ```

4. **Configure API connection**:
   Edit `lib/core/config/app_config.dart`:
   ```dart
   static const String baseUrl = 'http://your-django-server.com';
   static const String stripePublishableKey = 'pk_live_...';
   ```

5. **Run the app**:
   ```bash
   flutter run
   ```

## 📱 Platform Configuration

### iOS Setup
1. Open `ios/Runner.xcworkspace` in Xcode
2. Update bundle identifier: `com.nauttec.app`
3. Configure signing and provisioning profile
4. Update `ios/Runner/Info.plist` with required permissions
5. Test on iOS Simulator or device

### Android Setup
1. Update package name in `android/app/build.gradle`
2. Configure app signing for release builds
3. Update `android/app/src/main/AndroidManifest.xml`
4. Build APK: `flutter build apk --release`
5. Test on Android emulator or device

## 🔧 Configuration

### Django Backend Integration
The app is pre-configured for these Django API endpoints:

```dart
// Authentication
static const String authRegisterEndpoint = '/auth/register/';
static const String authSendOtpEndpoint = '/auth/send-otp/';
static const String authVerifyOtpEndpoint = '/auth/verify-otp/';

// Boats & Bookings
static const String boatsEndpoint = '/boats/';
static const String bookingsEndpoint = '/bookings/';

// Ownership & Fuel Wallet
static const String ownershipEndpoint = '/ownership/';
static const String fuelWalletEndpoint = '/fuel-wallet/';
```

### API Service Configuration
HTTP client with automatic:
- Bearer token authentication
- Request/response logging
- Error handling for common scenarios
- Timeout configuration (30 seconds)
- Retry logic for network failures

### Latest Package Versions (2024)
- **flutter_stripe: 11.1.0** - Latest Stripe integration
- **dio: 5.7.0** - Modern HTTP client
- **go_router: 14.6.1** - Latest navigation solution
- **riverpod: 2.5.1** - Current state management
- **pinput: 5.0.0** - Modern OTP input widget

## 🎨 UI/UX Design

### Ocean-themed Color Palette
```dart
static const Color primary = Color(0xFF2563EB);    // Ocean blue
static const Color secondary = Color(0xFF0EA5E9);  // Sky blue
static const Color luxury = Color(0xFFD97706);     // Gold accent
static const Color success = Color(0xFF10B981);    // Green
static const Color error = Color(0xFFEF4444);      // Red
```

### Typography
- **Font Family**: SF Pro (iOS-native styling)
- **Responsive Sizing**: Dynamic text scaling support
- **Weight Hierarchy**: Regular (400) to Bold (700)
- **Accessibility**: Screen reader optimized

### Components
- **Custom Cards** - Yacht listing and detail cards
- **Ocean Gradients** - Primary and luxury gradient themes
- **Bottom Navigation** - 5-tab native-style navigation
- **Form Inputs** - Consistent styling with validation states

## 🔒 Security Features

### Authentication Security
- **Secure Token Storage** - flutter_secure_storage integration
- **Automatic Token Refresh** - Seamless session management
- **OTP Verification** - SMS-based phone verification
- **Role-based Access** - UI/feature access by user role

### Data Protection
- **Input Validation** - Client and server-side validation
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization
- **Deep Link Validation** - Secure navigation parameters

### Network Security
- **HTTPS Enforcement** - TLS 1.2+ for all API calls
- **Certificate Pinning** - Production API security
- **Request Signing** - API request authentication
- **Rate Limiting** - API abuse prevention

## 🛠️ Development

### Code Generation
```bash
# Watch for changes (recommended during development)
flutter packages pub run build_runner watch

# One-time generation
flutter packages pub run build_runner build --delete-conflicting-outputs
```

### Testing
```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widget_test.dart

# Integration tests
flutter test integration_test/
```

### Debugging
```bash
# Run with debugging
flutter run --debug

# Performance profiling
flutter run --profile

# Release testing
flutter run --release
```

### Build Commands
```bash
# Android
flutter build apk --release                    # APK
flutter build appbundle --release              # App Bundle (Play Store)

# iOS
flutter build ios --release                    # iOS build
flutter build ipa --release                    # App Store package
```

## 📊 User Roles & Features

### Visitors (Default)
- Browse yacht fleet
- View yacht specifications
- Create rental bookings
- Basic profile management
- Access fuel wallet for rentals

### Yacht Owners
- All visitor features
- Fractional ownership dashboard
- Usage quota tracking and management
- Priority booking access
- Enhanced fuel wallet features
- Co-owner communication tools

### Administrators
- All user features
- Fleet management tools
- Booking administration
- User management dashboard
- System health monitoring
- Analytics and reporting

## 🚀 Deployment

### App Store Preparation
1. **iOS App Store**:
   - Configure app metadata in App Store Connect
   - Add app screenshots (6.7", 6.5", 5.5")
   - Create app preview videos
   - Submit for review

2. **Google Play Store**:
   - Configure Play Console metadata
   - Add feature graphics and screenshots
   - Create store listing
   - Upload signed App Bundle

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
name: Build and Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter test
      - run: flutter build apk --release
```

## 📈 Performance Optimization

### Image Optimization
- **cached_network_image** - Automatic image caching
- **Image compression** - Optimized file sizes
- **Progressive loading** - Shimmer placeholders
- **Memory management** - Efficient image disposal

### Network Optimization
- **Response caching** - API response caching
- **Request batching** - Multiple API calls optimization
- **Offline support** - Local data persistence
- **Background sync** - Automatic data updates

### App Performance
- **Lazy loading** - On-demand widget creation
- **Tree shaking** - Unused code elimination
- **Code splitting** - Feature-based bundling
- **Memory profiling** - Performance monitoring

## 🔧 Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter packages pub run build_runner build --delete-conflicting-outputs
```

**Code Generation Issues**:
```bash
# Delete generated files and regenerate
find . -name "*.g.dart" -delete
find . -name "*.freezed.dart" -delete
flutter packages pub run build_runner build --delete-conflicting-outputs
```

**iOS Build Issues**:
```bash
# Clean iOS build
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
flutter clean
flutter build ios
```

**Android Build Issues**:
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
flutter clean
flutter build apk
```

### API Connection Issues
1. Verify Django backend is running
2. Check `baseUrl` in `app_config.dart`
3. Ensure network permissions in manifests
4. Test API endpoints with curl/Postman

### State Management Debugging
1. Add Riverpod logging:
   ```dart
   ProviderScope(
     observers: [ProviderLogger()],
     child: MyApp(),
   )
   ```

2. Debug provider states in DevTools
3. Check provider dependencies
4. Verify code generation completed

## 📚 Additional Resources

- [Flutter Documentation](https://docs.flutter.dev)
- [Riverpod Documentation](https://riverpod.dev)
- [GoRouter Documentation](https://pub.dev/packages/go_router)
- [Stripe Flutter Documentation](https://stripe.dev/stripe-flutter)
- [Django REST Framework](https://www.django-rest-framework.org)

## 🤝 Support

For technical support:
1. Check the troubleshooting section above
2. Review Django backend API documentation
3. Verify network connectivity to Django server
4. Check Flutter and package versions compatibility

---

**Built with Flutter 3.16+ for the Nauttec Premium Yacht Platform**
*Ocean-themed design • Modern architecture • Production ready*