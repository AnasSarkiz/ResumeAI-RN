import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { useResume } from '../context/ResumeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { exportResumeToPDF } from '../services/pdf';
import { SubscriptionLock } from './SubscriptionLock';

export const ExportPDFButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { currentResume } = useResume();
  const { isPro } = useSubscription();

  const handleExport = async () => {
    if (!isPro) {
      Alert.alert('Pro Feature', 'Upgrade to Pro to export resumes as PDF');
      return;
    }

    if (!currentResume) {
      Alert.alert('Error', 'No resume selected');
      return;
    }

    setLoading(true);
    try {
      const pdfPath = await exportResumeToPDF(currentResume);
      await Share.share({
        url: `file://${pdfPath}`,
        title: `Resume - ${currentResume.title}`,
      });
    } catch (error) {
      console.error('PDF export failed:', error);
      Alert.alert('Error', 'Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={handleExport}
        disabled={loading}
        className="flex-row items-center justify-center rounded-full bg-green-500 px-4 py-2">
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="mr-2 font-medium text-white">Export PDF</Text>
          </>
        )}
      </TouchableOpacity>
      {!isPro && <SubscriptionLock />}
    </View>
  );
};
