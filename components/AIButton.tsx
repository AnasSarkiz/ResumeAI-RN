import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useResume } from '../context/ResumeContext';
import { useSubscription } from '../context/SubscriptionContext';
import { AIAction } from '../types/resume';
import { generateBulletPoints, rewordText, improveSummary } from '../services/ai';
import { SubscriptionLock } from './SubscriptionLock';

interface AIButtonProps {
  action: AIAction;
  context: any;
  disabled?: boolean;
  className?: string;
  targetExpId?: string;
  onBulletsGenerated?: (bullets: string[]) => void;
}

export const AIButton: React.FC<AIButtonProps> = ({
  action,
  context,
  disabled = false,
  className = '',
  targetExpId,
  onBulletsGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  // const { isPro } = useSubscription();
  const isPro = true;
  const { currentResume, updateResume } = useResume();

  const handleAIAction = async () => {
    if (!isPro) {
      Alert.alert('Pro Feature', 'Upgrade to Pro to access AI features');
      return;
    }

    setLoading(true);
    try {
      let result: string | string[];

      switch (action) {
        case 'generate-bullet-points':
          // Determine jobTitle from context
          let derivedJobTitle: string | undefined = context?.jobTitle;
          if (!derivedJobTitle && context?.resume) {
            const exps = Array.isArray(context.resume.experience) ? context.resume.experience : [];
            const target = exps.find((e: any) => e?.id === context.targetExperienceId) || exps[exps.length - 1];
            derivedJobTitle = target?.jobTitle;
          }
          result = await generateBulletPoints(
            derivedJobTitle || 'current position',
            JSON.stringify(context)
          );
          if (Array.isArray(result) && result.length > 0) {
            // If consumer wants to handle locally, pass back and return
            if (onBulletsGenerated) {
              onBulletsGenerated(result as string[]);
              break;
            }
            // Update targeted experience or fallback to last item
            if (currentResume?.experience && currentResume.experience.length > 0) {
              const targetId = targetExpId || currentResume.experience[currentResume.experience.length - 1].id;
              const updated = currentResume.experience.map((exp) =>
                exp.id === targetId
                  ? { ...exp, description: [...exp.description, ...result as string[]] }
                  : exp
              );
              await updateResume(currentResume.id, { experience: updated });
            }
          }
          break;

        case 'reword-text':
          result = await rewordText(context);
          return result;

        case 'improve-summary':
          result = await improveSummary(context);
          if (currentResume) {
            await updateResume(currentResume.id, { summary: result });
          }
          break;

        default:
          throw new Error('Unsupported AI action');
      }
    } catch (error) {
      console.error('AI action failed:', error);
      Alert.alert('Error', 'Failed to perform AI action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className={`relative ${className}`}>
      <TouchableOpacity
        onPress={handleAIAction}
        disabled={disabled || loading}
        className={`flex-row items-center justify-center rounded-full px-4 py-2 ${disabled ? 'bg-gray-300' : 'bg-blue-500'}`}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="mr-2 font-medium text-white">AI Enhance</Text>
          </>
        )}
      </TouchableOpacity>
      {!isPro && <SubscriptionLock />}
    </View>
  );
};
