import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';

export default function SubscribeScreen() {
  const { plans, loading, purchasePlan, isPro } = useSubscription();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (isPro) {
      Alert.alert('Already Pro', 'You are already a Pro user!');
    }
  }, [isPro]);

  const handlePurchase = async (planId: string) => {
    try {
      await purchasePlan(planId);
      await refreshUser();
      Alert.alert('Success', 'You are now a Pro user!');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="mb-6 text-2xl font-bold text-gray-800">Upgrade to Pro</Text>

      <Text className="mb-2 text-lg font-medium text-gray-700">Pro Features:</Text>
      <View className="mb-6 rounded-lg bg-white p-4">
        <View className="mb-2 flex-row items-center">
          <Text className="mr-2 text-green-500">✓</Text>
          <Text>Unlimited resumes</Text>
        </View>
        <View className="mb-2 flex-row items-center">
          <Text className="mr-2 text-green-500">✓</Text>
          <Text>AI-powered suggestions</Text>
        </View>
        <View className="mb-2 flex-row items-center">
          <Text className="mr-2 text-green-500">✓</Text>
          <Text>PDF export</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-2 text-green-500">✓</Text>
          <Text>Cover letter generator</Text>
        </View>
      </View>

      {loading ? (
        <View className="items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="space-y-4">
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => handlePurchase(plan.id)}
              className="rounded-lg border-2 border-blue-500 p-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-bold">{plan.name}</Text>
                <Text className="text-lg font-bold">
                  {plan.currency}
                  {plan.price}/{plan.interval}
                </Text>
              </View>
              <Text className="text-gray-600">{plan.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
