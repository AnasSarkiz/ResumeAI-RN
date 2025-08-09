import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

interface PromptSelectorProps {
  prompts: { id: string; title: string; description: string }[];
  onSelect: (promptId: string) => void;
  disabled?: boolean;
}

export const PromptSelector: React.FC<PromptSelectorProps> = ({
  prompts,
  onSelect,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={disabled}
        className={`rounded-full px-4 py-2 ${disabled ? 'bg-gray-300' : 'bg-purple-500'}`}>
        <Text className="font-medium text-white">Select AI Action</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="max-h-[70%] rounded-t-lg bg-white p-4">
            <Text className="mb-4 text-lg font-bold">Select an AI Action</Text>

            <FlatList
              data={prompts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.id);
                    setModalVisible(false);
                  }}
                  className="border-b border-gray-200 py-3">
                  <Text className="font-medium">{item.title}</Text>
                  <Text className="text-sm text-gray-600">{item.description}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 rounded-full bg-gray-200 py-2">
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
