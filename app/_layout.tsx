import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ResumeProvider } from '../context/ResumeContext';
import { CreditBalanceProvider } from '../context/CreditBalanceContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { NetworkProvider, useNetwork } from '../context/NetworkContext';
import '../global.css';

function AppHeader({ title }: { title: string }) {
  const { isOnline } = useNetwork();
  return (
    <View style={{ backgroundColor: '#25439A' }}>
      <View className="flex h-28 items-center justify-end">
        <Text className="my-2 text-2xl font-bold text-white">{title}</Text>
      </View>
      {!isOnline ? (
        <View className="flex h-12 items-center justify-center bg-yellow-100">
          <Text className="text-sm font-semibold text-yellow-900">
            You are offline. Changes are saved when back online.
          </Text>
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
