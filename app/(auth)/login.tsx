import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(main)/home');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  };

  return (
    <View className="flex-1 justify-center bg-white p-6">
      <Text className="mb-8 text-2xl font-bold text-gray-800">Log In</Text>

      <View className="mb-4">
        <Text className="mb-1 text-sm font-medium text-gray-700">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded-md border border-gray-300 p-2"
        />
      </View>

      <View className="mb-6">
        <Text className="mb-1 text-sm font-medium text-gray-700">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          className="rounded-md border border-gray-300 p-2"
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        // onPress={()=> router.replace('/(main)/home')}
        className="mb-4 rounded-full bg-blue-500 py-3">
        <Text className="text-center text-lg font-medium text-white">
          {loading ? 'Logging In...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity className="py-3">
          <Text className="text-center font-medium text-blue-500">
            Don not have an account? Sign up
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
