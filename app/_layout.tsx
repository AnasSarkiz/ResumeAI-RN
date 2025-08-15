import { AuthProvider } from '../context/AuthContext';
import { ResumeProvider } from '../context/ResumeContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <SubscriptionProvider>
          <Stack initialRouteName="(auth)/welcome">
            <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
            <Stack.Screen name="(auth)/register" options={{ title: 'Register' }} />
            <Stack.Screen name="(main)/home" options={{ title: 'Home' }} />
            <Stack.Screen name="(main)/onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="(main)/profile" options={{ title: 'Profile' }} />
            <Stack.Screen name="(main)/subscriptions" options={{ title: 'Subscriptions' }} />
            <Stack.Screen name="resume/ai-edit" options={{ title: 'AI Edit' }} />
            <Stack.Screen name="resume/manual-edit" options={{ title: 'Manual Edit' }} />
            <Stack.Screen name="resume/ai-generator" options={{ title: 'AI Generator' }} />
            <Stack.Screen name="resume/editor" options={{ title: 'Create Resume' }} />
            <Stack.Screen name="resume/preview" options={{ title: 'Preview Resume' }} />
          </Stack>
        </SubscriptionProvider>
      </ResumeProvider>
    </AuthProvider>
  );
}

