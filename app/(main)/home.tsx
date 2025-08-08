import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import {ResumeSectionCard} from '../../components/ResumeSectionCard';
import { SubscriptionLock } from '../../components/SubscriptionLock';
import { useSubscription } from '../../context/SubscriptionContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { resumes, loading, loadResumes, createResume } = useResume();
  const { isPro } = useSubscription();

  useEffect(() => {
    if (user) {
      loadResumes(user.id);
    }
  }, [user]);

  const handleCreateResume = async () => {
    if (!isPro && resumes.length >= 1) {
      alert('Limit Reached \n Free users can only create 1 resume. Upgrade to Pro for unlimited resumes.');
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
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-800">My Resumes</Text>
        <Link href="/(main)/profile" asChild>
          <TouchableOpacity>
            <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white font-medium">
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
          <Text className="text-gray-500 mb-4">No resumes yet</Text>
          <TouchableOpacity
            onPress={handleCreateResume}
            className="bg-blue-500 py-2 px-6 rounded-full"
          >
            <Text className="text-white font-medium">Create First Resume</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={resumes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link href={`/resume/editor?id=${item.id}`} asChild>
                <TouchableOpacity>
                  <View className="relative">
                    <ResumeSectionCard 
                      title={item.title} 
                      active={false}
                      onPress={() => {}}
                    />
                    {!isPro && <SubscriptionLock />}
                  </View>
                </TouchableOpacity>
              </Link>
            )}
            className="mb-4"
          />
          
          <TouchableOpacity
            onPress={handleCreateResume}
            className="border-2 border-dashed border-blue-500 py-3 rounded-lg items-center"
          >
            <Text className="text-blue-500 font-medium">+ New Resume</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}