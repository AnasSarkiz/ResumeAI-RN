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
    Alert.alert('Registration Failed', error instanceof Error ? error.message : 'An unknown error occurred');
  }
};

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-2xl font-bold text-gray-800 mb-8">Create Account</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          className="border border-gray-300 rounded-md p-2"
        />
      </View>
      
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
        onPress={handleRegister}
        disabled={loading}
        className="bg-blue-500 py-3 rounded-full mb-4"
      >
        <Text className="text-white text-center font-medium text-lg">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <Link href="../(auth)/login" asChild>
        <TouchableOpacity className="py-3">
          <Text className="text-blue-500 text-center font-medium">
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}