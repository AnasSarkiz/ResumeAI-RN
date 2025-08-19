import React, { useEffect, useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ErrorBanner from '../../components/ErrorBanner';
import { t } from '../../services/i18n';
import AuthLayout from '../../components/AuthLayout';
import AuthTextInput from '../../components/AuthTextInput';
import AuthButton from '../../components/AuthButton';

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
      <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
        <ErrorBanner message={error} />

        <AuthTextInput
          label="Full Name"
          value={name}
          onChangeText={(v) => {
            if (error) clearError();
            setName(v);
            if (nameError) setNameError(null);
          }}
          placeholder="John Doe"
          autoCapitalize="words"
          errorText={nameError ? t(nameError) : undefined}
        />

        <AuthTextInput
          label="Email"
          value={email}
          onChangeText={(v) => {
            if (error) clearError();
            setEmail(v);
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
          onChangeText={(v) => {
            if (error) clearError();
            setPassword(v);
            if (passwordError) setPasswordError(null);
          }}
          placeholder="••••••••"
          secureTextEntry
          errorText={passwordError ? t(passwordError) : undefined}
        />

        <View className="mt-2 space-y-3">
          <AuthButton
            title={loading ? t('auth.register.submitting') : t('auth.register.submit')}
            onPress={handleRegister}
            loading={loading}
          />
          <AuthButton
            title={t('auth.cta.login')}
            variant="secondary"
            onPress={() => {
              if (error) clearError();
              router.replace('/login');
            }}
          />
        </View>
      </AuthLayout>
    </KeyboardAvoidingView>
  );
}
