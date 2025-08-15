import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { listHTMLTemplates, TemplateId, renderHTMLTemplate } from '../../services/templates';
import { ManualResumeInput } from 'types/resume';
import { WebView } from 'react-native-webview';
// Load WebView at runtime to avoid crashes if unavailable
let WebViewComp: any = null;
try {
  WebViewComp = WebView;
} catch (e) {
  WebViewComp = null;
}

// Ensure fixed-size A4-like layout while allowing zoom inside WebView by
// normalizing the meta viewport and injecting a small non-responsive reset.
function enforceFixedViewport(html: string): string {
  if (!html) return html;

  const FIXED_META = `
  <meta name="viewport" content="width=794, initial-scale=0.2, user-scalable=false" />
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

export default function TemplateSelectorScreen({ resume }: { resume?: ManualResumeInput }) {
  const { template, draft: draftParam } = useLocalSearchParams<{
    id?: string;
    template?: TemplateId;
    draft?: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const { createResume } = useResume();
  const [selected, setSelected] = useState<TemplateId | undefined>(
    template as TemplateId | undefined
  );
  const [isSaving, setIsSaving] = useState(false);

  // Determine the draft to use: prop overrides param; otherwise none
  let effectiveDraft: ManualResumeInput | undefined = resume;
  if (!effectiveDraft && typeof draftParam === 'string' && draftParam.length > 0) {
    try {
      const parsed = JSON.parse(decodeURIComponent(draftParam));
      effectiveDraft = parsed as ManualResumeInput;
    } catch (e) {
      console.warn('Failed to parse draft from params', e);
    }
  }

  const items = listHTMLTemplates();

  const handleSelect = (tpl: TemplateId) => {
    setSelected(tpl);
  };

  const handleSave = async () => {
    if (!effectiveDraft || !selected || !user?.id) {
      if (!selected) Alert.alert('Select a template', 'Please choose a template to continue.');
      return;
    }

    setIsSaving(true);
    try {
      const html = renderHTMLTemplate(effectiveDraft, selected);
      const title =
        effectiveDraft.title && effectiveDraft.title.trim()
          ? effectiveDraft.title
          : `${effectiveDraft.fullName || 'Resume'}${effectiveDraft.title ? '' : ''}`;
      const created = await createResume({
        id: `${user.id}-${Date.now()}`,
        userId: user.id,
        title,
        html,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      router.replace({ pathname: '/resume/preview', params: { id: String(created.id) } });
    } catch (e) {
      console.error('Failed to save resume', e);
      Alert.alert('Error', 'Failed to save your resume. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Choose a Template</Text>
        <Text className="mt-1 text-sm text-gray-600">
          Select one of the 5 free templates for your resume.
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 6 }}>
        <View className="flex-row flex-wrap justify-between">
          {items.map(({ id: tplId, name }) => {
            const rawHtml = effectiveDraft ? renderHTMLTemplate(effectiveDraft, tplId) : null;
            const html = rawHtml ? enforceFixedViewport(rawHtml) : null;
            return (
              <View
                key={tplId}
                className={`mb-6 h-[360px] w-[49.5%] rounded-xl border ${selected === tplId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
                  <View>
                    <Text className="text-sm font-semibold text-purple-900">{name}</Text>
                    <Text className="text-xs text-gray-600">ID: {tplId}</Text>
                  </View>
                  {selected === tplId && (
                    <View className="rounded-full bg-blue-500 px-3 py-1">
                      <Text className="text-xs font-semibold text-white">Selected</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelect(tplId)}
                  className="absolute bottom-14 left-0 right-0 mx-1 mb-2 overflow-hidden rounded-lg"
                  style={{ height: 240, backgroundColor: '#fff' }}>
                  {WebViewComp && html ? (
                    <WebViewComp
                      key={`${tplId}`}
                      originWhitelist={['*']}
                      source={{ html }}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-sm text-gray-500">
                        {WebViewComp
                          ? 'No resume data to preview.'
                          : 'Install react-native-webview to enable previews.'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  <TouchableOpacity
                    onPress={() => handleSelect(tplId)}
                    className={`rounded-full px-2 py-2 ${selected === tplId ? 'bg-blue-700' : 'bg-blue-600'}`}>
                    <Text className="text-center text-xs font-semibold text-white">
                      Use This Template
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-4 pb-6">
        <TouchableOpacity
          onPress={handleSave}
          className={`mb-3 flex-row items-center justify-center rounded-full py-3 ${selected && !isSaving ? 'bg-indigo-600' : 'bg-gray-300'}`}
          disabled={!selected || isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center font-medium text-white">Save & Preview</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full border border-gray-300 bg-white py-3">
          <Text className="text-center font-medium text-gray-700">Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
