import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import YachtsScreen from './src/screens/YachtsScreen';
import YachtDetailScreen from './src/screens/YachtDetailScreen';
import BookingScreen from './src/screens/BookingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OTPScreen from './src/screens/OTPScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Types
export type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
  Main: undefined;
  YachtDetail: { yachtId: string };
  Booking: { yachtId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    // Hide splash screen after app loads
    const hideSplashScreen = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreen.hideAsync();
    };
    
    hideSplashScreen();
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={isAuthenticated ? "Main" : "Login"}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="OTP" 
                component={OTPScreen}
                options={{ title: 'Verify Phone Number' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Main" 
                component={MainTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="YachtDetail" 
                component={YachtDetailScreen}
                options={{ title: 'Yacht Details' }}
              />
              <Stack.Screen 
                name="Booking" 
                component={BookingScreen}
                options={{ title: 'Book Yacht' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" backgroundColor="#2563eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});