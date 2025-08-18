import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import { t } from '../services/i18n';

interface Props {
  message: string | null | undefined; // can be a localization key or plain string
}

export const ErrorBanner: React.FC<Props> = ({ message }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  }, [message, anim]);

  if (!message) return null;
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] });
  const text = t(message);

  return (
    <Animated.View
      style={{ opacity: anim, transform: [{ translateY }] }}
      className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
      <Text className="text-sm text-red-800 dark:text-red-200">{text}</Text>
    </Animated.View>
  );
};

export default ErrorBanner;
