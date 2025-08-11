import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import * as Sharing from 'expo-sharing';
import { exportResumeToPDF } from '../../services/pdf';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Resume } from 'types/resume';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { resumes, loading, loadResumes, createResume, deleteResume } = useResume();
  const isPro = user?.isPro;
  console.log(resumes)
  const router = useRouter();
  const [exportingId, setExportingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadResumes(user.id);
    }
  }, [user]);

  const handleCreateResume = async () => {
    try {
      const newResume = await createResume(user?.id || '', `My Resume ${resumes.length + 1}`);
      if (newResume?.id) {
        router.push(`/resume/editor?id=${newResume.id}`);
      }
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  };

  const handleDelete = (resumeId: string) => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete this resume? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteResume(resumeId);
            } catch (e) {
              console.error('Failed to delete resume:', e);
              Alert.alert('Delete failed', 'There was a problem deleting your resume.');
            }
          },
        },
      ]
    );
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

  const EmptyState = () => (
    <View className="flex-1 items-center justify-center px-4">
      {/* <Image
        source={require('../../assets/empty-resume.png')}
        style={{ width: 220, height: 220 }}
        resizeMode="contain"
      /> */}
      <Text className="mt-4 text-lg font-semibold text-gray-700">No resumes yet</Text>
      <Text className="text-center text-gray-500 mb-6">
        Create your first resume manually or let AI craft it for you in seconds.
      </Text>
      <View className="w-full space-y-3">
        <TouchableOpacity
          onPress={() => (isPro ? router.push('/resume/create-ai') : router.push('/(main)/subscribe'))}
          className="flex-row items-center justify-center rounded-full py-4 shadow-lg">
                   <LinearGradient
                colors={['#a855f7', '#6366f1']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 52 , width: '100%', borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
              >
          <Ionicons className='absolute -left-1 -top-1 overflow-hidden' name="sparkles" size={36} color="gold" />
          <Text className="ml-2 text-center font-semibold text-white">✨ Create with AI</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/resume/create-manual')}
          className="flex-row items-center justify-center rounded-full border border-blue-500 bg-white py-4">
          <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
          <Text className="ml-2 text-center font-medium text-blue-500">Create Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ResumeCard = ({ item }: { item: Resume }) => (
    <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            Updated {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
          {!isPro && (
            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="lock" size={14} color="red" />
              <Text className="ml-1 text-xs text-red-500">Upgrade to Pro to unlock more features</Text>
            </View>
          )}
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2">
        <TouchableOpacity
          onPress={() => router.push(`/resume/editor?id=${item.id}`)}
          className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 bg-blue-600`}>
          <Ionicons name="create-outline" size={16} color="white" />
          <Text className="ml-1 font-medium text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/resume/preview?id=${item.id}`)}
          className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 bg-blue-600`}>
          <Ionicons name="eye-outline" size={16} color="white" />
          <Text className="ml-1 font-medium text-white">Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleExport(item.id)}
          className="flex-1 flex-row items-center justify-center rounded-md bg-emerald-600 px-3 py-2">
          {exportingId === item.id ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="download-outline" size={16} color="white" />
              <Text className="ml-1 font-medium text-white">Export</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="flex-row items-center justify-center rounded-md bg-red-600 px-3 py-2">
          <Ionicons name="trash-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-gray-800">My Resumes</Text>
        <Link href="/(main)/profile" asChild>
          <TouchableOpacity className="flex-row items-center space-x-2">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-400 shadow-md">
              <Text className="text-lg font-semibold text-white">
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
        <EmptyState />
      ) : (
        <>
          <FlatList
            data={resumes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ResumeCard item={item} />}
            showsVerticalScrollIndicator={false}
          />

          <View className="mt-4 ">
            <TouchableOpacity
              onPress={() => router.push('/resume/create-manual')}
              className="flex-row items-center justify-center rounded-lg border-2 border-dashed border-blue-500 py-4">
              <Ionicons name="add" size={20} color="#3B82F6" />
              <Text className="ml-2 text-base font-semibold text-blue-600">Create Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity className=" h-20 rounded-xl py-2 overflow-hidden shadow-lg" onPress={() => (isPro ? router.push('/resume/create-ai') : router.push('/(main)/subscribe'))} >
              <LinearGradient
                colors={['#a855f7', '#6366f1']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 52 , borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
              >
                <Ionicons className='absolute left-0 top-0 overflow-hidden' name="sparkles" size={36} color="gold" />
                <Text className=" font-semibold text-white text-xl text-center">✨ Create with AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}