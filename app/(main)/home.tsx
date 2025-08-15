import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import * as Sharing from 'expo-sharing';
import { exportResumeToPDF } from '../../services/pdf';
import { renderHTMLTemplate, TemplateId } from '../../services/templates';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SavedResume } from 'types/resume';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { resumes, loading, loadResumes, createResume, deleteResume } = useResume();
  const isPro = user?.isPro;
  const router = useRouter();
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Load WebView lazily to avoid issues if not installed
  let WebViewComp: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WebViewComp = require('react-native-webview').WebView;
  } catch (e) {
    WebViewComp = null;
  }

  useEffect(() => {
    if (user) {
      loadResumes(user.id);
    }
  }, [user]);

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
  function enforceFixedViewport(html: string): string {
    if (!html) return html;
  
    const FIXED_META = `
    <meta name="viewport" content="width=794, initial-scale=0.42, user-scalable=false" />
  `;
  
    const FIXED_STYLE = '<style id="fixed-a4-reset">html, body { margin:0; padding:0; background:#f3f3f3; -webkit-text-size-adjust:100%; }</style>';
  
    // Replace existing viewport meta if present
    let out = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, FIXED_META);
  
    // If no viewport meta existed, inject one into <head>
    if (!/name=["']viewport["']/i.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_META}`);
    }
  
    // Inject reset style early in <head> (idempotent)
    if (!/id=["']fixed-a4-reset["']/.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_STYLE}`);
    }
  
    return out;
  }
  const handleExport = async (resumeId: string) => {
    try {
      const res = resumes.find((r) => r.id === resumeId);
      if (!res) return;
      setExportingId(resumeId);
      // const tpl = (res as any).template as TemplateId | undefined;
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
      <Text className="mt-4 text-lg font-semibold text-gray-700">No resumes yet</Text>
      <Text className="text-center text-gray-500 mb-6">
        Create your first resume manually or let AI craft it for you in seconds.
      </Text>
      <View className="w-full space-y-3">
        <TouchableOpacity
          onPress={() => (isPro ? router.push('/resume/ai-generator') : router.push('/(main)/subscribe'))}
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
          onPress={() => (isPro ? router.push('/resume/editor') : router.push('/(main)/subscribe'))}
          className="flex-row items-center justify-center rounded-full border border-blue-500 bg-white py-4">
          <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
          <Text className="ml-2 text-center font-medium text-blue-500">Create Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ResumeCard = ({ item, index = 0 }: { item: SavedResume; index?: number }) => {
    const html = item.html;
    // Compute preview height using A4 aspect ratio (~1:1.414) based on available card width
    const screenWidth = Dimensions.get('window').width;
    // Page has outer padding 16 and card has inner padding 16
    const previewWidth = Math.max(0, screenWidth - 32 - 32);
    const previewHeight = Math.round(previewWidth * 1.414);
    return (
      <View className="mb-4  rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900">{item.title}</Text>
            <Text className="text-xs text-gray-600">Updated {item.updatedAt?.toLocaleDateString?.() || ''}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)} className="absolute right-0 top-0 rounded-full bg-red-50 p-2">
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/resume/preview', params: { id: String(item.id)} })}
          className="mb-3 overflow-hidden rounded-lg"
          style={{ height: previewHeight, backgroundColor: '#fff' }}
        >
          <WebViewComp originWhitelist={["*"]} source={{ html: enforceFixedViewport(html) }} style={{ flex: 1 }} scrollEnabled={false} />
        </TouchableOpacity>

        <View className="flex-row flex-wrap gap-2">
          {/* <TouchableOpacity
            onPress={onManualEdit}
            className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 ${isAI ? 'bg-gray-300' : 'bg-blue-600'}`}>
            <Ionicons name="create-outline" size={16} color={isAI ? '#6b7280' : 'white'} />
            <Text className={`ml-1 font-medium ${isAI ? 'text-gray-600' : 'text-white'}`}>Edit</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => (isPro ? router.push(`/resume/ai-edit?id=${item.id}`) : router.push('/(main)/subscribe'))}
            className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 bg-purple-600`}> 
            <Text className="-ml-1 font-medium text-white">✨ AI-Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/resume/manual-edit?id=${item.id}`)}
            className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 bg-amber-600`}>
            <Ionicons name="create-outline" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">Manual Edit</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => router.push({ pathname: '/resume/preview', params: { id: String(item.id), template: String(tpl || 'classic') } })}
            className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 bg-blue-600`}>
            <Ionicons name="eye-outline" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">Preview</Text>
          </TouchableOpacity> */}
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
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#f9f9f9] p-4">
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
            renderItem={({ item, index }) => <ResumeCard item={item} index={index} />}
            showsVerticalScrollIndicator={false}
          />

          <View className="mt-4 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.push('/resume/editor')}
              className="flex-row w-[48%] items-center justify-center rounded-lg border-2 border-dashed border-blue-500 py-4">
              <Ionicons name="add" size={20} color="#3B82F6" />
              <Text className="ml-2 text-base font-semibold text-blue-600">Create Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] rounded-xl py-2 overflow-hidden " onPress={() => (isPro ? router.push('/resume/ai-generator') : router.push('/(main)/subscribe'))} >
              <LinearGradient
                colors={['#a855f7', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 52 , borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
              >
                <Ionicons className='absolute left-0 top-0 overflow-hidden' name="sparkles" size={16} color="gold" />
                <Text className="-ml-4 font-semibold text-white text-xl text-center">✨ Create with AI</Text>
              </LinearGradient>
            </TouchableOpacity>
            </View>
        </>
      )}
    </View>
  );
}