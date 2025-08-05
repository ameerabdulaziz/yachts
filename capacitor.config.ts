import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nauttec.app',
  appName: 'Nauttec',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0ea5e9",
      androidSplashResourceName: "splash",
      showSpinner: false
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0ea5e9"
    }
  }
};

export default config;