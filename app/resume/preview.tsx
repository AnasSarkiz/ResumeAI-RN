import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { ExportPDFButton } from '../../components/ExportPDFButton';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams();
  const { currentResume, loading } = useResume();

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
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
        <ExportPDFButton />
      </View>
    </View>
  );
}
