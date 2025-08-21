import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: {
    label?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  avatar?: {
    text: string;
    onPress?: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, rightAction, avatar }) => {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View>
        <Text className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</Text>
        ) : null}
      </View>

      {avatar ? (
        <TouchableOpacity
          onPress={avatar.onPress}
          className="h-12 w-12 items-center justify-center rounded-full bg-primary shadow-md"
          accessibilityRole="button"
          accessibilityLabel={title + ' profile'}>
          <Text className="text-lg font-semibold text-white">{avatar.text}</Text>
        </TouchableOpacity>
      ) : rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          className="flex-row items-center gap-2 rounded-full bg-primary-600 px-4 py-2 dark:bg-primary-500">
          {rightAction.icon ? <Ionicons name={rightAction.icon} size={18} color="#ffffff" /> : null}
          <Text className="font-medium text-white">{rightAction.label ?? 'Action'}</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

export default PageHeader;
