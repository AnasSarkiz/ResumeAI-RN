import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { EditableTextInput } from '../../components/EditableTextInput';
import { editHTMLResume } from '../../services/ai';
import { renderHTMLTemplate, TemplateId } from '../../services/templates';

export default function AIHtmlEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const isPro = user?.isPro;
  const { currentResume, loadResume, updateResume, loading } = useResume();
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editedHtml, setEditedHtml] = useState<string>('');

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
    const tpl = (currentResume as any).template as TemplateId | undefined;
    const isAI = (currentResume as any).kind === 'ai' && (currentResume as any).aiHtml;
    const html = isAI
      ? (currentResume as any).aiHtml
      : renderHTMLTemplate(currentResume as any, (tpl || 'classic') as TemplateId);
    return enforceFixedViewport(html);
  }, [currentResume]);

  const htmlToPreview = editedHtml ? enforceFixedViewport(editedHtml) : baseHtml;

  const onApply = async () => {
    if (!currentResume) return;
    if (!instructions.trim()) {
      Alert.alert('Add instructions', 'Please describe what you want to change.');
      return;
    }
    setSubmitting(true);
    try {
      const newHtml = await editHTMLResume(baseHtml, instructions);
      setEditedHtml(newHtml);
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
        kind: 'ai',
        aiHtml: editedHtml,
        aiPrompt: instructions,
        aiModel: 'gemini-2.0-flash-lite',
        updatedAt: new Date(),
      } as any);
      Alert.alert('Saved', 'Your AI edits have been saved.', [
        { text: 'Preview', onPress: () => router.push({ pathname: '/resume/preview', params: { id: String(currentResume.id) } }) },
        { text: 'Done', style: 'cancel' },
      ]);
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
        <TouchableOpacity onPress={() => router.back()} className="rounded-md bg-gray-200 px-3 py-2">
          <Text className="text-gray-700">Back</Text>
        </TouchableOpacity>
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
