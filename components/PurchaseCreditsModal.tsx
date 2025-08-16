import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCredits } from '../context/CreditBalanceContext';
import { CREDIT_BUNDLES, type CreditBundleId } from '../services/credits';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const PurchaseCreditsModal: React.FC<Props> = ({ visible, onClose }) => {
  const { openPurchase, loading } = useCredits();
  const [selected, setSelected] = useState<CreditBundleId>('bundle_10');

  const bundles = useMemo(
    () =>
      Object.entries(CREDIT_BUNDLES) as [CreditBundleId, (typeof CREDIT_BUNDLES)[CreditBundleId]][],
    []
  );

  const handleBuy = async () => {
    try {
      await openPurchase(selected);
      onClose();
    } catch (e) {
      // error surfaced by context
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-end bg-black/40">
        <View className="w-full rounded-t-2xl bg-white p-4">
          <View className="mb-3 items-center">
            <Text className="text-xl font-bold text-gray-900">Buy Career Credits</Text>
            <Text className="mt-1 text-center text-gray-600">
              Pay-as-you-go. No subscription. Credits sync across devices.
            </Text>
          </View>

          <View className="mb-4">
            {bundles.map(([id, def]) => (
              <TouchableOpacity
                key={id}
                onPress={() => setSelected(id)}
                className={`mb-3 rounded-xl border p-4 ${selected === id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                accessibilityRole="button"
                accessibilityLabel={`Select bundle ${def.label}`}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-base font-semibold text-gray-900">{def.label}</Text>
                    <Text className="text-xs text-gray-500">
                      Best for{' '}
                      {id === 'bundle_10'
                        ? 'trying features'
                        : id === 'bundle_30'
                          ? 'regular usage'
                          : 'power users'}
                    </Text>
                  </View>
                  <Text className="text-base font-bold text-indigo-700">
                    ${def.price.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleBuy}
            disabled={loading}
            className={`mb-2 flex-row items-center justify-center rounded-full py-3 ${loading ? 'bg-gray-300' : 'bg-indigo-600'}`}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-semibold text-white">Buy with Apple</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} className="items-center py-3">
            <Text className="font-medium text-gray-700">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
