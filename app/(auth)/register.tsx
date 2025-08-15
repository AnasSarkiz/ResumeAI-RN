import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    <View className="flex-1 justify-center bg-white p-6">
      <Text className="mb-8 text-2xl font-bold text-gray-800">Create Account</Text>

      <View className="mb-4">
        <Text className="mb-1 text-sm font-medium text-gray-700">Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          className="rounded-md border border-gray-300 p-2"
        />
      </View>

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
        onPress={handleRegister}
        disabled={loading}
        className="mb-4 rounded-full bg-blue-500 py-3">
        <Text className="text-center text-lg font-medium text-white">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="py-3" onPress={() => router.replace('/login')}>
        <Text className="text-center font-medium text-blue-500">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
}
