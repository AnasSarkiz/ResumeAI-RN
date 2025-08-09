import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { EditableTextInput } from '../../components/EditableTextInput';
import { SubscriptionLock } from '../../components/SubscriptionLock';

export default function CoverLetterScreen() {
  const { id } = useLocalSearchParams();
  const { currentResume, currentCoverLetter, generateCoverLetter, loading } = useResume();
  const { isPro } = useSubscription();
  const [company, setCompany] = useState(currentCoverLetter?.company || '');
  const [position, setPosition] = useState(currentCoverLetter?.position || '');
  const [content, setContent] = useState(currentCoverLetter?.content || '');

  const handleGenerate = async () => {
    if (!isPro) {
      Alert.alert('Pro Feature', 'Upgrade to Pro to generate cover letters');
      return;
    }

    if (!currentResume) return;

    try {
      const generatedLetter = await generateCoverLetter(currentResume.id, company, position);
      setContent(generatedLetter.content);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate cover letter');
    }
  };

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        <View className="mb-6 rounded-lg bg-white p-4">
          <Text className="mb-4 text-lg font-bold">Cover Letter Details</Text>

          <EditableTextInput
            label="Company Name"
            value={company}
            onChange={setCompany}
            placeholder="Acme Inc."
          />

          <EditableTextInput
            label="Position"
            value={position}
            onChange={setPosition}
            placeholder="Software Engineer"
          />

          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!isPro}
            className={`rounded-full py-3 ${!isPro ? 'bg-gray-300' : 'bg-blue-500'}`}>
            <Text className="text-center font-medium text-white">
              {isPro ? 'Generate Cover Letter' : 'Upgrade to Pro to Generate'}
            </Text>
          </TouchableOpacity>

          {!isPro && <SubscriptionLock />}
        </View>

        <View className="rounded-lg bg-white p-4">
          <Text className="mb-2 text-lg font-bold">Cover Letter Content</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Write or generate your cover letter here..."
            className="min-h-[300px] text-gray-800"
          />
        </View>
      </ScrollView>
    </View>
  );
}
