import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface EditableTextInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

export const EditableTextInput: React.FC<EditableTextInputProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View className={`mb-4 ${className}`}>
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      {isEditing ? (
        <View className="relative">
          <TextInput
            value={value}
            onChangeText={onChange}
            multiline={multiline}
            placeholder={placeholder}
            className={`rounded-md border border-gray-300 p-2 ${multiline ? 'min-h-[100px]' : ''}`}
            autoFocus
          />
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            className="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1">
            <Text className="text-sm text-white">Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <View
            className={`rounded-md border border-transparent p-2 ${value ? 'bg-white' : 'bg-gray-100'}`}>
            <Text className={`${value ? 'text-gray-800' : 'text-gray-500'}`}>
              {value || placeholder}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
