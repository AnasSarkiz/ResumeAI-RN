import React from 'react';
import { View, Text, TextInput } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

interface EditableTextInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  numberOfLines?: number;
  required?: boolean;
  error?: string | boolean;
}

export const EditableTextInput: React.FC<EditableTextInputProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
  className = '',
  keyboardType,
  autoCapitalize = 'none',
  secureTextEntry = false,
  numberOfLines,
  required = false,
  error,
}) => {
  const invalid = Boolean(error) || (required && (!value || value.trim().length === 0));
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="mb-1 text-sm font-medium text-gray-700">
        {label}
        {required ? ' *' : ''}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        numberOfLines={numberOfLines}
        className={`rounded-md border p-2 ${multiline ? 'min-h-[120px]' : ''} ${invalid ? 'border-red-500' : 'border-gray-300'}`}
      />
    </View>
  );
};
