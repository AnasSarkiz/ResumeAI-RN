import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

const CustomSplash = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync(); // Hide default splash
      onFinish(); // Callback to switch to main app
    }, 3000); // Adjust time to match GIF length

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./assets/splash.gif')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  }
});

export default CustomSplash;
