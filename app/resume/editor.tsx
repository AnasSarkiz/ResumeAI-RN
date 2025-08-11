import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Keyboard, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { ResumeSectionCard } from '../../components/ResumeSectionCard';
import { EditableTextInput } from '../../components/EditableTextInput';
import { AIButton } from '../../components/AIButton';
import { ExportPDFButton } from '../../components/ExportPDFButton';
import { Experience, ResumeSection, Resume, Education, Skill, LinkItem } from '../../types/resume';
import { validateResume } from '../../services/resume';
import { useAuth } from '../../context/AuthContext';


export default function ResumeEditorScreen() {
  const { id } = useLocalSearchParams();
  const { currentResume, updateResume, loading, loadResume, saving } = useResume();
  const { user } = useAuth();
  const router = useRouter();
  // const { isPro } = useSubscription();
  const isPro = user?.isPro;
  const [activeSection, setActiveSection] = useState<ResumeSection>('experience');
  const [selectedText, setSelectedText] = useState('');
  const [draft, setDraft] = useState<Resume | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const countryOptions = [
    { code: 'US', flag: '🇺🇸', dial: '+1', label: 'United States' },
    { code: 'GB', flag: '🇬🇧', dial: '+44', label: 'United Kingdom' },
    { code: 'CA', flag: '🇨🇦', dial: '+1', label: 'Canada' },
    { code: 'DE', flag: '🇩🇪', dial: '+49', label: 'Germany' },
    { code: 'FR', flag: '🇫🇷', dial: '+33', label: 'France' },
    { code: 'SA', flag: '🇸🇦', dial: '+966', label: 'Saudi Arabia' },
    { code: 'AE', flag: '🇦🇪', dial: '+971', label: 'UAE' },
    { code: 'IN', flag: '🇮🇳', dial: '+91', label: 'India' },
    { code: 'EG', flag: '🇪🇬', dial: '+20', label: 'Egypt' },
  ];
  
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadResume(id);
    }
  }, [id]);

  const renderError = (key: string) =>
    errors[key] ? <Text className="mt-1 text-xs text-red-500">{errors[key]}</Text> : null;

  const handleValidateAndSave = async (opts?: { goPreview?: boolean }) => {
    if (!draft || !currentResume) return;
    const { valid, errors: errs } = validateResume(draft);
    setErrors(errs);
    if (!valid) {
      Alert.alert('Missing required fields', 'Please fill all required fields highlighted in red.');
      return;
    }
    // Backward compat: write legacy phone from first phones[] if present
    const toSave = (() => {
      if (Array.isArray((draft as any).phones) && (draft as any).phones.length > 0) {
        const first = (draft as any).phones[0];
        return { ...draft, phone: `${first.dial} ${first.number}`.trim() } as Resume;
      }
      return draft;
    })();
    await updateResume(currentResume.id, toSave);
    if (opts?.goPreview) {
      router.push(`/resume/preview?id=${currentResume.id}`);
    }
  };

  useEffect(() => {
    if (currentResume) {
      let merged = currentResume;
      if ((!merged.fullName || merged.fullName.trim().length === 0) && user?.name) {
        merged = { ...merged, fullName: user.name } as Resume;
      }
      if ((!merged.email || merged.email.trim().length === 0) && user?.email) {
        merged = { ...merged, email: user.email } as Resume;
      }
      setDraft(merged);
    }
  }, [currentResume, user]);

  if (loading || !currentResume || !draft) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleUpdate = (field: keyof Resume, value: any) => {
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

    setDraft((prev) => (prev ? { ...prev, experience: [...prev.experience, newExperience] } : prev));
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

  const handleUpdateEducation = (eduId: string, updates: Partial<import('../../types/resume').Education>) => {
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

  const handleUpdateSkill = (skillId: string, updates: Partial<import('../../types/resume').Skill>) => {
    const updatedSkills = draft.skills.map((s) => (s.id === skillId ? { ...s, ...updates } : s));
    setDraft((prev) => (prev ? { ...prev, skills: updatedSkills } : prev));
  };

  // Remove item helpers
  const handleRemoveExperience = (expId: string) => {
    setDraft((prev) => (prev ? { ...prev, experience: prev.experience.filter((e) => e.id !== expId) } : prev));
  };
  const handleRemoveEducation = (eduId: string) => {
    setDraft((prev) => (prev ? { ...prev, education: prev.education.filter((e) => e.id !== eduId) } : prev));
  };
  const handleRemoveSkill = (skillId: string) => {
    setDraft((prev) => (prev ? { ...prev, skills: prev.skills.filter((s) => s.id !== skillId) } : prev));
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top header with Save */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
        <Text className="text-lg font-semibold text-gray-800">Edit Resume</Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleValidateAndSave({ goPreview: true })}
            className="rounded-full border border-gray-300 px-4 py-2 mr-2"
          >
            <Text className="text-gray-700">Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleValidateAndSave()}
            className="rounded-full border border-blue-500 px-4 py-2"
          >
            <Text className="text-blue-500">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="p-4" keyboardShouldPersistTaps="handled">
        <View className="mb-6">
          <EditableTextInput
            label="Resume Title"
            value={draft.title}
            onChange={(text: string) => handleUpdate('title', text)}
            placeholder="e.g. Senior iOS Engineer"
            required
            error={errors['title']}
          />
          {renderError('title')}
          {saving && (
            <Text className="mt-1 text-xs text-gray-500">Saving…</Text>
          )}

          <Text className="mb-2 text-lg font-bold">Personal Information</Text>
          <EditableTextInput
            label="Full Name"
            value={draft.fullName}
            onChange={(text: string) => handleUpdate('fullName', text)}
            autoCapitalize="words"
            placeholder="e.g. Jane Doe"
            required
            error={errors['fullName']}
          />
          {renderError('fullName')}
          <EditableTextInput
            label="Email"
            value={draft.email}
            onChange={(text: string) => handleUpdate('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="e.g. jane@example.com"
            required
            error={errors['email']}
          />
          {renderError('email')}
          {/* Phone Numbers */}
          <View className="mt-2">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Phone Numbers</Text>
              <TouchableOpacity
                onPress={() =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          phones: [
                            ...((prev.phones || []).length ? prev.phones! : (
                              prev.phone
                                ? [{ id: Date.now().toString(), dial: selectedCountry.dial, number: (prev.phone || '').replace(selectedCountry.dial, '').trim(), countryCode: selectedCountry.code }]
                                : []
                            )),
                            { id: (Date.now() + 1).toString(), dial: selectedCountry.dial, number: '', countryCode: selectedCountry.code },
                          ],
                          // keep legacy phone untouched until save
                        }
                      : prev
                  )
                }
              >
                <Text className="text-blue-500">+ Add Phone</Text>
              </TouchableOpacity>
            </View>
            {(draft.phones && draft.phones.length > 0
              ? draft.phones
              : (draft.phone ? [{ id: 'legacy', dial: selectedCountry.dial, number: (draft.phone || '').replace(selectedCountry.dial, '').trim(), countryCode: selectedCountry.code }] : [])
            ).map((p, idx) => (
              <View key={p.id} className="mb-3 rounded-lg bg-white p-3">
                <View className="mb-2 flex-row items-center">
                  <EditableTextInput
                    label="Dial Code"
                    value={p.dial}
                    onChange={(text: string) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              phones: (prev.phones || (prev.phone ? [{ id: 'legacy', dial: p.dial, number: p.number }] : []))
                                .map((it) => (it.id === p.id ? { ...it, dial: text } : it)),
                            }
                          : prev
                      )
                    }
                    placeholder="+1"
                    className="w-28 mr-2"
                  />
                  <EditableTextInput
                    label={idx === 0 ? 'Phone Number' : 'Additional Phone'}
                    value={p.number}
                    onChange={(text: string) =>
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              phones: (prev.phones || (prev.phone ? [{ id: 'legacy', dial: p.dial, number: p.number }] : []))
                                .map((it) => (it.id === p.id ? { ...it, number: text } : it)),
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
                          prev ? { ...prev, phones: (prev.phones || []).filter((it) => it.id !== p.id) } : prev
                        )
                      }
                    >
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
            onChange={(text: string) => handleUpdate('website', text)}
            placeholder="e.g. janedoe.dev"
          />

          {/* Flexible Links */}
          <View className="mt-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Links (Optional)</Text>
              <TouchableOpacity
                onPress={() =>
                  setDraft((prev) =>
                    prev
                      ? { ...prev, links: [...(prev.links || []), { id: Date.now().toString(), label: '', url: '' } as LinkItem] }
                      : prev
                  )
                }
                className="p-2"
              >
                <Text className="text-blue-500">+ Add Link</Text>
              </TouchableOpacity>
            </View>
            {(draft.links || []).map((lnk, idx) => (
              <View key={lnk.id} className="mb-3 rounded-lg bg-white p-3">
                <EditableTextInput
                  label="Platform/Domain (e.g., LinkedIn, Portfolio)"
                  value={lnk.label}
                  onChange={(text: string) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            links: (prev.links || []).map((l) => (l.id === lnk.id ? { ...l, label: text } : l)),
                          }
                        : prev
                    )
                  }
                />
                {renderError(`links.${idx}.label`)}
                <EditableTextInput
                  label="URL"
                  value={lnk.url}
                  onChange={(text: string) =>
                    setDraft((prev) =>
                      prev
                        ? {
                            ...prev,
                            links: (prev.links || []).map((l) => (l.id === lnk.id ? { ...l, url: text } : l)),
                          }
                        : prev
                    )
                  }
                  placeholder="e.g. https://example.com/username"
                />
                {renderError(`links.${idx}.url`)}
                <View className="items-end mt-1">
                  <TouchableOpacity
                    onPress={() =>
                      setDraft((prev) =>
                        prev ? { ...prev, links: (prev.links || []).filter((l) => l.id !== lnk.id) } : prev
                      )
                    }
                  >
                    <Text className="text-red-500">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-2">
          <Text className="mb-2 text-lg font-bold">Sections</Text>
          <ResumeSectionCard
            title={`Summary${currentResume.summary ? '' : ''}`}
            active={activeSection === 'summary'}
            onPress={() => setActiveSection('summary')}
          />
          <ResumeSectionCard
            title={`Experience (${draft.experience.length})`}
            active={activeSection === 'experience'}
            onPress={() => setActiveSection('experience')}
          />
          <ResumeSectionCard
            title={`Education (${draft.education.length})`}
            active={activeSection === 'education'}
            onPress={() => setActiveSection('education')}
          />
          <ResumeSectionCard
            title={`Skills (${draft.skills.length})`}
            active={activeSection === 'skills'}
            onPress={() => setActiveSection('skills')}
          />
          <View className="mt-3 items-end">
            <TouchableOpacity
              onPress={async () => {
                await handleValidateAndSave();
                if (currentResume?.id) {
                  router.push(`/resume/templates?id=${currentResume.id}`);
                }
              }}
              className="rounded-full bg-indigo-600 px-4 py-2"
            >
              <Text className="font-semibold text-white">Choose Template</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Per-section action bar directly below section tabs */}
        <View className="mb-4">
          {activeSection === 'experience' && (
            <View className="flex-row items-center justify-end">
              <TouchableOpacity onPress={handleAddExperience} className="p-2">
                <Text className="text-blue-500">+ Add Experience</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeSection === 'education' && (
            <View className="flex-row items-center justify-end">
              <TouchableOpacity onPress={handleAddEducation} className="p-2">
                <Text className="text-blue-500">+ Add Education</Text>
              </TouchableOpacity>
            </View>
          )}
          {activeSection === 'skills' && (
            <View className="flex-row items-center justify-end">
              <TouchableOpacity onPress={handleAddSkill} className="p-2">
                <Text className="text-blue-500">+ Add Skill</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {activeSection === 'summary' && (
          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold">Professional Summary</Text>
            <EditableTextInput
              value={draft.summary || ''}
              onChange={(text: string) => handleUpdate('summary', text)}
              multiline
              placeholder="Write a brief summary of your professional background..."
              label={''}
            />
            <AIButton
              action="improve-summary"
              context={draft.summary || ''}
              disabled={!isPro}
              className="mt-2"
            />
          </View>
        )}

        {activeSection === 'experience' && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Work Experience</Text>
            </View>

            {draft.experience.map((exp, expIdx) => (
              <View key={exp.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Job Title"
                  value={exp.jobTitle}
                  onChange={(text: string) => handleUpdateExperience(exp.id, { jobTitle: text })}
                  required
                  error={errors[`experience.${expIdx}.jobTitle`]}
                />
                {renderError(`experience.${expIdx}.jobTitle`)}
                <EditableTextInput
                  label="Company"
                  value={exp.company}
                  onChange={(text: string) => handleUpdateExperience(exp.id, { company: text })}
                  required
                  error={errors[`experience.${expIdx}.company`]}
                />
                {renderError(`experience.${expIdx}.company`)}
                <View className="flex-row space-x-4">
                  <EditableTextInput
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(text: string) => handleUpdateExperience(exp.id, { startDate: text })}
                    className="flex-1"
                    required
                    error={errors[`experience.${expIdx}.startDate`]}
                  />
                  {renderError(`experience.${expIdx}.startDate`)}
                  {!exp.current && (
                    <EditableTextInput
                      label="End Date"
                      value={exp.endDate || ''}
                      onChange={(text: string) => handleUpdateExperience(exp.id, { endDate: text })}
                      className="flex-1"
                    />
                  )}
                </View>
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="mr-2">Current Job</Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateExperience(exp.id, { current: !exp.current })}
                      className={`h-6 w-6 rounded-md border ${exp.current ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                    >
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
                    onChange={(text: string) => {
                      const newDescription = [...exp.description];
                      newDescription[idx] = text;
                      setDraft((prev) => (prev ? { ...prev, experience: prev.experience.map((e) => (e.id === exp.id ? { ...e, description: newDescription } : e)) } : prev));
                    }}
                    multiline
                    className="mb-2"
                    label={''}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => {
                    const newDescription = [...exp.description, ''];
                    setDraft((prev) => (prev ? { ...prev, experience: prev.experience.map((e) => (e.id === exp.id ? { ...e, description: newDescription } : e)) } : prev));
                  }}
                  className="py-1"
                >
                  <Text className="text-blue-500">+ Add bullet point</Text>
                </TouchableOpacity>

                <View className="mt-2">
                  <AIButton
                    action="generate-bullet-points"
                    context={{ resume: draft, targetExperienceId: exp.id }}
                    targetExpId={exp.id}
                    disabled={!isPro}
                    onBulletsGenerated={(bullets) => {
                      setDraft((prev) =>
                        prev
                          ? {
                              ...prev,
                              experience: prev.experience.map((e) =>
                                e.id === exp.id ? { ...e, description: [...e.description, ...bullets] } : e
                              ),
                            }
                          : prev
                      );
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'education' && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Education</Text>
            </View>

            {draft.education.map((edu: Education, eduIdx: number) => (
              <View key={edu.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Institution"
                  value={edu.institution}
                  onChange={(text: string) => handleUpdateEducation(edu.id, { institution: text })}
                  required
                  error={errors[`education.${eduIdx}.institution`]}
                />
                {renderError(`education.${eduIdx}.institution`)}
                <EditableTextInput
                  label="Degree"
                  value={edu.degree}
                  onChange={(text: string) => handleUpdateEducation(edu.id, { degree: text })}
                />
                <EditableTextInput
                  label="Field of Study"
                  value={edu.fieldOfStudy || ''}
                  onChange={(text: string) => handleUpdateEducation(edu.id, { fieldOfStudy: text })}
                />
                <View className="flex-row space-x-4">
                  <EditableTextInput
                    label="Start Date"
                    value={edu.startDate}
                    onChange={(text: string) => handleUpdateEducation(edu.id, { startDate: text })}
                    className="flex-1"
                    required
                    error={errors[`education.${eduIdx}.startDate`]}
                  />
                  {renderError(`education.${eduIdx}.startDate`)}
                  {!edu.current && (
                    <EditableTextInput
                      label="End Date"
                      value={edu.endDate || ''}
                      onChange={(text: string) => handleUpdateEducation(edu.id, { endDate: text })}
                      className="flex-1"
                    />
                  )}
                </View>
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="mr-2">Currently Studying</Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateEducation(edu.id, { current: !edu.current })}
                      className={`h-6 w-6 rounded-md border ${edu.current ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                    >
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
                  onChange={(text: string) => handleUpdateEducation(edu.id, { description: text })}
                  multiline
                />
              </View>
            ))}
          </View>
        )}

        {activeSection === 'skills' && (
          <View className="mb-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Skills</Text>
            </View>

            {draft.skills.map((sk: Skill) => (
              <View key={sk.id} className="mb-4 rounded-lg bg-white p-4">
                <EditableTextInput
                  label="Skill"
                  value={sk.name}
                  onChange={(text: string) => handleUpdateSkill(sk.id, { name: text })}
                />
                <EditableTextInput
                  label="Category"
                  value={sk.category || ''}
                  onChange={(text: string) => handleUpdateSkill(sk.id, { category: text })}
                />
                <EditableTextInput
                  label="Proficiency (beginner/intermediate/advanced/expert)"
                  value={sk.proficiency || ''}
                  onChange={(text: string) => handleUpdateSkill(sk.id, { proficiency: text as any })}
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

      </ScrollView>

      {/* bottom toolbar removed; Save moved to header */}
    </View>
  );
}

// loadResume is provided by useResume()
