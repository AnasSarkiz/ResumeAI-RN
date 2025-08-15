import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { EditableTextInput } from '../../components/EditableTextInput';
import { generateFullHTMLResume } from '../../services/ai';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AIResumeInput } from '../../types/resume';

export default function AIGeneratorScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { createResume, updateResume } = useResume();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState<AIResumeInput>({
    fullName: user?.name || '',
    email: user?.email || '',
    countryCode: '+',
    phone: '',
    dateOfBirth: '',
    country: '',
    summary: '',
    jobTitle: '',
    experience: [],
    education: [],
    skills: [],
    targetRole: '',
    industry: '',
    designInstructions: '',
    aiPrompt: '',
    aiModel: 'gemini-2.0-flash-lite',
  });

  // Multi-item fields state
  const [educations, setEducations] = useState<string[]>(['']);
  const [experiences, setExperiences] = useState<string[]>(['']);
  const [skillsList, setSkillsList] = useState<string[]>(['']);

  const [errors, setErrors] = useState<Record<string, string>>({});
  type LinkItem = { label: string; url: string };
  const [links, setLinks] = useState<LinkItem[]>([{ label: '', url: '' }]);

  const handleInputChange = (field: keyof AIResumeInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!formData.fullName?.trim()) e.fullName = 'Full name is required';
      if (!formData.email?.trim()) e.email = 'Email is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, 5));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = async () => {
    if (!validateCurrentStep()) return;
    if (!user?.id) {
      Alert.alert('Please log in', 'You must be logged in to create resumes.');
      return;
    }
    setLoading(true);
    try {
      // Compose multi-item fields into strings for the AI generator service
      const composedForAI = {
        fullName: formData.fullName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        summary: formData.summary,
        jobTitle: formData.jobTitle,
        experience: experiences.filter((s) => s && s.trim()).join('\n'),
        education: educations.filter((s) => s && s.trim()).join('\n'),
        skills: skillsList.filter((s) => s && s.trim()).join(', '),
        targetRole: formData.targetRole,
        industry: formData.industry,
        designInstructions: formData.designInstructions,
        links: links
          .filter((l) => l.label?.trim() || l.url?.trim())
          .map((l) => `${l.label?.trim() || 'Link'} - ${l.url?.trim()}`)
          .join('\n'),
      } as any; // matches AIGeneratorInput expected by services/ai

      const html = await generateFullHTMLResume(composedForAI);

      // Persist as SavedResume: store generated HTML directly
      const derivedTitle = [formData.fullName || '', formData.jobTitle || 'Resume']
        .filter(Boolean)
        .join(' - ');
      const created = await createResume({
        id: `${user.id}-${Date.now()}`,
        userId: user.id,
        title: derivedTitle,
        html,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      router.replace({ pathname: '/resume/preview', params: { id: String(created.id) } });
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Generation failed',
        'There was a problem generating your resume. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Info', 'Summary', 'Education', 'Experience', 'Skills', 'Design'];
  const progress = useMemo(() => (step / (steps.length - 1)) * 100, [step]);

  const StepIndicator = () => (
    <View className="mb-4">
      {/* Progress bar */}
      <View className="h-2 w-full rounded-full bg-gray-200">
        <View style={{ width: `${progress}%` }} className="h-2 overflow-hidden rounded-full">
          <LinearGradient
            colors={['#6366f1', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
      {/* Step dots */}
      <View className="mt-2 flex-row items-center justify-between">
        {steps.map((label, idx) => (
          <View key={label} className="items-center">
            <View
              className={`h-7 w-7 items-center justify-center rounded-full ${idx <= step ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <Text className="text-xs font-semibold text-white">{idx + 1}</Text>
            </View>
            <Text
              className={`mt-1 text-[10px] ${idx === step ? 'text-indigo-600' : 'text-gray-500'}`}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const canProceed = useMemo(() => {
    if (step === 0) return Boolean(formData.fullName?.trim()) && Boolean(formData.email?.trim());
    return true;
  }, [step, formData.fullName, formData.email]);

  const FooterNav = () => (
    <View className="mt-6 flex-row gap-3">
      {step > 0 && (
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 flex-row items-center justify-center rounded-full border border-gray-300 bg-white py-3">
          <Ionicons name="chevron-back" size={18} color="#374151" />
          <Text className="ml-1 text-center font-medium text-gray-700">Back</Text>
        </TouchableOpacity>
      )}
      {step < 5 ? (
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed}
          className={`flex-1 flex-row items-center justify-center rounded-full py-3 ${canProceed ? 'bg-indigo-600' : 'bg-gray-300'}`}>
          <Text className="mr-1 text-center font-semibold text-white">Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          className={`flex-1 flex-row items-center justify-center rounded-full py-3 ${loading ? 'bg-gray-300' : 'bg-green-600'}`}>
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" />
              <Text className="ml-2 font-semibold text-white">Generating...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="sparkles" size={18} color="#ffffff" />
              <Text className="ml-2 text-center font-semibold text-white">Generate Resume</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#eef2ff', '#faf5ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 24 }}>
        <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <View className="mr-2 rounded-full bg-white/70 p-2">
            <Ionicons name="sparkles" size={20} color="#7c3aed" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">Create with AI</Text>
        </View>
        <Text className="text-sm text-gray-600">
          Fill the steps. On the last step, add how you want the design. We will generate a complete
          resume.
        </Text>
        <View className="mt-4">
          <StepIndicator />
        </View>
      </LinearGradient>

      <View className="space-y-4 p-4">
        {step === 0 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Personal Information</Text>
            <EditableTextInput
              label="Full Name *"
              value={formData.fullName}
              onChange={(t) => handleInputChange('fullName', t)}
              required
              error={errors.fullName}
            />
            {errors.fullName ? (
              <Text className="mt-1 text-xs text-red-500">{errors.fullName}</Text>
            ) : null}
            <EditableTextInput
              label="Email *"
              value={formData.email}
              onChange={(t) => handleInputChange('email', t)}
              required
              error={errors.email}
            />
            {errors.email ? (
              <Text className="mt-1 text-xs text-red-500">{errors.email}</Text>
            ) : null}
            <View className="mt-2 flex-row items-end gap-3">
              <View className="flex-1">
                <EditableTextInput
                  label="Date of Birth"
                  value={formData.dateOfBirth || ''}
                  onChange={(t) => handleInputChange('dateOfBirth', t)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View className="flex-1">
                <EditableTextInput
                  label="Country"
                  value={formData.country || ''}
                  onChange={(t) => handleInputChange('country', t)}
                  placeholder="e.g., Germany"
                />
              </View>
            </View>
            <View className="mt-2 flex-row items-end gap-3">
              <View style={{ width: 96 }}>
                <EditableTextInput
                  label="Code"
                  value={formData.countryCode || '+'}
                  onChange={(t) =>
                    handleInputChange('countryCode', t.startsWith('+') ? t : `+${t}`)
                  }
                  placeholder="+1"
                />
              </View>
              <View className="flex-1">
                <EditableTextInput
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={(t) => handleInputChange('phone', t)}
                  placeholder="555 555 5555"
                />
              </View>
            </View>
            <Text className="mt-2 text-xs text-gray-500">
              Tip: Use your primary contact details. We will not share them.
            </Text>

            <View className="mt-4">
              <Text className="mb-2 text-base font-semibold text-gray-800">Links</Text>
              {links.map((lnk, idx) => (
                <View key={`link-${idx}`} className="mb-2">
                  <View className="flex-row gap-3">
                    <View style={{ width: 120 }}>
                      <EditableTextInput
                        label={`Label ${idx + 1}`}
                        value={lnk.label}
                        onChange={(t) =>
                          setLinks((prev) =>
                            prev.map((v, i) => (i === idx ? { ...v, label: t } : v))
                          )
                        }
                        placeholder="LinkedIn"
                      />
                    </View>
                    <View className="flex-1">
                      <EditableTextInput
                        label="URL"
                        value={lnk.url}
                        onChange={(t) =>
                          setLinks((prev) => prev.map((v, i) => (i === idx ? { ...v, url: t } : v)))
                        }
                        placeholder="https://linkedin.com/in/username"
                      />
                    </View>
                  </View>
                  {links.length > 1 && (
                    <TouchableOpacity
                      onPress={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}
                      className="self-end rounded-full px-2 py-1">
                      <Text className="text-xs text-red-500">Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity
                onPress={() => setLinks((prev) => [...prev, { label: '', url: '' }])}
                className="mt-1 flex-row items-center">
                <Ionicons name="add-circle" size={18} color="#6366f1" />
                <Text className="ml-1 text-sm font-medium text-indigo-600">Add link</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 1 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Summary</Text>
            <EditableTextInput
              label="Current/Target Job Title"
              value={formData.jobTitle || ''}
              onChange={(t) => handleInputChange('jobTitle', t)}
            />
            <EditableTextInput
              label="Industry"
              value={formData.industry || ''}
              onChange={(t) => handleInputChange('industry', t)}
              placeholder="e.g., Technology, Healthcare"
            />
            <EditableTextInput
              label="Target Role"
              value={formData.targetRole || ''}
              onChange={(t) => handleInputChange('targetRole', t)}
              placeholder="e.g., Senior Software Engineer"
            />
            <EditableTextInput
              label="Professional Summary"
              value={formData.summary || ''}
              onChange={(t) => handleInputChange('summary', t)}
              multiline
              placeholder="Brief summary of your background"
            />
            <Text className="mt-2 text-xs text-gray-500">
              Keep it 2-4 sentences focusing on impact and strengths.
            </Text>
          </View>
        )}

        {step === 2 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Education</Text>
            {educations.map((val, idx) => (
              <View key={`edu-${idx}`} className="mb-2">
                <EditableTextInput
                  label={`Education ${idx + 1}`}
                  value={val}
                  onChange={(t) => {
                    setEducations((prev) => prev.map((v, i) => (i === idx ? t : v)));
                  }}
                  multiline
                  placeholder="Degree — Institution (Year)"
                />
                {educations.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setEducations((prev) => prev.filter((_, i) => i !== idx))}
                    className="self-end rounded-full px-2 py-1">
                    <Text className="text-xs text-red-500">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setEducations((prev) => [...prev, ''])}
              className="mt-1 flex-row items-center">
              <Ionicons name="add-circle" size={18} color="#6366f1" />
              <Text className="ml-1 text-sm font-medium text-indigo-600">Add education</Text>
            </TouchableOpacity>
            <Text className="mt-2 text-xs text-gray-500">
              Example: B.Sc. in Computer Science — ABC University (2019)
            </Text>
          </View>
        )}

        {step === 3 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Experience</Text>
            {experiences.map((val, idx) => (
              <View key={`exp-${idx}`} className="mb-2">
                <EditableTextInput
                  label={`Experience ${idx + 1}`}
                  value={val}
                  onChange={(t) => {
                    setExperiences((prev) => prev.map((v, i) => (i === idx ? t : v)));
                  }}
                  multiline
                  placeholder="Role — Company (Dates) • Key achievements"
                />
                {experiences.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setExperiences((prev) => prev.filter((_, i) => i !== idx))}
                    className="self-end rounded-full px-2 py-1">
                    <Text className="text-xs text-red-500">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setExperiences((prev) => [...prev, ''])}
              className="mt-1 flex-row items-center">
              <Ionicons name="add-circle" size={18} color="#6366f1" />
              <Text className="ml-1 text-sm font-medium text-indigo-600">Add experience</Text>
            </TouchableOpacity>
            <Text className="mt-2 text-xs text-gray-500">
              Use action verbs and quantify results when possible.
            </Text>
          </View>
        )}

        {step === 4 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Skills</Text>
            {skillsList.map((val, idx) => (
              <View key={`skill-${idx}`} className="mb-2">
                <EditableTextInput
                  label={`Skill ${idx + 1}`}
                  value={val}
                  onChange={(t) => {
                    setSkillsList((prev) => prev.map((v, i) => (i === idx ? t : v)));
                  }}
                  placeholder="e.g., React"
                />
                {skillsList.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setSkillsList((prev) => prev.filter((_, i) => i !== idx))}
                    className="self-end rounded-full px-2 py-1">
                    <Text className="text-xs text-red-500">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => setSkillsList((prev) => [...prev, ''])}
              className="mt-1 flex-row items-center">
              <Ionicons name="add-circle" size={18} color="#6366f1" />
              <Text className="ml-1 text-sm font-medium text-indigo-600">Add skill</Text>
            </TouchableOpacity>
            <Text className="mt-2 text-xs text-gray-500">
              Example: React, TypeScript, Node.js, AWS, CI/CD
            </Text>
          </View>
        )}

        {step === 5 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Design Instructions</Text>
            <EditableTextInput
              label="How should it look?"
              value={formData.designInstructions || ''}
              onChange={(t) => handleInputChange('designInstructions', t)}
              multiline
              placeholder="e.g., Modern minimal, accent color blue, two columns, emphasis on projects"
            />
            <Text className="mt-2 text-xs text-gray-500">
              Hint: Mention color accents, column layout, and typography vibe.
            </Text>
          </View>
        )}

        <FooterNav />
      </View>
    </ScrollView>
  );
}
