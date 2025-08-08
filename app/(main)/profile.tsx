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
      <View className="bg-white rounded-lg p-6 mb-4">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Text className="text-blue-500 text-3xl font-bold">
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-gray-800">{user?.name || 'User'}</Text>

          <Text className="text-gray-500">{user?.email}</Text>

        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-gray-800 mb-2">Account Plan</Text>
          <View className={`p-4 rounded-lg ${isPro ? 'bg-green-100 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
            <Text className="font-bold text-gray-800">
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </Text>
            <Text className="text-gray-600">
              {isPro ? 'Unlimited resumes with AI features' : 'Limited to 1 resume'}
            </Text>
          </View>
        </View>

        {!isPro && (
          <Link href="/(main)/subscribe" asChild>
            <TouchableOpacity className="bg-blue-500 py-3 rounded-full mb-4">
              <Text className="text-white text-center font-medium">Upgrade to Pro</Text>
            </TouchableOpacity>
          </Link>
        )}

        <TouchableOpacity
          onPress={handleLogout}
          className="border border-red-500 py-3 rounded-full"
        >
          <Text className="text-red-500 text-center font-medium">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}