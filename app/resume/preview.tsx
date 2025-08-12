import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { ExportPDFButton } from '../../components/ExportPDFButton';
import { TemplateId, TEMPLATE_NAMES, renderHTMLTemplate } from '../../services/templates';

// Try to load WebView at runtime to avoid crashing if it's not installed yet.
let WebViewComp: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebViewComp = require('react-native-webview').WebView;
} catch (e) {
  WebViewComp = null;
}

// Ensure fixed-size A4-like layout while allowing zoom inside WebView by
// normalizing the meta viewport and injecting a small non-responsive reset.
function enforceFixedViewport(html: string): string {
  if (!html) return html;

  const FIXED_META = '<meta name="viewport" content="width=794, initial-scale=1, minimum-scale=0.1, maximum-scale=5, user-scalable=yes" />';
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

export default function PreviewScreen() {
  const { id, template } = useLocalSearchParams();
  const { currentResume, loading, loadResume } = useResume();
  const tpl = (template as TemplateId | undefined);

  // Ensure the resume is loaded when arriving from Home
  useEffect(() => {
    const rid = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (rid) {
      if (!currentResume || currentResume.id !== rid) {
        loadResume(rid);
      }
    }
  }, [id]);

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If this is an AI resume, render stored HTML directly
  const kind = (currentResume as any)?.kind;
  if (kind === 'ai') {
    const aiHtml = (currentResume as any)?.aiHtml as string | undefined;
    if (WebViewComp && aiHtml) {
      return (
        <View className="flex-1 bg-white">
          <WebViewComp originWhitelist={["*"]} source={{ html: enforceFixedViewport(aiHtml) }} style={{ flex: 1 }} />
          <View className="border-t border-gray-200 p-4">
            <ExportPDFButton />
          </View>
        </View>
      );
    }
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="mb-2 text-lg font-semibold">Preview unavailable</Text>
        <Text className="text-center text-gray-600">Install react-native-webview to preview AI resumes, or try exporting to PDF.</Text>
      </View>
    );
  }

  // If a template is chosen and WebView is available, render the real HTML template preview
  if (tpl && WebViewComp && currentResume) {
    const html = enforceFixedViewport(renderHTMLTemplate(currentResume, tpl));
    return (
      <View className="flex-1 bg-white">
        <WebViewComp key={tpl} originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} />
        <View className="border-t border-gray-200 p-4">
          <ExportPDFButton template={tpl} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold">{currentResume.fullName}</Text>
          <Text className="text-gray-600">
            {currentResume.email} | {currentResume.phone}
          </Text>
          {tpl && (
            <Text className="mt-1 text-xs text-gray-500">
              Template: {TEMPLATE_NAMES[tpl] || tpl} {WebViewComp ? '' : '(Install react-native-webview for full preview)'}
            </Text>
          )}
          {currentResume.linkedIn && (
            <Text className="text-blue-500">LinkedIn: {currentResume.linkedIn}</Text>
          )}
          {currentResume.github && (
            <Text className="text-blue-500">GitHub: {currentResume.github}</Text>
          )}
          {currentResume.website && (
            <Text className="text-blue-500">Website: {currentResume.website}</Text>
          )}
        </View>

        {currentResume.summary && (
          <View className="mb-6">
            <Text className="mb-2 text-xl font-bold">Summary</Text>
            <Text className="text-gray-700">{currentResume.summary}</Text>
          </View>
        )}

        <View className="mb-6">
          <Text className="mb-2 text-xl font-bold">Experience</Text>
          {currentResume.experience.map((exp, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-lg font-semibold">{exp.jobTitle}</Text>
              <Text className="text-gray-600">
                {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
              <View className="mt-2">
                {exp.description.map((point, i) => (
                  <Text key={i} className="mb-1">
                    • {point}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-xl font-bold">Education</Text>
          {currentResume.education.map((edu, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-lg font-semibold">{edu.degree}</Text>
              <Text className="text-gray-600">
                {edu.institution} | {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </Text>
              {edu.fieldOfStudy && (
                <Text className="text-gray-600">Field of Study: {edu.fieldOfStudy}</Text>
              )}
              {edu.description && <Text className="mt-1 text-gray-700">{edu.description}</Text>}
            </View>
          ))}
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-xl font-bold">Skills</Text>
          <View className="flex-row flex-wrap">
            {currentResume.skills.map((skill, idx) => (
              <View key={idx} className="mb-2 mr-2 rounded-full bg-gray-100 px-3 py-1">
                <Text className="text-gray-800">
                  {skill.name} {skill.proficiency && `(${skill.proficiency})`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 p-4">
        <ExportPDFButton template={tpl} />
      </View>
    </View>
  );
}
