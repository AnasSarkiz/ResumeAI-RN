import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { EditableTextInput } from '../../components/EditableTextInput';
import { editHTMLResume } from '../../services/ai';
import { renderHTMLTemplate, TemplateId } from '../../services/templates';
import { SavedResume } from 'types/resume';

export default function AIHtmlEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const isPro = user?.isPro;
  const { currentResume, loadResume, updateResume, loading } = useResume();
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [versions, setVersions] = useState<Array<{ id: string; html: string; label: string; ts: number; instr?: string }>>([]);

  // Lazy WebView import (avoid crash if not installed)
  let WebViewComp: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WebViewComp = require('react-native-webview').WebView;
  } catch {}

  useEffect(() => {
    if (!isPro) {
      router.replace('/(main)/subscribe');
      return;
    }
    if (id && typeof id === 'string') {
      loadResume(id);
    }
  }, [id, isPro]);

  // Prevent leaving screen with unsaved AI edits (gesture back, header back, hardware back)
  useEffect(() => {
    const hasUnsaved = !!editedHtml;
    const onAttemptLeave = (proceed: () => void) => {
      if (!hasUnsaved) { proceed(); return; }
      Alert.alert('Unsaved AI edits', 'Save or discard your AI edits before leaving.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard', style: 'destructive', onPress: () => {
            setEditedHtml('');
            proceed();
          }
        },
        {
          text: 'Save', onPress: async () => {
            try {
              await onSave();
              proceed();
            } catch {}
          }
        }
      ]);
    };

    const sub = navigation.addListener('beforeRemove', (e: any) => {
      if (!hasUnsaved) return; // allow navigation
      e.preventDefault();
      onAttemptLeave(() => navigation.dispatch(e.data.action));
    });

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!hasUnsaved) return false; // allow default
      onAttemptLeave(() => router.back());
      return true; // we handled it
    });

    return () => {
      sub && sub();
      backSub.remove();
    };
  }, [navigation, router, editedHtml]);

  const enforceFixedViewport = (html: string): string => {
    if (!html) return html;
    const FIXED_META = `\n    <meta name="viewport" content="width=794, initial-scale=0.42, user-scalable=false" />\n  `;
    const FIXED_STYLE = '<style id="fixed-a4-reset">html, body { margin:0; padding:0; background:#f3f3f3; -webkit-text-size-adjust:100%; }</style>';
    let out = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, FIXED_META);
    if (!/name=["']viewport["']/i.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_META}`);
    }
    if (!/id=["']fixed-a4-reset["']/.test(out)) {
      out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_STYLE}`);
    }
    return out;
  };

  const baseHtml = useMemo(() => {
    if (!currentResume) return '';
    return enforceFixedViewport(currentResume.html);
  }, [currentResume]);

  const htmlToPreview = editedHtml ? enforceFixedViewport(editedHtml) : baseHtml;

  // Initialize versions with the original snapshot once resume is loaded
  useEffect(() => {
    if (baseHtml && versions.length === 0) {
      setVersions([{ id: 'original', html: baseHtml, label: 'Original', ts: Date.now() }]);
    }
  }, [baseHtml]);

  const selectVersion = (id: string) => {
    const v = versions.find((x) => x.id === id);
    if (!v) return;
    // If Original selected, show baseHtml (clears edited state)
    if (id === 'original') {
      setEditedHtml('');
    } else {
      setEditedHtml(v.html);
    }
  };

  const onApply = async () => {
    if (!currentResume) return;
    if (!instructions.trim()) {
      Alert.alert('Add instructions', 'Please describe what you want to change.');
      return;
    }
    setSubmitting(true);
    try {
      const sourceHtml = editedHtml || baseHtml;
      const newHtml = await editHTMLResume(sourceHtml, instructions);
      const versionId = `${Date.now()}`;
      const next = { id: versionId, html: newHtml, label: `v${versions.length}`, ts: Date.now(), instr: instructions.trim() };
      setVersions((prev) => [...prev, next]);
      setEditedHtml(newHtml);
      setInstructions('');
      Alert.alert('Edits ready', 'Review the preview below. Tap Save to apply changes to your resume.');
    } catch (e) {
      console.error(e);
      Alert.alert('Edit failed', 'There was a problem applying your edits.');
    } finally {
      setSubmitting(false);
    }
  };

  const onSave = async () => {
    if (!currentResume || !editedHtml) return;
    setSaving(true);
    try {
      await updateResume(currentResume.id, {
        ...currentResume,
        html: editedHtml,
        updatedAt: new Date(),
      } as SavedResume);
      router.replace({ pathname: '/resume/preview', params: { id: String(currentResume.id) } });
      setInstructions('');
      setEditedHtml('');
    } catch (e) {
      console.error(e);
      Alert.alert('Save failed', 'There was a problem saving your AI edits.');
    } finally {
      setSaving(false);
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
    <View className="flex-1 bg-[#f9f9f9]">
      <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">AI Edit</Text>
        <View className="flex-row items-center">
          {editedHtml ? (
            <TouchableOpacity onPress={onSave} disabled={saving} className={`mr-2 rounded-md px-3 py-2 ${saving ? 'bg-blue-300' : 'bg-blue-600'}`}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Save & Exit</Text>}
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              if (editedHtml) {
                Alert.alert('Discard AI edits?', 'Your unsaved AI edits will be lost.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Discard', style: 'destructive', onPress: () => router.back() },
                ]);
              } else {
                router.back();
              }
            }}
            className="rounded-md bg-gray-200 px-3 py-2">
            <Text className="text-gray-700">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="mb-2 text-sm text-gray-500">Preview</Text>
        <View className="mb-4 h-[520px] overflow-hidden rounded-lg bg-white">
          {WebViewComp ? (
            <WebViewComp originWhitelist={["*"]} source={{ html: htmlToPreview }} style={{ flex: 1 }} scrollEnabled={true} />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">WebView not installed</Text>
            </View>
          )}
        </View>

        {versions.some(v => v.id !== 'original') && (
          <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <Text className="mb-2 text-sm font-medium text-gray-700">AI Edit Chat</Text>
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator>
              {versions.map((v) => {
                const isOriginal = v.id === 'original';
                const isSelected = (isOriginal && !editedHtml) || (!isOriginal && editedHtml && v.html === editedHtml);
                return (
                  <View key={v.id} className="mb-3">
                    {!isOriginal && v.instr ? (
                      <View className="mb-2 self-end max-w-[90%] rounded-2xl bg-indigo-50 px-3 py-2">
                        <Text className="text-indigo-900">{v.instr}</Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      onPress={() => selectVersion(v.id)}
                      className={`rounded-xl border px-3 py-2 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="font-medium text-gray-800">{isOriginal ? 'Original' : v.label}</Text>
                        <Text className="text-xs text-gray-500">{new Date(v.ts).toLocaleTimeString()}</Text>
                      </View>
                      <Text className="mt-1 text-xs text-gray-500">Tap to use this version</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Describe your edits</Text>
          <EditableTextInput
            label="Instructions"
            value={instructions}
            onChange={setInstructions}
            multiline
            placeholder="e.g., Make header two-column with name left and contact right; switch accent color to indigo; rewrite summary for product manager role; add icons for contact details; increase spacing between sections."
          />
          <TouchableOpacity
            onPress={onApply}
            disabled={submitting}
            className={`mt-3 flex-row items-center justify-center rounded-md px-4 py-3 ${submitting ? 'bg-purple-300' : 'bg-purple-600'}`}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="sparkles" size={18} color="#fff" />
                <Text className="ml-2 font-semibold text-white">Apply AI Edits</Text>
              </>
            )}
          </TouchableOpacity>
          {editedHtml ? (
            <TouchableOpacity
              onPress={onSave}
              disabled={saving}
              className={`mt-2 flex-row items-center justify-center rounded-md px-4 py-3 ${saving ? 'bg-blue-300' : 'bg-blue-600'}`}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <Text className="ml-2 font-semibold text-white">Save</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
