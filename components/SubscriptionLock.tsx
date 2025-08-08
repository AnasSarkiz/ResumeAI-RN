import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export const SubscriptionLock: React.FC<{ isVisible?: boolean }> = ({ isVisible = true }) => {
  const navigation = useNavigation();

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 rounded-lg items-center justify-center">
      <TouchableOpacity 
        onPress={() => router.navigate('app/(main)/subscribe')}
        className="bg-blue-500 px-4 py-2 rounded-full"
      >
        <Text className="text-white font-medium">Upgrade to Pro</Text>
      </TouchableOpacity>
    </View>
  );
};  