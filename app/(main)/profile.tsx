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
import { THEME_COLORS } from '../../context/ThemeContext';

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
    <View className="flex-1" style={{ backgroundColor: THEME_COLORS.background }}>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        </View>
      ) : (
        <>
          {/* Header with gradient */}
          <LinearGradient
            colors={[THEME_COLORS.primary, THEME_COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 120,
              width: '100%',
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              zIndex: 0,
            }}
          />
          <ScrollView
            className="-mt-16 flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}>
            {/* Profile Card */}
            <View
              className="mb-4 mt-10 rounded-2xl p-6 shadow-sm"
              style={{ backgroundColor: THEME_COLORS.surface }}>
              <View className="-mt-14 mb-2 items-center">
                <View
                  className="h-24 w-24 items-center justify-center rounded-full border-4"
                  style={{
                    borderColor: THEME_COLORS.surface,
                    backgroundColor: '#E6ECFF',
                  }}>
                  <Text className="text-4xl font-bold" style={{ color: THEME_COLORS.primary }}>
                    {user?.name?.charAt(0) ?? user?.email?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              </View>
              <Text className="text-center text-xl font-bold" style={{ color: THEME_COLORS.text }}>
                {user?.name || 'Your Name'}
              </Text>
              <View className="mt-1 flex-row items-center justify-center gap-2">
                <MaterialIcons
                  name="alternate-email"
                  size={16}
                  color={THEME_COLORS.textSecondary}
                />
                <Text className="text-sm" style={{ color: THEME_COLORS.textSecondary }}>
                  {user?.email}
                </Text>
              </View>

              <View className="mt-4 flex-row items-center justify-center gap-3">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="rounded-full border border-red-600 bg-red-500 px-5 py-2.5">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="logout" size={18} color="#ffffff" />
                    <Text className="font-medium text-white">Log Out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Credits Card */}
            <View
              className="mb-4 rounded-2xl p-5 shadow-sm"
              style={{
                backgroundColor: THEME_COLORS.surface,
                borderColor: THEME_COLORS.border,
                borderWidth: 1,
              }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="credit-card" size={18} color={THEME_COLORS.primary} />
                <Text className="text-sm font-medium" style={{ color: THEME_COLORS.primary }}>
                  Career Credits
                </Text>
              </View>
              <View className="mt-2 items-center justify-between">
                <View></View>
                <View className="z-10 w-[80%] flex-row items-center justify-between py-5">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={18}
                      color={THEME_COLORS.textSecondary}
                      className="-ml-4 mr-4"
                    />
                    <Text
                      className="-ml-4 mr-4 text-xl"
                      style={{ color: THEME_COLORS.textSecondary }}>
                      Current Balance :
                    </Text>
                  </View>
                  <Text
                    className="mr-4 text-center text-3xl font-extrabold"
                    style={{ color: THEME_COLORS.primary }}>
                    {balance}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPurchaseOpen(true)}
                    className="rounded-full px-4 py-2"
                    style={{ backgroundColor: THEME_COLORS.primary }}>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="shopping-cart" size={18} color="#ffffff" />
                      <Text className="font-semibold text-white">Buy</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <Text className="mt-1 text-xs" style={{ color: THEME_COLORS.textSecondary }}>
                AI Generate (3) · AI Rewrite (1) · Premium Template (5)
              </Text>
            </View>

            {/* Help & Legal */}
            <View
              className="mb-6 rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: THEME_COLORS.surface }}>
              <View className="mb-1 flex-row items-center gap-2">
                <MaterialIcons name="verified-user" size={18} color={THEME_COLORS.text} />
                <Text className="text-base font-semibold" style={{ color: THEME_COLORS.text }}>
                  Help & Legal
                </Text>
              </View>
              <View className="divide-y divide-gray-100">
                <TouchableOpacity
                  onPress={() => Linking.openURL('mailto:support@example.com')}
                  className="flex-row items-center justify-between py-3">
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="support-agent" size={20} color={THEME_COLORS.text} />
                    <Text style={{ color: THEME_COLORS.text }}>Contact Support</Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={THEME_COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://example.com/privacy')}
                  className="flex-row items-center justify-between py-3">
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="privacy-tip" size={20} color={THEME_COLORS.text} />
                    <Text style={{ color: THEME_COLORS.text }}>Privacy Policy</Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={THEME_COLORS.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Linking.openURL('https://example.com/terms')}
                  className="flex-row items-center justify-between py-3">
                  <View className="flex-row items-center gap-3">
                    <MaterialIcons name="gavel" size={20} color={THEME_COLORS.text} />
                    <Text style={{ color: THEME_COLORS.text }}>Terms of Use</Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={THEME_COLORS.textSecondary}
                  />
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
