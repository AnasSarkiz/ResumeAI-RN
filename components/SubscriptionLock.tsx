import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export const SubscriptionLock: React.FC<{ isVisible?: boolean }> = ({ isVisible = true }) => {
  const router = useRouter();
  if (!isVisible) return null;
  return (
    <View className="absolute inset-0 items-center justify-center rounded-lg border bg-black bg-opacity-50">
      <TouchableOpacity
        onPress={() => router.push('(main)/subscribe')}
        className="rounded-full bg-blue-500 px-4 py-2">
        <Text className="font-medium text-white">Upgrade to Pro</Text>
      </TouchableOpacity>
    </View>
  );
};
