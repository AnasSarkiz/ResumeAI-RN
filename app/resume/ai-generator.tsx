import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { EditableTextInput } from '../../components/EditableTextInput';
import { CVTemplatePreview } from '../../components/CVTemplatePreview';
import { generateThreeCVDesigns, UserInputFields, CVTemplate } from '../../services/ai';

export default function AIGeneratorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createResume, updateResume } = useResume();
  
  const [loading, setLoading] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<CVTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const [formData, setFormData] = useState<UserInputFields>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    summary: '',
    jobTitle: '',
    experience: '',
    education: '',
    skills: '',
    targetRole: '',
    industry: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UserInputFields, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateTemplates = async () => {
    if (!validateForm()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const templates = await generateThreeCVDesigns(formData);
      setGeneratedTemplates(templates);
      setShowTemplates(true);
    } catch (error) {
      console.error('Failed to generate templates:', error);
      Alert.alert('Error', 'Failed to generate CV templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (template: CVTemplate) => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'Please log in to save your resume.');
        return;
      }

      // Create the resume using the context function
      const createdResume = await createResume(user.id, template.resume.title);
      
      // Then update it with the template data
      await updateResume(createdResume.id, {
        ...template.resume,
        id: createdResume.id,
        userId: user.id
      });
      
      if (createdResume) {
        Alert.alert(
          'Success!', 
          'Your resume has been created successfully!',
          [
            {
              text: 'Edit Resume',
              onPress: () => router.push(`/resume/editor?id=${createdResume.id}`)
            },
            {
              text: 'View Preview',
              onPress: () => {
                const tpl = template.preferredTemplate || 'classic';
                router.push({ pathname: '/resume/preview', params: { id: String(createdResume.id), template: String(tpl) } });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Failed to create resume:', error);
      Alert.alert('Error', 'Failed to create resume. Please try again.');
    }
  };

  const renderError = (field: string) => {
    return errors[field] ? (
      <Text className="mt-1 text-xs text-red-500">{errors[field]}</Text>
    ) : null;
  };

  if (showTemplates) {
    return (
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="mb-6">
          <TouchableOpacity 
            onPress={() => setShowTemplates(false)}
            className="mb-4 flex-row items-center"
          >
            <Text className="text-blue-500">← Back to Form</Text>
          </TouchableOpacity>
          
          <Text className="mb-2 text-2xl font-bold text-gray-800">
            Choose Your CV Template
          </Text>
          <Text className="text-gray-600">
            Select the template that best fits your style and industry
          </Text>
        </View>

        {generatedTemplates.map((template, index) => (
          <CVTemplatePreview
            key={template.id}
            template={template}
            onSelect={handleSelectTemplate}
            index={index}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="mb-2 text-2xl font-bold text-gray-800">
          AI Resume Generator
        </Text>
        <Text className="text-gray-600">
          Provide your information and let AI create 3 professional resume templates for you
        </Text>
      </View>

      <View className="space-y-4">
        {/* Basic Information */}
        <View className="rounded-lg bg-white p-4">
          <Text className="mb-3 text-lg font-semibold text-gray-800">
            Basic Information
          </Text>
          
          <EditableTextInput
            label="Full Name *"
            value={formData.fullName}
            onChange={(text) => handleInputChange('fullName', text)}
            required
            error={errors.fullName || ''}
          />
          {renderError('fullName')}

          <EditableTextInput
            label="Email *"
            value={formData.email}
            onChange={(text) => handleInputChange('email', text)}
            required
            error={errors.email || ''}
          />
          {renderError('email')}

          <EditableTextInput
            label="Phone Number"
            value={formData.phone || ''}
            onChange={(text) => handleInputChange('phone', text)}
          />
        </View>

        {/* Professional Information */}
        <View className="rounded-lg bg-white p-4">
          <Text className="mb-3 text-lg font-semibold text-gray-800">
            Professional Information
          </Text>

          <EditableTextInput
            label="Current/Target Job Title *"
            value={formData.jobTitle}
            onChange={(text) => handleInputChange('jobTitle', text)}
            required
            error={errors.jobTitle || ''}
          />
          {renderError('jobTitle')}

          <EditableTextInput
            label="Industry"
            value={formData.industry || ''}
            onChange={(text) => handleInputChange('industry', text)}
            placeholder="e.g., Technology, Healthcare, Finance"
          />

          <EditableTextInput
            label="Target Role"
            value={formData.targetRole || ''}
            onChange={(text) => handleInputChange('targetRole', text)}
            placeholder="e.g., Senior Software Engineer, Marketing Manager"
          />

          <EditableTextInput
            label="Professional Summary"
            value={formData.summary || ''}
            onChange={(text) => handleInputChange('summary', text)}
            multiline
            placeholder="Brief description of your professional background and goals"
          />
        </View>

        {/* Experience & Skills */}
        <View className="rounded-lg bg-white p-4">
          <Text className="mb-3 text-lg font-semibold text-gray-800">
            Experience & Skills
          </Text>

          <EditableTextInput
            label="Work Experience"
            value={formData.experience || ''}
            onChange={(text) => handleInputChange('experience', text)}
            multiline
            placeholder="Describe your relevant work experience, achievements, and responsibilities"
          />

          <EditableTextInput
            label="Education"
            value={formData.education || ''}
            onChange={(text) => handleInputChange('education', text)}
            multiline
            placeholder="Your educational background, degrees, certifications"
          />

          <EditableTextInput
            label="Skills"
            value={formData.skills || ''}
            onChange={(text) => handleInputChange('skills', text)}
            multiline
            placeholder="List your key skills separated by commas"
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerateTemplates}
          disabled={loading}
          className={`rounded-full py-4 ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="font-medium text-white">Generating Templates...</Text>
            </View>
          ) : (
            <Text className="text-center text-lg font-medium text-white">
              Generate 3 CV Templates
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
