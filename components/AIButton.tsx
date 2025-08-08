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
}

export const AIButton: React.FC<AIButtonProps> = ({
  action,
  context,
  disabled = false,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const { isPro } = useSubscription();
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
          result = await generateBulletPoints(context.jobTitle || 'current position', JSON.stringify(context));
          if (Array.isArray(result) && result.length > 0) {
            // Update the last experience item's description
            if (currentResume?.experience && currentResume.experience.length > 0) {
              const lastExp = currentResume.experience[currentResume.experience.length - 1];
              const updatedExp = {
                ...lastExp,
                description: [...lastExp.description, ...result],
              };
              
              const updatedExperience = [
                ...currentResume.experience.slice(0, -1),
                updatedExp,
              ];
              
              await updateResume(currentResume.id, { experience: updatedExperience });
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
        className={`flex-row items-center justify-center py-2 px-4 rounded-full ${disabled ? 'bg-gray-300' : 'bg-blue-500'}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="text-white font-medium mr-2">AI Enhance</Text>
          </>
        )}
      </TouchableOpacity>
      {!isPro && <SubscriptionLock />}
    </View>
  );
};