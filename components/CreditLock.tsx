import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCredits } from '../context/CreditBalanceContext';
import { PurchaseCreditsModal } from './PurchaseCreditsModal';

export const CreditLock: React.FC<{ required?: number; message?: string }> = ({
  required = 1,
  message,
}) => {
  const { balance } = useCredits();
  const [open, setOpen] = useState(false);

  if (balance >= required) return null;

  return (
    <View className="absolute inset-0 items-center justify-center rounded-xl bg-white/70 dark:bg-black/40">
      <View className="mx-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <Text className="mb-1 text-center text-base font-semibold text-gray-900">
          Not enough Career Credits
        </Text>
        <Text className="mb-3 text-center text-sm text-gray-600">
          {message || `This action requires ${required} credit${required === 1 ? '' : 's'}.`}
        </Text>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          className="rounded-full bg-primary-600 px-4 py-2">
          <Text className="text-center font-semibold text-white">Buy Credits</Text>
        </TouchableOpacity>
      </View>
      <PurchaseCreditsModal visible={open} onClose={() => setOpen(false)} />
    </View>
  );
};
