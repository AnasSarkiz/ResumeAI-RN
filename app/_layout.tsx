import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ResumeProvider } from '../context/ResumeContext';
import { CreditBalanceProvider } from '../context/CreditBalanceContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import { useState } from 'react';
import '../global.css';

function AppHeader({ title }: { title: string }) {
  const { isOnline, refresh } = useNetwork();
  const [refreshing, setRefreshing] = useState(false);
  const onRetry = async () => {
    try {
      setRefreshing(true);
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={{ backgroundColor: '#25439A' }}>
      <View className="flex h-28 items-center justify-end">
        <Text className="my-2 text-2xl font-bold text-white">{title}</Text>
      </View>
      {!isOnline ? (
        <View className="flex h-12 flex-row items-center justify-between bg-yellow-100 px-4">
          <Text className="text-sm ml-[30%] font-semibold text-yellow-900">
            No internet connection!
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retry connection"
            onPress={onRetry}
            disabled={refreshing}
            className="flex flex-row items-center"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#854d0e" />
            ) : (
              <Text className="text-base font-bold text-yellow-900">↻</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NetworkProvider>
        <AuthProvider>
          <ResumeProvider>
            <CreditBalanceProvider>
              <Stack
                initialRouteName="(auth)/welcome"
                screenOptions={{
                  headerStyle: { backgroundColor: '#25439A' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { color: '#fff' },
                  header: ({ options }) => <AppHeader title={(options.title as string) || ''} />,
                }}>
                <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
                <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
                <Stack.Screen name="(main)/home" options={{ title: 'Home' }} />
                <Stack.Screen name="(main)/onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(main)/profile" options={{ title: 'Profile' }} />
                <Stack.Screen name="resume/ai-edit" options={{ title: 'AI Edit' }} />
                <Stack.Screen name="resume/manual-edit" options={{ title: 'Manual Edit' }} />
                <Stack.Screen name="resume/ai-generator" options={{ title: 'AI Generator' }} />
                <Stack.Screen name="resume/editor" options={{ title: 'Create Resume' }} />
                <Stack.Screen name="resume/preview" options={{ title: 'Preview Resume' }} />
                <Stack.Screen name="resume/templates" options={{ title: 'Templates' }} />
              </Stack>
            </CreditBalanceProvider>
          </ResumeProvider>
        </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}
