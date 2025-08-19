import React, { useEffect, useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ErrorBanner from '../../components/ErrorBanner';
import { t } from '../../services/i18n';
import AuthLayout from '../../components/AuthLayout';
import AuthTextInput from '../../components/AuthTextInput';
import AuthButton from '../../components/AuthButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { login, loading, error, clearError } = useAuth();

  // Clear any previous auth error when this screen mounts
  useEffect(() => {
    if (error) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    // Client-side validation
    const emailValid = /.+@.+\..+/.test(email);
    const passwordValid = password.length >= 1;
    setEmailError(emailValid ? null : 'errors.form.invalid_email');
    setPasswordError(passwordValid ? null : 'errors.form.missing_password');
    if (!emailValid || !passwordValid) return;
    try {
      await login(email, password);
      router.replace('/(main)/home');
    } catch (error) {
      const msg = error instanceof Error ? t(error.message) : t('errors.common.unknown');
      Alert.alert(t('auth.alert.login_failed'), msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
        <ErrorBanner message={error} />

        <AuthTextInput
          label="Email"
          value={email}
          onChangeText={(val) => {
            if (error) clearError();
            setEmail(val);
            if (emailError) setEmailError(null);
          }}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={emailError ? t(emailError) : undefined}
        />

        <AuthTextInput
          label="Password"
          value={password}
          onChangeText={(val) => {
            if (error) clearError();
            setPassword(val);
            if (passwordError) setPasswordError(null);
          }}
          placeholder="••••••••"
          secureTextEntry
          errorText={passwordError ? t(passwordError) : undefined}
        />

        <View className="mt-2 space-y-3">
          <AuthButton
            title={loading ? t('auth.login.submitting') : t('auth.login.submit')}
            onPress={handleLogin}
            loading={loading}
          />
          <AuthButton
            title={t('auth.cta.signup')}
            variant="secondary"
            onPress={() => {
              if (error) clearError();
              router.replace('./register');
            }}
          />
        </View>
      </AuthLayout>
    </KeyboardAvoidingView>
  );
}
