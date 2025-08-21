import React from 'react';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../services/i18n';
import AppButton from '../../components/AppButton';

export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 justify-center bg-gray-50 p-6 dark:bg-gray-950">
      <View className="items-center">
        <Image source={require('../../assets/icon.png')} className="my-8 h-64 w-64 shadow-xl" />
        <Text className="my-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {t('auth.welcome.title')}
        </Text>
        <Text className="mx-6 text-center text-base text-gray-600 dark:text-gray-300">
          {t('auth.welcome.subtitle')}
        </Text>
      </View>

      <View className="mt-10 space-y-3">
        {user ? (
          <AppButton
            title={t('auth.cta.continue')}
            onPress={() => router.replace('/(main)/home')}
          />
        ) : (
          <>
            <AppButton title={t('auth.cta.get_started')} onPress={() => router.push('/register')} />
            <AppButton
              title={t('auth.cta.login')}
              variant="secondary"
              onPress={() => router.push('/login')}
            />
          </>
        )}
      </View>
    </View>
  );
}
