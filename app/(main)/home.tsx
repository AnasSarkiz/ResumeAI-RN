import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  AppState,
  AppStateStatus,
  FlatList,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import * as Sharing from 'expo-sharing';
import { exportResumeToPDF } from '../../services/pdf';
import { Ionicons } from '@expo/vector-icons';
import { SavedResume } from 'types/resume';
import { LinearGradient } from 'expo-linear-gradient';
import { useNetwork } from '../../context/NetworkContext';
import PageHeader from '../../components/PageHeader';
import AppButton from '../../components/AppButton';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { isOnline } = useNetwork();
  const {
    resumes,
    loading,
    loadResumes,
    createResume,
    deleteResume,
    subscribeResumes,
    updateResume,
  } = useResume();
  const router = useRouter();
  const [exportingId, setExportingId] = useState<string | null>(null);
  const EXPORT_ONLY = !isOnline;

  // Load WebView lazily to avoid issues if not installed
  let WebViewComp: any = null;
  try {
    WebViewComp = require('react-native-webview').WebView;
  } catch (e) {
    WebViewComp = null;
  }

  // Initial cache-first load (in case subscription delays or offline)
  useEffect(() => {
    if (user) {
      loadResumes(user.id);
    }
  }, [user]);

  // Real-time subscription when screen is focused; also pause on background
  useFocusEffect(
    React.useCallback(() => {
      if (!user?.id) return () => {};
      let unsub: (() => void) | null = subscribeResumes(user.id);

      const handleAppState = (state: AppStateStatus) => {
        if (state !== 'active') {
          // pause
          if (unsub) {
            unsub();
            unsub = null;
          }
        } else if (!unsub && user?.id) {
          // resume
          unsub = subscribeResumes(user.id);
        }
      };

      const sub = AppState.addEventListener('change', handleAppState);
      return () => {
        sub.remove();
        if (unsub) unsub();
      };
    }, [user?.id])
  );

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
  const handleRename = (resumeId: string, currentTitle: string) => {
    // iOS-only app: use Alert.prompt directly
    // @ts-ignore - RN types may not include prompt on Alert for some versions
    Alert.prompt(
      'Rename Resume',
      'Enter a new name for your resume:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (text?: string) => {
            const title = (text || '').trim();
            if (!title || title === currentTitle) return;
            try {
              await updateResume(resumeId, { title });
            } catch (e) {
              Alert.alert('Rename failed', 'Could not rename the resume. Please retry.');
            }
          },
        },
      ],
      'plain-text',
      currentTitle
    );
  };
  function enforceFixedViewport(html: string): string {
    if (!html) return html;

    const FIXED_META = `
    <meta name="viewport" content="width=794, initial-scale=0.42, user-scalable=false" />
  `;

    const FIXED_STYLE =
      '<style id="fixed-a4-reset">html, body { margin:0; padding:0; background:#f3f3f3; -webkit-text-size-adjust:100%; }</style>';

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
      <Text className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        {EXPORT_ONLY ? 'No resumes available to export' : 'No resumes yet'}
      </Text>
      <Text className="mb-6 text-center text-gray-500 dark:text-gray-400">
        {EXPORT_ONLY
          ? 'You are offline. Only export is available.'
          : 'Create your first resume manually or let AI craft it for you in seconds.'}
      </Text>
      {!EXPORT_ONLY && (
        <View className="w-full space-y-3">
          <AppButton
            title="✨ Create with AI"
            onPress={() => router.push('/resume/ai-generator')}
          />
          <AppButton
            title="Create Manually"
            variant="secondary"
            onPress={() => router.push('/resume/editor')}
          />
        </View>
      )}
    </View>
  );

  const ResumeCard = ({ item, index = 0 }: { item: SavedResume; index?: number }) => {
    const html = item.html;
    const [previewLoading, setPreviewLoading] = useState<boolean>(true);
    // If the resume HTML or updatedAt changes, trigger loading state again
    useEffect(() => {
      setPreviewLoading(true);
    }, [html, item.updatedAt]);
    // Compute preview height using A4 aspect ratio (~1:1.414) based on available card width
    const screenWidth = Dimensions.get('window').width;
    // Page has outer padding 16 and card has inner padding 16
    const previewWidth = Math.max(0, screenWidth - 32 - 32);
    const previewHeight = Math.round(previewWidth * 1.414);
    return (
      <View className="mb-4  rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {item.title}
            </Text>
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              Updated {item.updatedAt?.toLocaleDateString?.() || ''}
            </Text>
          </View>
          {/* Header actions: rename and delete (hidden when offline) */}
          {!EXPORT_ONLY && (
            <>
              <TouchableOpacity
                onPress={() => handleRename(item.id, item.title)}
                className="absolute right-10 top-0 rounded-full bg-blue-50 p-2">
                <Ionicons name="create-outline" size={18} color="#25439A" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="absolute right-0 top-0 rounded-full bg-red-50 p-2">
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {EXPORT_ONLY ? (
          <View
            className="mb-3 overflow-hidden rounded-lg"
            style={{ height: previewHeight, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, position: 'relative' }}>
              <WebViewComp
                originWhitelist={['*']}
                source={{ html: enforceFixedViewport(html || '') }}
                style={{ flex: 1 }}
                scrollEnabled={false}
                onLoadStart={() => setPreviewLoading(true)}
                onLoadEnd={() => setPreviewLoading(false)}
              />
              {previewLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                  }}>
                  <ActivityIndicator size="small" color="#25439A" />
                </View>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({ pathname: '/resume/preview', params: { id: String(item.id) } })
            }
            className="mb-3 overflow-hidden rounded-lg"
            style={{ height: previewHeight, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, position: 'relative' }}>
              <WebViewComp
                originWhitelist={['*']}
                source={{ html: enforceFixedViewport(html || '') }}
                style={{ flex: 1 }}
                scrollEnabled={false}
                onLoadStart={() => setPreviewLoading(true)}
                onLoadEnd={() => setPreviewLoading(false)}
              />
              {previewLoading && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                  }}>
                  <ActivityIndicator size="small" color="#25439A" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        <View className="flex-row flex-wrap gap-2">
          {/* <TouchableOpacity
            onPress={onManualEdit}
            className={`flex-1 flex-row items-center justify-center rounded-md px-3 py-2 ${isAI ? 'bg-gray-300' : 'bg-blue-600'}`}>
            <Ionicons name="create-outline" size={16} color={isAI ? '#6b7280' : 'white'} />
            <Text className={`ml-1 font-medium ${isAI ? 'text-gray-600' : 'text-white'}`}>Edit</Text>
          </TouchableOpacity> */}
          {!EXPORT_ONLY && (
            <>
              <TouchableOpacity
                onPress={() => router.push(`/resume/ai-edit?id=${item.id}`)}
                className={`flex-1 flex-row items-center justify-center rounded-md bg-[#2543aA] px-3 py-2`}>
                <Text className="-ml-1 font-medium text-white">✨ AI-Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push(`/resume/manual-edit?id=${item.id}`)}
                className={`flex-1 flex-row items-center justify-center rounded-md bg-amber-600 px-3 py-2`}>
                <Ionicons name="create-outline" size={16} color="white" />
                <Text className="ml-1 font-medium text-white">Manual Edit</Text>
              </TouchableOpacity>
            </>
          )}
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
    <View className="flex-1 bg-gray-50 p-4 dark:bg-gray-900">
      {/* Header */}
      <PageHeader
        title="My Resumes"
        subtitle={
          !EXPORT_ONLY ? 'Create, refine and export your resumes' : 'Offline mode: export only'
        }
        avatar={
          !EXPORT_ONLY
            ? {
                text: (user?.name?.charAt(0) ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  'U') as string,
                onPress: () => router.push('/(main)/profile'),
              }
            : undefined
        }
      />

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
            renderItem={({ item, index }: { item: SavedResume; index: number }) => (
              <ResumeCard item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
          />

          {isOnline && (
            <View className="my-1 h-[8%] flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push('/resume/editor')}
                className="h-[75%] w-[48%] flex-row items-center justify-center rounded-lg border-2 border-dashed border-primary py-2 dark:border-primary-400">
                <Ionicons name="add" size={20} color="#25439A" />
                <Text className="ml-2 text-base font-semibold text-primary dark:text-primary-300">
                  Create Manually
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="h-[100%] w-[48%] overflow-hidden rounded-xl py-2 "
                onPress={() => router.push('/resume/ai-generator')}>
                <LinearGradient
                  colors={['#25439A', '#3D92C4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: '100%',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Ionicons
                    className="absolute left-0 top-0 overflow-hidden"
                    name="sparkles"
                    size={16}
                    color="gold"
                  />
                  <Text className="-ml-4 text-center text-xl font-semibold text-white">
                    ✨ Create with AI
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
