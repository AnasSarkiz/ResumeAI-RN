import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}) => {
  const base = 'rounded-full py-3';
  const isPrimary = variant === 'primary';
  const cls = isPrimary
    ? `${base} bg-primary-600 dark:bg-primary-500`
    : `${base} border border-primary-600 dark:border-primary-400`;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading || disabled}
      className={`${cls} opacity-100 disabled:opacity-60`}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : undefined} />
      ) : (
        <Text
          className={
            isPrimary
              ? 'text-center text-lg font-medium text-white'
              : 'text-center text-lg font-medium text-primary-600 dark:text-primary-400'
          }>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
