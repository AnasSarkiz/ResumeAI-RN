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
            <Stack.Screen name="(main)/profile" options={{ title: 'Profile' }} />
            <Stack.Screen name="(main)/subscriptions" options={{ title: 'Subscriptions' }} />
          </Stack>
        </SubscriptionProvider>
      </ResumeProvider>
    </AuthProvider>
  );
}