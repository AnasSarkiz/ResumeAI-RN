import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <View className="-mt-36 mb-12 items-center">
        <Image source={require('../../assets/logo.png')} className="h-96 w-96 " />
        {/* <Text className="mb-2 text-3xl font-bold text-gray-800">ResumeAI</Text> */}
        <Text className="text-center text-lg text-gray-600 dark:text-gray-300">
          Create professional resumes with AI-powered enhancements
        </Text>
      </View>

      <View className="space-y-4">
        {user ? (
          <TouchableOpacity
            className="rounded-full bg-primary-600 dark:bg-primary-500 py-3"
            onPress={() => router.replace('/(main)/home')}>
            <Text className="text-center text-lg font-medium text-white">Continue to App</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              className="my-2 rounded-full bg-primary-600 dark:bg-primary-500 py-3"
              onPress={() => {
                router.push('/register');
              }}>
              <Text className="text-center text-lg font-medium text-white">Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="my-2 rounded-full border border-primary-600 dark:border-primary-400 py-3"
              onPress={() => {
                router.push('/login');
              }}>
              <Text className="text-center text-lg font-medium text-primary-600 dark:text-primary-400">Log In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

