import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';

const onboardingData = [
  {
    id: '1',
    title: 'Create Professional Resumes',
    description: 'Build polished resumes with our easy-to-use editor',
    image: require('../../assets/ResumeAILogo.png'),
  },
  {
    id: '2',
    title: 'AI-Powered Enhancements',
    description: 'Get smart suggestions to improve your resume',
    image: require('../../assets/ResumeAILogo.png'),
  },
  {
    id: '3',
    title: 'Export to PDF',
    description: 'Download and share your resume with employers',
    image: require('../../assets/ResumeAILogo.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center p-6 w-screen">
            <Image source={item.image} className="w-64 h-64 mb-8" />
            <Text className="text-2xl font-bold text-center mb-4">{item.title}</Text>
            <Text className="text-lg text-gray-600 text-center mb-8">{item.description}</Text>
          </View>
        )}
      />
      
      <View className="flex-row justify-center mb-8">
        {onboardingData.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </View>
      
      <View className="px-6 pb-8">
        {currentIndex === onboardingData.length - 1 ? (
          <Link href="./home" asChild>
            <TouchableOpacity className="bg-blue-500 py-3 rounded-full">
              <Text className="text-white text-center font-medium text-lg">Get Started</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentIndex === 0}
              className={`py-3 px-6 ${currentIndex === 0 ? 'opacity-0' : ''}`}
            >
              <Text className="text-blue-500 font-medium">Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleNext}
              className="bg-blue-500 py-3 px-6 rounded-full"
            >
              <Text className="text-white font-medium">Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}