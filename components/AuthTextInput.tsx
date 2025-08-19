import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface AuthTextInputProps extends TextInputProps {
  label: string;
  errorText?: string | null;
}

const AuthTextInput: React.FC<AuthTextInputProps> = ({ label, errorText, ...rest }) => {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      <TextInput
        {...rest}
        className="rounded-xl border border-gray-300 bg-white/90 p-3 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100"
      />
      {errorText ? (
        <Text className="mt-1 text-xs text-red-700 dark:text-red-300">{errorText}</Text>
      ) : null}
    </View>
  );
};

export default AuthTextInput;
