import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isPro, refreshSubscriptionStatus } = useSubscription();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/welcome');
    } catch (error) {
      Alert.alert('Logout Failed', 'Unable to logout. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-4 rounded-lg bg-white p-6">
        <View className="mb-6 items-center">
          <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <Text className="text-3xl font-bold text-blue-500">
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">{user?.name}</Text>

          <Text className="text-gray-500">{user?.email}</Text>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-lg font-medium text-gray-800">Account Plan</Text>
          <View
            className={`rounded-lg p-4 ${isPro ? 'border border-green-200 bg-green-100' : 'border border-gray-200 bg-gray-100'}`}>
            <Text className="font-bold text-gray-800">{isPro ? 'Pro Plan' : 'Free Plan'}</Text>
            <Text className="text-gray-600">
              {isPro ? 'Unlimited resumes with AI features' : 'Limited to 1 resume'}
            </Text>
          </View>
        </View>

        {!isPro && (
          <Link href="/(main)/subscribe" asChild>
            <TouchableOpacity className="mb-4 rounded-full bg-blue-500 py-3">
              <Text className="text-center font-medium text-white">Upgrade to Pro</Text>
            </TouchableOpacity>
          </Link>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="rounded-full border border-red-500 py-3">
          <Text className="text-center font-medium text-red-500">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
