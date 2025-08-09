import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Link, useRouter} from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { ResumeSectionCard } from '../../components/ResumeSectionCard';
import { SubscriptionLock } from '../../components/SubscriptionLock';
import { useSubscription } from '../../context/SubscriptionContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { resumes, loading, loadResumes, createResume } = useResume();
  const { isPro } = useSubscription();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadResumes(user.id);
      console.log('user', user);
      
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
      await createResume(user?.id || '', `My Resume ${resumes.length + 1}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
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
          <TouchableOpacity
            onPress={handleCreateResume}
            className="rounded-full bg-blue-500 px-6 py-2">
            <Text className="font-medium text-white">Create First Resume</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={resumes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity className='py-2'>
                  <View className="relative">
                    <ResumeSectionCard title={item.title} active={false} onPress={() => {router.push(`/resume/editor?id=${item.id}`)}} />
                    {!isPro && <SubscriptionLock />}
                  </View>
                </TouchableOpacity>
            )}
            className="mb-4"
          />

          <TouchableOpacity
            onPress={handleCreateResume}
            className="items-center rounded-lg border-2 border-dashed border-blue-500 py-3">
            <Text className="font-medium text-blue-500">+ New Resume</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
