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
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-8">Log In</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-md p-2"
        />
      </View>
      
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          className="border border-gray-300 rounded-md p-2"
        />
      </View>
      
      <TouchableOpacity
        // onPress={handleLogin}
        onPress={()=> router.replace('/(main)/home')}
        className="bg-blue-500 py-3 rounded-full mb-4"
      >
        <Text className="text-white text-center font-medium text-lg">
          {loading ? 'Logging In...' : 'Log In'}
        </Text>
      </TouchableOpacity>
      
      <Link href="/register" asChild>
        <TouchableOpacity className="py-3">
          <Text className="text-blue-500 text-center font-medium">
            Don not have an account? Sign up
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}