import React from 'react';
import { View, Text, Image } from 'react-native';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <View className="flex-1 bg-gray-50 px-6 py-8 dark:bg-gray-950">
      {/* Header / Branding */}
      <View className="mt-4 items-center">
        <Image source={require('../assets/icon.png')} className="h-44 w-44 shadow-md" />
        <Text className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-2 text-center text-base text-gray-600 dark:text-gray-300">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Card */}
      <View className="mt-8 rounded-2xl border border-gray-200/70 bg-white p-5 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900/70 dark:shadow-black/20">
        {children}
      </View>
    </View>
  );
};

export default AuthLayout;
