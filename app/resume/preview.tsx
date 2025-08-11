import React from 'react';
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

export default function PreviewScreen() {
  const { id, template } = useLocalSearchParams();
  const { currentResume, loading } = useResume();
  const tpl = (template as TemplateId | undefined);

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If a template is chosen and WebView is available, render the real HTML template preview
  if (tpl && WebViewComp && currentResume) {
    const html = renderHTMLTemplate(currentResume, tpl);
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
