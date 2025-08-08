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
        className={`py-2 px-4 rounded-full ${disabled ? 'bg-gray-300' : 'bg-purple-500'}`}
      >
        <Text className="text-white font-medium">Select AI Action</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white p-4 rounded-t-lg max-h-[70%]">
            <Text className="text-lg font-bold mb-4">Select an AI Action</Text>
            
            <FlatList
              data={prompts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.id);
                    setModalVisible(false);
                  }}
                  className="py-3 border-b border-gray-200"
                >
                  <Text className="font-medium">{item.title}</Text>
                  <Text className="text-gray-600 text-sm">{item.description}</Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 py-2 bg-gray-200 rounded-full"
            >
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};