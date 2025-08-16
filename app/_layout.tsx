import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ResumeProvider } from '../context/ResumeContext';
import { CreditBalanceProvider } from '../context/CreditBalanceContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <ResumeProvider>
          <CreditBalanceProvider>
            <Stack
              initialRouteName="(auth)/welcome"
              screenOptions={{
                headerStyle: { backgroundColor: '#25439A' },
                headerTintColor: '#fff',
                headerTitleStyle: { color: '#fff' },
              }}
              >
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
    </SafeAreaProvider>
  );
}
