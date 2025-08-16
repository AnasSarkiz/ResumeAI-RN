import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { addCredits } from '../../services/credits';
import { useCredits } from '../../context/CreditBalanceContext';
import { PurchaseCreditsModal } from '../../components/PurchaseCreditsModal';

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const { balance, loading: creditsLoading } = useCredits();
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/welcome');
          } catch (error) {
            Alert.alert('Logout Failed', 'Unable to logout. Please try again.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {/* Header with gradient */}
          <LinearGradient
            colors={["#25439A", "#3D92C4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: 120, width: '100%', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 0 }}
          />
          <ScrollView
            className="-mt-16 flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Card */}
            <View className="mb-4 rounded-2xl mt-10 bg-white p-6 shadow-sm">
              <View className="-mt-14 mb-2 items-center">
                <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-100">
                  <Text className="text-4xl font-bold text-[#25439A]">
                    {user?.name?.charAt(0) ?? user?.email?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              </View>
              <Text className="text-center text-xl font-bold text-gray-900">{user?.name || 'Your Name'}</Text>
              <View className="mt-1 flex-row items-center justify-center gap-2">
                <MaterialIcons name="alternate-email" size={16} color="#6b7280" />
                <Text className="text-sm text-gray-500">{user?.email}</Text>
              </View>


              <View className="mt-4 flex-row items-center justify-center gap-3">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="rounded-full border bg-red-400 border-red-600 px-5 py-2.5"
                >
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="logout" size={18} color="#ffffff" />
                    <Text className="font-medium text-white">Log Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Credits Card */}
            <View className="mb-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="credit-card" size={18} color="#25439A" />
                <Text className="text-sm font-medium text-[#25439A]">Career Credits</Text>
              </View>
              <View className="mt-2 items-center justify-between">
                <View>
                </View>
                <View className="flex-row items-center justify-between z-10 py-5 w-[80%]">
                  <View className="flex-row items-center">
                    <MaterialIcons name="account-balance-wallet" size={18} color="#6b7280"  className="-ml-4 mr-4"/>
                    <Text className="text-xl text-gray-500 -ml-4 mr-4">  Current Balance :</Text>
                  </View>
                  <Text className="text-3xl font-extrabold text-center mr-4 text-[#25439A]">{balance}</Text>
                  <TouchableOpacity
                    onPress={() => setPurchaseOpen(true)}
                    className="rounded-full bg-[#25439A] px-4  py-2"
                  >
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="shopping-cart" size={18} color="#ffffff" />
                      <Text className="font-semibold text-white ">Buy</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {/* {__DEV__ && user?.id ? (
                <View className="my-3">
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await addCredits(user.id!, 50, { type: 'admin' });
                        await refresh();
                      } catch {}
                    }}
                    className="rounded-xl bg-green-600 px-4 py-2"
                  >
                    <Text className="text-center font-semibold text-white">Add 50 Test Credits (DEV)</Text>
                  </TouchableOpacity>
                </View>
              ) : null} */}
                    <Text className="mt-1 text-xs text-gray-500">
                    AI Generate (3) · AI Rewrite (1) · Premium Template (5)
                  </Text>
            </View>

            {/* Appearance Mode Selector (UI only) */}
            <View className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
              <Text className="mb-1 text-base font-semibold text-gray-900">Appearance</Text>
              <Text className="mb-3 text-xs text-gray-500">Choose your display mode</Text>
              <View className="flex-row items-center justify-between rounded-xl bg-gray-100 p-1">
                <TouchableOpacity className="flex-1 items-center rounded-lg bg-white py-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="settings" size={16} color="#111827" />
                    <Text className="text-sm font-medium text-gray-900">System</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center rounded-lg py-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="light-mode" size={16} color="#6b7280" />
                    <Text className="text-sm font-medium text-gray-600">Light</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 items-center rounded-lg py-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="dark-mode" size={16} color="#6b7280" />
                    <Text className="text-sm font-medium text-gray-600">Dark</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Learn More / Help */}
            <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
              <View className="mb-1 flex-row items-center gap-2">
                <MaterialIcons name="verified-user" size={18} color="#111827" />
                <Text className="text-base font-semibold text-gray-900">Help & Legal</Text>
              </View>
              <View className="divide-y divide-gray-100">
                <TouchableOpacity
                  onPress={() => Linking.openURL('mailto:support@example.com')}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="support-agent" size={20} color="#111827" />
                    <Text className="text-gray-900">Contact Support</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://example.com/privacy')}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="privacy-tip" size={20} color="#111827" />
                    <Text className="text-gray-900">Privacy Policy</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://example.com/terms')}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="gavel" size={20} color="#111827" />
                    <Text className="text-gray-900">Terms of Use</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
      <PurchaseCreditsModal visible={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </View>
  );
}
