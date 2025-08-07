import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nauttec.yachtak',
  appName: 'Nauttec',
  webDir: 'dist/public',
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