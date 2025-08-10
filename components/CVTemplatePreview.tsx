import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CVTemplate } from '../services/ai';

interface CVTemplatePreviewProps {
  template: CVTemplate;
  onSelect: (template: CVTemplate) => void;
  index: number;
}

export const CVTemplatePreview: React.FC<CVTemplatePreviewProps> = ({
  template,
  onSelect,
  index
}) => {
  const getTemplateColor = (templateIndex: number) => {
    const colors = ['bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-purple-50 border-purple-200'];
    return colors[templateIndex] || 'bg-gray-50 border-gray-200';
  };

  const getButtonColor = (templateIndex: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
    return colors[templateIndex] || 'bg-blue-500';
  };

  return (
    <View className={`mb-6 rounded-xl border-2 ${getTemplateColor(index)} p-4 shadow-sm`}>
      {/* Template Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">
            {template.name} Template
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            {template.description}
          </Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${getTemplateColor(index)}`}>
          <Text className="text-xs font-medium text-gray-700">
            #{index + 1}
          </Text>
        </View>
      </View>

      {/* Resume Preview Card */}
      <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {/* Header Section */}
        <View className="mb-3 border-b border-gray-100 pb-3">
          <Text className="text-lg font-bold text-gray-900">
            {template.resume.fullName}
          </Text>
          <View className="mt-1 flex-row flex-wrap">
            <Text className="mr-4 text-sm text-gray-600">
              📧 {template.resume.email}
            </Text>
            {template.resume.phone && (
              <Text className="text-sm text-gray-600">
                📱 {template.resume.phone}
              </Text>
            )}
          </View>
        </View>

        {/* Summary Section */}
        {template.resume.summary && (
          <View className="mb-3">
            <Text className="mb-1 text-sm font-semibold text-gray-800">
              Professional Summary
            </Text>
            <Text className="text-xs leading-4 text-gray-700" numberOfLines={3}>
              {template.resume.summary}
            </Text>
          </View>
        )}

        {/* Experience Preview */}
        {template.resume.experience.length > 0 && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-gray-800">
              Experience ({template.resume.experience.length})
            </Text>
            {template.resume.experience.slice(0, 2).map((exp, idx) => (
              <View key={exp.id} className="mb-2">
                <Text className="text-xs font-medium text-gray-800">
                  {exp.jobTitle} at {exp.company}
                </Text>
                <Text className="text-xs text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
                {exp.description.length > 0 && (
                  <Text className="mt-1 text-xs text-gray-700" numberOfLines={2}>
                    • {exp.description[0]}
                  </Text>
                )}
              </View>
            ))}
            {template.resume.experience.length > 2 && (
              <Text className="text-xs italic text-gray-500">
                +{template.resume.experience.length - 2} more experiences
              </Text>
            )}
          </View>
        )}

        {/* Skills Preview */}
        {template.resume.skills.length > 0 && (
          <View className="mb-3">
            <Text className="mb-2 text-sm font-semibold text-gray-800">
              Skills ({template.resume.skills.length})
            </Text>
            <View className="flex-row flex-wrap">
              {template.resume.skills.slice(0, 6).map((skill, idx) => (
                <View key={skill.id} className="mb-1 mr-2 rounded bg-gray-100 px-2 py-1">
                  <Text className="text-xs text-gray-700">{skill.name}</Text>
                </View>
              ))}
              {template.resume.skills.length > 6 && (
                <View className="mb-1 rounded bg-gray-200 px-2 py-1">
                  <Text className="text-xs text-gray-600">
                    +{template.resume.skills.length - 6} more
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Education Preview */}
        {template.resume.education.length > 0 && (
          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-800">
              Education
            </Text>
            {template.resume.education.slice(0, 1).map((edu) => (
              <Text key={edu.id} className="text-xs text-gray-700">
                {edu.degree} from {edu.institution}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <TouchableOpacity
          onPress={() => onSelect(template)}
          className={`flex-1 rounded-full py-3 ${getButtonColor(index)}`}
        >
          <Text className="text-center font-semibold text-white">
            Select This Template
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="rounded-full border border-gray-300 bg-white px-4 py-3"
        >
          <Text className="text-center text-sm font-medium text-gray-700">
            Preview
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CVTemplatePreview;
