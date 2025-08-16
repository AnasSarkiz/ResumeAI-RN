import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ResumeSection } from '../types/resume';

interface ResumeSectionCardProps {
  title: string;
  active: boolean;
  onPress: () => void;
  icon?: string;
}

export const ResumeSectionCard: React.FC<ResumeSectionCardProps> = ({
  title,
  active,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`my-2 rounded-lg border p-4 ${active ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}>
      <View className="flex-row items-center">
        {icon && (
          <View className="mr-3">
            <Text className="text-lg">{icon}</Text>
          </View>
        )}
        <Text
          className={`text-lg font-medium ${active ? 'text-primary-700' : 'text-gray-700 dark:text-gray-200'}`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
