import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import * as Sharing from 'expo-sharing';
import { exportResumeToPDF } from '../../services/pdf';


export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { resumes, loading, loadResumes, createResume } = useResume();
  // const { isPro } = useSubscription();
  const isPro = user?.isPro;

  const router = useRouter();
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadResumes(user.id);
    }
  }, [user]);

  const handleCreateResume = async () => {
    if (!isPro && resumes.length >= 1) {
      alert(
        'Limit Reached \n Free users can only create 1 resume. Upgrade to Pro for unlimited resumes.'
      );
      return;
    }

    try {
      const newResume = await createResume(user?.id || '', `My Resume ${resumes.length + 1}`);
      if (newResume?.id) {
        router.push(`/resume/editor?id=${newResume.id}`);
      }
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleExport = async (resumeId: string) => {
    try {
      const res = resumes.find((r) => r.id === resumeId);
      if (!res) return;
      setExportingId(resumeId);
      const uri = await exportResumeToPDF(res as any);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Exported', `PDF saved at: ${uri}`);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Export failed', 'There was a problem exporting your PDF.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">My Resumes</Text>
        <Link href="/(main)/profile" asChild>
          <TouchableOpacity>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
              <Text className="font-medium text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : resumes.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-gray-500">No resumes yet</Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => router.push('/resume/ai-generator')}
              className="rounded-full text-black px-6 py-3">
              <Text className="text-center font-semibold text-white">✨ Create with AI</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreateResume}
              className="rounded-full border border-blue-500 bg-white px-6 py-3">
              <Text className="text-center font-medium text-blue-500">Create Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={resumes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <View className="mb-3 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>{item.title}</Text>
                    <Text className="mt-1 text-xs text-gray-500">
                      Updated {new Date(item.updatedAt).toLocaleDateString()}
                    </Text>
                    {!isPro && <Text className="mt-1 text-xs text-red-500">Upgrade to Pro to unlock more features</Text>}
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    disabled={!isPro}
                    onPress={() => router.push(`/resume/editor?id=${item.id}`)}
                    className={`flex-1 rounded-md px-3 py-2 ${isPro ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <Text className="text-center font-medium text-white">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={!isPro}
                    onPress={() => router.push(`/resume/preview?id=${item.id}`)}
                    className={`flex-1 rounded-md px-3 py-2 ${isPro ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <Text className="text-center font-medium text-white">Preview</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleExport(item.id)}
                    className="flex-1 rounded-md bg-emerald-600 px-3 py-2"
                  >
                    {exportingId === item.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center font-medium text-white">Export PDF</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            className="mb-4"
          />
          <View className="space-y-3">

       
            <TouchableOpacity
              onPress={handleCreateResume}
              className="items-center rounded-lg my-2 border-2 border-dashed border-blue-500 py-4">
              <Text className="text-base font-semibold text-blue-600">+ Create Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/resume/ai-generator')}
              className="items-center rounded-lg my-2 bg-blue-500 py-4">
                <Text className="text-base font-semibold text-white">✨ Create with AI</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
