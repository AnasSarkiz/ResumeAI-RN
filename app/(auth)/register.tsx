import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your full name');
      return;
    }

    try {
      await register(email, password, name);
      router.replace('/(main)/home');
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentInsetAdjustmentBehavior="always"
        className="bg-gray-50 dark:bg-gray-900"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</Text>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            className="rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            className="rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
        </View>
        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="mb-4 rounded-full bg-primary-600 dark:bg-primary-500 py-3">
          <Text className="text-center text-lg font-medium text-white">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="py-3" onPress={() => router.replace('/login')}>
          <Text className="text-center font-medium text-primary-600 dark:text-primary-400">
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

