import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { ResumeSectionCard } from '../../components/ResumeSectionCard';
import { EditableTextInput } from '../../components/EditableTextInput';
import { AIButton } from '../../components/AIButton';
import { ExportPDFButton } from '../../components/ExportPDFButton';
import { PromptSelector } from '../../components/PromptSelector';
import { Experience, ResumeSection } from '../../types/resume';

const prompts = [
  {
    id: 'generate-bullet-points',
    title: 'Generate Bullet Points',
    description: 'Create achievement-oriented bullet points for your experience',
  },
  {
    id: 'reword-text',
    title: 'Reword Text',
    description: 'Make your text sound more professional',
  },
  {
    id: 'improve-summary',
    title: 'Improve Summary',
    description: 'Enhance your professional summary',
  },
];

export default function ResumeEditorScreen() {
  const { id } = useLocalSearchParams();
  const { currentResume, updateResume, loading } = useResume();
  const { isPro } = useSubscription();
  const [activeSection, setActiveSection] = useState<ResumeSection>('experience');
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadResume(id);
    }
  }, [id]);

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    updateResume(currentResume.id, { [field]: value });
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: new Date().toISOString().split('T')[0],
      current: true,
      description: [],
    };

    updateResume(currentResume.id, {
      experience: [...currentResume.experience, newExperience],
    });
  };

  const handleUpdateExperience = (expId: string, updates: Partial<Experience>) => {
    const updatedExperience = currentResume.experience.map((exp) =>
      exp.id === expId ? { ...exp, ...updates } : exp
    );

    updateResume(currentResume.id, { experience: updatedExperience });
  };

  // Similar handlers for education and skills...

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="p-4">
        <View className="mb-6">
          <EditableTextInput
            label="Resume Title"
            value={currentResume.title}
            onChange={(text: string) => handleUpdate('title', text)}
          />

          <Text className="mb-2 text-lg font-bold">Personal Information</Text>
          <EditableTextInput
            label="Full Name"
            value={currentResume.fullName}
            onChange={(text: string) => handleUpdate('fullName', text)}
          />
          <EditableTextInput
            label="Email"
            value={currentResume.email}
            onChange={(text: string) => handleUpdate('email', text)}
          />
          <EditableTextInput
            label="Phone"
            value={currentResume.phone || ''}
            onChange={(text: string) => handleUpdate('phone', text)}
            // keyboardType="phone-pad"
          />
          <EditableTextInput
            label="LinkedIn"
            value={currentResume.linkedIn || ''}
            onChange={(text: string) => handleUpdate('linkedIn', text)}
          />
          <EditableTextInput
            label="GitHub"
            value={currentResume.github || ''}
            onChange={(text: string) => handleUpdate('github', text)}
          />
          <EditableTextInput
            label="Website"
            value={currentResume.website || ''}
            onChange={(text: string) => handleUpdate('website', text)}
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold">Sections</Text>
          <ResumeSectionCard
            title="Summary"
            active={activeSection === 'summary'}
            onPress={() => setActiveSection('summary')}
          />
          <ResumeSectionCard
            title="Experience"
            active={activeSection === 'experience'}
            onPress={() => setActiveSection('experience')}
          />
          <ResumeSectionCard
            title="Education"
            active={activeSection === 'education'}
            onPress={() => setActiveSection('education')}
          />
          <ResumeSectionCard
            title="Skills"
            active={activeSection === 'skills'}
            onPress={() => setActiveSection('skills')}
          />
        </View>

        {activeSection === 'summary' && (
          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold">Professional Summary</Text>
            <EditableTextInput
              value={currentResume.summary || ''}
              onChange={(text: string) => handleUpdate('summary', text)}
              multiline
              placeholder="Write a brief summary of your professional background..."
              label={''}
            />
            <AIButton
              action="improve-summary"
              context={currentResume.summary || ''}
              disabled={!isPro}
              className="mt-2"
            />
          </View>
        )}

        {activeSection === 'experience' && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Work Experience</Text>
              <TouchableOpacity
                onPress={handleAddExperience}
                disabled={!isPro && currentResume.experience.length > 0}
                className={`p-2 ${!isPro && currentResume.experience.length > 0 ? 'opacity-50' : ''}`}>
                <Text className="text-blue-500">+ Add</Text>
              </TouchableOpacity>
            </View>

            {currentResume.experience.map((exp) => (
              <View key={exp.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Job Title"
                  value={exp.jobTitle}
                  onChange={(text: string) => handleUpdateExperience(exp.id, { jobTitle: text })}
                />
                <EditableTextInput
                  label="Company"
                  value={exp.company}
                  onChange={(text: string) => handleUpdateExperience(exp.id, { company: text })}
                />
                <View className="flex-row space-x-4">
                  <EditableTextInput
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(text: string) => handleUpdateExperience(exp.id, { startDate: text })}
                    className="flex-1"
                  />
                  {!exp.current && (
                    <EditableTextInput
                      label="End Date"
                      value={exp.endDate || ''}
                      onChange={(text: string) => handleUpdateExperience(exp.id, { endDate: text })}
                      className="flex-1"
                    />
                  )}
                </View>
                <View className="mb-2 flex-row items-center">
                  <Text className="mr-2">Current Job</Text>
                  <TouchableOpacity
                    onPress={() => handleUpdateExperience(exp.id, { current: !exp.current })}
                    className={`h-6 w-6 rounded-md border ${exp.current ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                    {exp.current && <Text className="text-center text-white">✓</Text>}
                  </TouchableOpacity>
                </View>

                <Text className="mb-1 text-sm font-medium text-gray-700">Description</Text>
                {exp.description.map((point, idx) => (
                  <EditableTextInput
                    key={idx}
                    value={point}
                    onChange={(text: string) => {
                      const newDescription = [...exp.description];
                      newDescription[idx] = text;
                      handleUpdateExperience(exp.id, { description: newDescription });
                    }}
                    multiline
                    className="mb-2"
                    label={''}
                  />
                ))}

                <TouchableOpacity
                  onPress={() => {
                    const newDescription = [...exp.description, ''];
                    handleUpdateExperience(exp.id, { description: newDescription });
                  }}
                  className="py-1">
                  <Text className="text-blue-500">+ Add bullet point</Text>
                </TouchableOpacity>

                <PromptSelector
                  prompts={prompts}
                  onSelect={(promptId: string) => {
                    if (promptId === 'generate-bullet-points') {
                      // Handle AI generation for bullet points
                    }
                  }}
                  disabled={!isPro}
                />
              </View>
            ))}
          </View>
        )}

        {/* Similar sections for Education and Skills */}
      </ScrollView>

      <View className="border-t border-gray-200 bg-white p-4">
        <View className="flex-row justify-between">
          <Link href={`/resume/preview?id=${currentResume.id}`} asChild>
            <TouchableOpacity className="rounded-full border border-blue-500 px-4 py-2">
              <Text className="text-blue-500">Preview</Text>
            </TouchableOpacity>
          </Link>

          <ExportPDFButton />
        </View>
      </View>
    </View>
  );
}

function loadResume(id: string) {
  throw new Error('Function not implemented.');
}
