import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ErrorBanner from '../../components/ErrorBanner';
import { t } from '../../services/i18n';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, loading, error, clearError } = useAuth();

  // Clear any previous auth error when this screen mounts
  useEffect(() => {
    if (error) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async () => {
    // Client-side validation
    const emailValid = /.+@.+\..+/.test(email);
    const passwordValid = password.length >= 6;
    const nameValid = name.trim().length > 0;

    setEmailError(emailValid ? null : 'errors.form.invalid_email');
    setPasswordError(passwordValid ? null : 'errors.form.password_min');
    setNameError(nameValid ? null : 'errors.form.name_required');
    if (!emailValid || !passwordValid || !nameValid) return;

    try {
      await register(email, password, name);
      router.replace('/(main)/home');
    } catch (error) {
      const msg = error instanceof Error ? t(error.message) : t('errors.common.unknown');
      Alert.alert(t('auth.alert.register_failed'), msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentInsetAdjustmentBehavior="always"
        className="bg-gray-50 dark:bg-gray-900"
        showsVerticalScrollIndicator={false}>
        <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('auth.register.title')}
        </Text>
        <ErrorBanner message={error} />

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </Text>
          <TextInput
            value={name}
            onChangeText={(v) => {
              if (error) clearError();
              setName(v);
              if (nameError) setNameError(null);
            }}
            placeholder="John Doe"
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          {nameError ? (
            <Text className="mt-1 text-xs text-red-700 dark:text-red-300">{t(nameError)}</Text>
          ) : null}
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</Text>
          <TextInput
            value={email}
            onChangeText={(v) => {
              if (error) clearError();
              setEmail(v);
              if (emailError) setEmailError(null);
            }}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          {emailError ? (
            <Text className="mt-1 text-xs text-red-700 dark:text-red-300">{t(emailError)}</Text>
          ) : null}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={(v) => {
              if (error) clearError();
              setPassword(v);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="••••••••"
            secureTextEntry
            className="rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
          {passwordError ? (
            <Text className="mt-1 text-xs text-red-700 dark:text-red-300">{t(passwordError)}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="mb-4 rounded-full bg-primary-600 py-3 opacity-100 disabled:opacity-60 dark:bg-primary-500">
          <Text className="text-center text-lg font-medium text-white">
            {loading ? t('auth.register.submitting') : t('auth.register.submit')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-3"
          onPress={() => {
            if (error) clearError();
            router.replace('/login');
          }}>
          <Text className="text-center font-medium text-primary-600 dark:text-primary-400">
            {t('auth.cta.login')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
