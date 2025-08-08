import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-12">
        <Image
          source={require('../../assets/ResumeAILogo.png')}
          className="w-40 h-40 mb-6"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">ResumeAI</Text>
        <Text className="text-lg text-gray-600 text-center">
          Create professional resumes with AI-powered enhancements
        </Text>
      </View>

      <View className="space-y-4">
        {user ? (
          <Link href="../(main)/home" asChild>
            <TouchableOpacity className="bg-blue-500 py-3 rounded-full">
              <Text className="text-white text-center font-medium text-lg">Continue to App</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <>
            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-full my-2"
              onPress={() => {
                router.replace('/register');
              }}
            >
              <Text className="text-white text-center font-medium text-lg">Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-blue-500 py-3 rounded-full my-2"
              onPress={() => {
                router.replace('/login');
              }}
            >
              <Text className="text-blue-500 text-center font-medium text-lg">Log In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}