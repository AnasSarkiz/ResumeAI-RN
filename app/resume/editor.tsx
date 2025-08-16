import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  AppState,
  AppStateStatus,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useResume } from '../../context/ResumeContext';
// subscription and old section tabs removed in step-based UI
import { EditableTextInput } from '../../components/EditableTextInput';
import { Experience, ManualResumeInput, Education, Skill, LinkItem } from '../../types/resume';
import { validateManualResume } from '../../services/resume';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ResumeEditorScreen() {
  const { id } = useLocalSearchParams();
  const { currentResume, updateResume, loading, loadResume, subscribeResume } = useResume();
  const { user } = useAuth();
  const router = useRouter();
  // step-based UI only
  const [draft, setDraft] = useState<ManualResumeInput | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const steps = ['Info', 'Links', 'Summary', 'Experience', 'Education', 'Skills'];
  const progress = useMemo(() => (step / (steps.length - 1)) * 100, [step]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadResume(id);
    }
  }, [id]);

  // Real-time subscription for the active resume when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (!id || typeof id !== 'string') return () => {};
      let unsub: (() => void) | null = subscribeResume ? subscribeResume(id) : null;

      const handleAppState = (state: AppStateStatus) => {
        if (state !== 'active') {
          if (unsub) {
            unsub();
            unsub = null;
          }
        } else if (!unsub && subscribeResume && id && typeof id === 'string') {
          unsub = subscribeResume(id);
        }
      };

      const sub = AppState.addEventListener('change', handleAppState);
      return () => {
        sub.remove();
        if (unsub) unsub();
      };
    }, [id, subscribeResume])
  );

  const renderError = (key: string) =>
    errors[key] ? <Text className="mt-1 text-xs text-red-500">{errors[key]}</Text> : null;

  const handleValidateAndSave = async (opts?: { goPreview?: boolean }) => {
    if (!draft) return;
    const { valid, errors: errs } = validateManualResume(draft);
    setErrors(errs);
    if (!valid) {
      Alert.alert('Missing required fields', 'Please fill all required fields highlighted in red.');
      return;
    }
    // If we have an existing SavedResume, persist updates; otherwise go choose template
    if (currentResume) {
      // Backward compat: write legacy phone from first phones[] if present
      const toSave = (() => {
        if (Array.isArray((draft as any).phones) && (draft as any).phones.length > 0) {
          const first = (draft as any).phones[0];
          return { ...draft, phone: `${first.dial} ${first.number}`.trim() } as ManualResumeInput;
        }
        return draft;
      })();
      await updateResume(currentResume.id, toSave);
      if (opts?.goPreview) {
        router.push(`/resume/preview?id=${currentResume.id}`);
      }
    } else {
      // No SavedResume yet: proceed to template selection with the draft
      const payload = encodeURIComponent(JSON.stringify(draft));
      router.push({ pathname: '/resume/templates', params: { draft: payload } });
    }
  };

  // Per-step lightweight validation (ensure basics early)
  const validateCurrentStep = (): boolean => {
    if (!draft) return false;
    const e: Record<string, string> = {};
    switch (step) {
      case 0: // Info
        if (!draft.title?.trim()) e.title = 'Title is required';
        if (!draft.fullName?.trim()) e.fullName = 'Full name is required';
        if (!draft.email?.trim()) e.email = 'Email is required';
        break;
      case 3: // Experience
        draft.experience.forEach((exp, idx) => {
          if (!exp.jobTitle?.trim()) e[`experience.${idx}.jobTitle`] = 'Job title is required';
          if (!exp.company?.trim()) e[`experience.${idx}.company`] = 'Company is required';
          if (!exp.startDate?.trim()) e[`experience.${idx}.startDate`] = 'Start date is required';
        });
        break;
      case 4: // Education
        draft.education.forEach((edu, idx) => {
          if (!edu.institution?.trim())
            e[`education.${idx}.institution`] = 'Institution is required';
          if (!edu.degree?.trim()) e[`education.${idx}.degree`] = 'Degree is required';
          if (!edu.startDate?.trim()) e[`education.${idx}.startDate`] = 'Start date is required';
        });
        break;
      case 5: // Skills
        draft.skills.forEach((skill, idx) => {
          if (!skill.name?.trim()) e[`skills.${idx}.name`] = 'Skill name is required';
        });
        break;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = useMemo(() => {
    if (!draft) return false;
    switch (step) {
      case 0: // Info
        return !!draft.title?.trim() && !!draft.fullName?.trim() && !!draft.email?.trim();
      case 3: // Experience
        return draft.experience.every(
          (exp) => exp.jobTitle?.trim() && exp.company?.trim() && exp.startDate?.trim()
        );
      case 4: // Education
        return draft.education.every(
          (edu) => edu.institution?.trim() && edu.degree?.trim() && edu.startDate?.trim()
        );
      case 5: // Skills
        return draft.skills.every((skill) => skill.name?.trim());
      default:
        return true;
    }
  }, [step, draft]);

  const StepIndicator = () => (
    <View className="mb-4">
      <View className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <View style={{ width: `${progress}%` }} className="h-2 overflow-hidden rounded-full">
          <LinearGradient
            colors={['#25439A', '#3D92C4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </View>
      </View>
      <View className="mt-2 flex-row items-center justify-between">
        {steps.map((label, idx) => (
          <View key={label} className="items-center">
            <View
              className={`h-7 w-7 items-center justify-center rounded-full ${idx <= step ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <Text className="text-xs font-semibold text-white">{idx + 1}</Text>
            </View>
            <Text
              className={`mt-1 text-[10px] ${idx === step ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const FooterNav = () => (
    <View className="mt-6 flex-row gap-3">
      <TouchableOpacity
        onPress={step > 0 ? handleBack : () => router.back()}
        className="flex-1 flex-row items-center justify-center rounded-full border border-gray-300 bg-white py-3">
        <Ionicons name="chevron-back" size={18} color="#374151" />
        <Text className="ml-1 text-center font-medium text-gray-700">Back</Text>
      </TouchableOpacity>
      {step < steps.length - 1 ? (
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed}
          className={`flex-1 flex-row items-center justify-center rounded-full py-3 ${canProceed ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <Text className="mr-1 text-center font-semibold text-white">Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleValidateAndSave()}
          className={`flex-1 flex-row items-center justify-center rounded-full bg-green-600 py-3`}>
          <Text className="text-center text-sm font-semibold text-white">
            Save & Choose Template
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Initialize an editable ManualResumeInput draft from scratch using user defaults.
  // If there is no currentResume (manual create flow), still initialize a local draft.
  // Do not derive fields from SavedResume directly (it stores HTML only).
  useEffect(() => {
    const baseDraft: ManualResumeInput = {
      id: currentResume ? String(currentResume.id) : `${user?.id || 'local'}-${Date.now()}`,
      userId: currentResume ? String(currentResume.userId) : String(user?.id || ''),
      title: '',
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      dateOfBirth: '',
      country: '',
      website: '',
      linkedIn: '',
      github: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      links: [],
      phones: [{ id: Date.now().toString(), dial: '', number: '' }],
      temp: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDraft(baseDraft);
  }, [currentResume, user]);

  // Show loading only if we are actually fetching a specific resume by id.
  if ((id && loading) || (id && !currentResume) || !draft) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleUpdate = (field: keyof ManualResumeInput, value: any) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
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

    setDraft((prev) =>
      prev ? { ...prev, experience: [...prev.experience, newExperience] } : prev
    );
  };

  const handleUpdateExperience = (expId: string, updates: Partial<Experience>) => {
    const updatedExperience = draft.experience.map((exp) =>
      exp.id === expId ? { ...exp, ...updates } : exp
    );
    setDraft((prev) => (prev ? { ...prev, experience: updatedExperience } : prev));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: new Date().toISOString().split('T')[0],
      current: true,
      description: '',
    };
    setDraft((prev) => (prev ? { ...prev, education: [...prev.education, newEducation] } : prev));
  };

  const handleUpdateEducation = (
    eduId: string,
    updates: Partial<import('../../types/resume').Education>
  ) => {
    const updatedEducation = draft.education.map((edu) =>
      edu.id === eduId ? { ...edu, ...updates } : edu
    );
    setDraft((prev) => (prev ? { ...prev, education: updatedEducation } : prev));
  };

  // Skills handlers
  const handleAddSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'beginner' as const,
      category: '',
    };
    setDraft((prev) => (prev ? { ...prev, skills: [...prev.skills, newSkill] } : prev));
  };

  const handleUpdateSkill = (
    skillId: string,
    updates: Partial<import('../../types/resume').Skill>
  ) => {
    const updatedSkills = draft.skills.map((s) => (s.id === skillId ? { ...s, ...updates } : s));
    setDraft((prev) => (prev ? { ...prev, skills: updatedSkills } : prev));
  };

  // Remove item helpers
  const handleRemoveExperience = (expId: string) => {
    setDraft((prev) =>
      prev ? { ...prev, experience: prev.experience.filter((e) => e.id !== expId) } : prev
    );
  };
  const handleRemoveEducation = (eduId: string) => {
    setDraft((prev) =>
      prev ? { ...prev, education: prev.education.filter((e) => e.id !== eduId) } : prev
    );
  };
  const handleRemoveSkill = (skillId: string) => {
    setDraft((prev) =>
      prev ? { ...prev, skills: prev.skills.filter((s) => s.id !== skillId) } : prev
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentInsetAdjustmentBehavior="always"
        showsVerticalScrollIndicator={false}
      >
      <LinearGradient
        colors={['#eef2ff', '#faf5ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingHorizontal: 16, paddingBottom: 16, paddingTop: 24 }}>
        <View
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View className="mr-2 rounded-full bg-white/70 p-2">
              <Ionicons name="create-outline" size={20} color="#7c3aed" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">Manual Editor</Text>
          </View>
        </View>
        <Text className="text-sm text-gray-600">
          Fill the steps to build your resume. On the last step, save and choose a template.
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
              label="Resume Title *"
              value={draft.title}
              onChange={(t: string) => handleUpdate('title', t)}
              placeholder="e.g. Senior iOS Engineer"
              required
              error={errors['title']}
            />
            {renderError('title')}
            <EditableTextInput
              label="Full Name *"
              value={draft.fullName}
              onChange={(t: string) => handleUpdate('fullName', t)}
              autoCapitalize="words"
              placeholder="e.g. Jane Doe"
              required
              error={errors['fullName']}
            />
            {renderError('fullName')}
            <EditableTextInput
              label="Email *"
              value={draft.email}
              onChange={(t: string) => handleUpdate('email', t)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. jane@example.com"
              required
              error={errors['email']}
            />
            {renderError('email')}
            <View className="mt-2 flex-row gap-3">
              <View className="flex-1">
                <EditableTextInput
                  label="Date of Birth"
                  value={draft.dateOfBirth || ''}
                  onChange={(t: string) => handleUpdate('dateOfBirth', t)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              <View className="flex-1">
                <EditableTextInput
                  label="Country"
                  value={draft.country || ''}
                  onChange={(t: string) => handleUpdate('country', t)}
                  placeholder="e.g. Germany"
                />
              </View>
            </View>
            <View className="mt-3">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-bold">Phone Numbers</Text>
                <TouchableOpacity
                  onPress={() =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            phones: [
                              ...((prev.phones || []).length
                                ? prev.phones!
                                : prev.phone
                                  ? [
                                      {
                                        id: Date.now().toString(),
                                        dial: '',
                                        number: (prev.phone || '').trim(),
                                      },
                                    ]
                                  : []),
                              { id: (Date.now() + 1).toString(), dial: '', number: '' },
                            ],
                          }
                        : prev
                    )
                  }>
                  <Text className="text-primary-600">+ Add Phone</Text>
                </TouchableOpacity>
              </View>
              {(draft.phones && draft.phones.length > 0
                ? draft.phones
                : draft.phone
                  ? [{ id: 'legacy', dial: '', number: (draft.phone || '').trim() }]
                  : []
              ).map((p, idx) => (
                <View key={p.id} className="mb-3 rounded-lg bg-white p-3">
                  <View className="mb-2 flex-row items-center">
                    <EditableTextInput
                      label="Dial Code"
                      value={p.dial}
                      onChange={(t: string) =>
                        setDraft((prev) =>
                          prev
                            ? {
                                ...prev,
                                phones: (
                                  prev.phones ||
                                  (prev.phone
                                    ? [{ id: 'legacy', dial: p.dial, number: p.number }]
                                    : [])
                                ).map((it) => (it.id === p.id ? { ...it, dial: t } : it)),
                              }
                            : prev
                        )
                      }
                      placeholder="+1"
                      className="mr-2 w-28"
                    />
                    <EditableTextInput
                      label={idx === 0 ? 'Phone Number' : 'Additional Phone'}
                      value={p.number}
                      onChange={(t: string) =>
                        setDraft((prev) =>
                          prev
                            ? {
                                ...prev,
                                phones: (
                                  prev.phones ||
                                  (prev.phone
                                    ? [{ id: 'legacy', dial: p.dial, number: p.number }]
                                    : [])
                                ).map((it) => (it.id === p.id ? { ...it, number: t } : it)),
                              }
                            : prev
                        )
                      }
                      keyboardType="phone-pad"
                      placeholder="555 123 4567"
                      className="flex-1"
                      required={idx === 0}
                      error={errors[idx === 0 ? 'phones.0.number' : `phones.${idx}.number`]}
                    />
                  </View>
                  <View className="mt-1 items-end">
                    {idx > 0 && (
                      <TouchableOpacity
                        onPress={() =>
                          setDraft((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  phones: (prev.phones || []).filter((it) => it.id !== p.id),
                                }
                              : prev
                          )
                        }>
                        <Text className="text-red-500">Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
            <EditableTextInput
              label="Website"
              value={draft.website || ''}
              onChange={(t: string) => handleUpdate('website', t)}
              placeholder="e.g. janedoe.dev"
            />
          </View>
        )}

        {step === 1 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Links (Optional)</Text>
            {(draft.links || []).map((lnk, idx) => (
              <View key={lnk.id} className="mb-3">
                <EditableTextInput
                  label="Platform/Domain (e.g., LinkedIn, Portfolio)"
                  value={lnk.label}
                  onChange={(t: string) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            links: (prev.links || []).map((l) =>
                              l.id === lnk.id ? { ...l, label: t } : l
                            ),
                          }
                        : prev
                    )
                  }
                />
                {renderError(`links.${idx}.label`)}
                <EditableTextInput
                  label="URL"
                  value={lnk.url}
                  onChange={(t: string) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            links: (prev.links || []).map((l) =>
                              l.id === lnk.id ? { ...l, url: t } : l
                            ),
                          }
                        : prev
                    )
                  }
                  placeholder="e.g. https://example.com/username"
                />
                {renderError(`links.${idx}.url`)}
                <View className="mt-1 items-end">
                  <TouchableOpacity
                    onPress={() =>
                      setDraft((prev) =>
                        prev
                          ? { ...prev, links: (prev.links || []).filter((l) => l.id !== lnk.id) }
                          : prev
                      )
                    }>
                    <Text className="text-red-500">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              onPress={() =>
                setDraft((prev) =>
                  prev
                    ? {
                        ...prev,
                        links: [
                          ...(prev.links || []),
                          { id: Date.now().toString(), label: '', url: '' } as LinkItem,
                        ],
                      }
                    : prev
                )
              }
              className="mt-1 flex-row items-center">
              <Ionicons name="add-circle" size={18} color="#25439A" />
              <Text className="ml-1 text-sm font-medium text-primary-600">Add link</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Professional Summary</Text>
            <EditableTextInput
              value={draft.summary || ''}
              onChange={(t: string) => handleUpdate('summary', t)}
              multiline
              placeholder="Write a brief summary of your professional background..."
              label={''}
            />
          </View>
        )}

        {step === 3 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">Work Experience</Text>
              <TouchableOpacity onPress={handleAddExperience} className="p-2">
                <Text className="text-primary-600">+ Add Experience</Text>
              </TouchableOpacity>
            </View>
            {draft.experience.map((exp, expIdx) => (
              <View key={exp.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Job Title"
                  value={exp.jobTitle}
                  onChange={(t: string) => handleUpdateExperience(exp.id, { jobTitle: t })}
                  required
                  error={errors[`experience.${expIdx}.jobTitle`]}
                />
                {renderError(`experience.${expIdx}.jobTitle`)}
                <EditableTextInput
                  label="Company"
                  value={exp.company}
                  onChange={(t: string) => handleUpdateExperience(exp.id, { company: t })}
                  required
                  error={errors[`experience.${expIdx}.company`]}
                />
                {renderError(`experience.${expIdx}.company`)}
                <View className="flex-row space-x-4">
                  <EditableTextInput
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(t: string) => handleUpdateExperience(exp.id, { startDate: t })}
                    className="flex-1"
                    required
                    error={errors[`experience.${expIdx}.startDate`]}
                  />
                  {renderError(`experience.${expIdx}.startDate`)}
                  {!exp.current && (
                    <EditableTextInput
                      label="End Date"
                      value={exp.endDate || ''}
                      onChange={(t: string) => handleUpdateExperience(exp.id, { endDate: t })}
                      className="flex-1"
                    />
                  )}
                </View>
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="mr-2">Current Job</Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateExperience(exp.id, { current: !exp.current })}
                      className={`h-6 w-6 rounded-md border ${exp.current ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                      {exp.current && <Text className="text-center text-white">✓</Text>}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveExperience(exp.id)}>
                    <Text className="text-red-500">Remove</Text>
                  </TouchableOpacity>
                </View>
                <Text className="mb-1 text-sm font-medium text-gray-700">Description</Text>
                {exp.description.map((point, idx) => (
                  <EditableTextInput
                    key={idx}
                    value={point}
                    onChange={(t: string) => {
                      const newDescription = [...exp.description];
                      newDescription[idx] = t;
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              experience: prev.experience.map((e) =>
                                e.id === exp.id ? { ...e, description: newDescription } : e
                              ),
                            }
                          : prev
                      );
                    }}
                    multiline
                    className="mb-2"
                    label={''}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => {
                    const newDescription = [...exp.description, ''];
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            experience: prev.experience.map((e) =>
                              e.id === exp.id ? { ...e, description: newDescription } : e
                            ),
                          }
                        : prev
                    );
                  }}
                  className="py-1">
                  <Text className="text-primary-600">+ Add bullet point</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {step === 4 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">Education</Text>
              <TouchableOpacity onPress={handleAddEducation} className="p-2">
                <Text className="text-primary-600">+ Add Education</Text>
              </TouchableOpacity>
            </View>
            {draft.education.map((edu: Education, eduIdx: number) => (
              <View key={edu.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Institution"
                  value={edu.institution}
                  onChange={(t: string) => handleUpdateEducation(edu.id, { institution: t })}
                  required
                  error={errors[`education.${eduIdx}.institution`]}
                />
                {renderError(`education.${eduIdx}.institution`)}
                <EditableTextInput
                  label="Degree"
                  value={edu.degree}
                  onChange={(t: string) => handleUpdateEducation(edu.id, { degree: t })}
                />
                <EditableTextInput
                  label="Field of Study"
                  value={edu.fieldOfStudy || ''}
                  onChange={(t: string) => handleUpdateEducation(edu.id, { fieldOfStudy: t })}
                />
                <View className="flex-row space-x-4">
                  <EditableTextInput
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(t: string) => handleUpdateEducation(edu.id, { startDate: t })}
                    className="flex-1"
                    required
                    error={errors[`education.${eduIdx}.startDate`]}
                  />
                  {renderError(`education.${eduIdx}.startDate`)}
                  {!edu.current && (
                    <EditableTextInput
                      label="End Date"
                      value={edu.endDate || ''}
                      onChange={(t: string) => handleUpdateEducation(edu.id, { endDate: t })}
                      className="flex-1"
                    />
                  )}
                </View>
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="mr-2">Currently Studying</Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateEducation(edu.id, { current: !edu.current })}
                      className={`h-6 w-6 rounded-md border ${edu.current ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
                      {edu.current && <Text className="text-center text-white">✓</Text>}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveEducation(edu.id)}>
                    <Text className="text-red-500">Remove</Text>
                  </TouchableOpacity>
                </View>
                <EditableTextInput
                  label="Description"
                  value={edu.description || ''}
                  onChange={(t: string) => handleUpdateEducation(edu.id, { description: t })}
                  multiline
                />
              </View>
            ))}
          </View>
        )}

        {step === 5 && (
          <View className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">Skills</Text>
              <TouchableOpacity onPress={handleAddSkill} className="p-2">
                <Text className="text-primary-600">+ Add Skill</Text>
              </TouchableOpacity>
            </View>
            {draft.skills.map((sk: Skill) => (
              <View key={sk.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Skill"
                  value={sk.name}
                  onChange={(t: string) => handleUpdateSkill(sk.id, { name: t })}
                />
                <EditableTextInput
                  label="Category"
                  value={sk.category || ''}
                  onChange={(t: string) => handleUpdateSkill(sk.id, { category: t })}
                />
                <EditableTextInput
                  label="Proficiency (beginner/intermediate/advanced/expert)"
                  value={sk.proficiency || ''}
                  onChange={(t: string) => handleUpdateSkill(sk.id, { proficiency: t as any })}
                />
                <View className="items-end">
                  <TouchableOpacity onPress={() => handleRemoveSkill(sk.id)}>
                    <Text className="text-red-500">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <FooterNav />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// loadResume is provided by useResume()
