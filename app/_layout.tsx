import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ResumeProvider } from '../context/ResumeContext';
import { CreditBalanceProvider } from '../context/CreditBalanceContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ResumeProvider>
          <CreditBalanceProvider>
            <Stack initialRouteName="(auth)/welcome">
              <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
              <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
              <Stack.Screen name="(main)/home" options={{ title: 'Home' }} />
              <Stack.Screen name="(main)/onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(main)/profile" options={{ title: 'Profile' }} />
              <Stack.Screen name="(main)/buyCredits" options={{ title: 'Buy Credits' }} />
              <Stack.Screen name="resume/ai-edit" options={{ title: 'AI Edit' }} />
              <Stack.Screen name="resume/manual-edit" options={{ title: 'Manual Edit' }} />
              <Stack.Screen name="resume/ai-generator" options={{ title: 'AI Generator' }} />
              <Stack.Screen name="resume/editor" options={{ title: 'Create Resume' }} />
              <Stack.Screen name="resume/preview" options={{ title: 'Preview Resume' }} />
            </Stack>
          </CreditBalanceProvider>
        </ResumeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
