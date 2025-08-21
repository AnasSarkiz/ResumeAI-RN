import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, FlatList, ViewToken } from 'react-native';
import { router } from 'expo-router';
import AppButton from '../../components/AppButton';

type Slide = { id: string; title: string; description: string; image: any };

export default function OnboardingScreen() {
  const slides: Slide[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Create Professional Resumes',
        description: 'Build polished resumes with our easy-to-use editor.',
        image: require('../../assets/icon.png'),
      },
      {
        id: '2',
        title: 'AI-Powered Enhancements',
        description: 'Let AI generate and refine bullet points and summaries.',
        image: require('../../assets/icon.png'),
      },
      {
        id: '3',
        title: 'Export to PDF',
        description: 'Pick a template and export a job-ready PDF in seconds.',
        image: require('../../assets/icon.png'),
      },
    ],
    []
  );

  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems?.length) {
      const i = viewableItems[0].index ?? 0;
      setIndex(i);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  const goNext = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      router.replace('./home');
    }
  };

  const goBack = () => {
    if (index > 0) listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View className="w-screen flex-1 items-center justify-center p-6">
            <Image source={item.image} className="mb-8 h-48 w-48" />
            <Text className="mb-2 text-center text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              {item.title}
            </Text>
            <Text className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Pagination */}
      <View className="mb-6 flex-row justify-center">
        {slides.map((_, i) => (
          <View
            key={i}
            className={`mx-1 h-2 w-2 rounded-full ${
              i === index ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </View>

      {/* Actions */}
      <View className="mb-10 px-6">
        {index === slides.length - 1 ? (
          <AppButton title="Get Started" onPress={() => router.replace('./home')} />
        ) : (
          <View className="flex-row justify-between gap-3">
            <View className="w-1/3">
              <AppButton title="Back" variant="secondary" onPress={goBack} disabled={index === 0} />
            </View>
            <View className="w-2/3">
              <AppButton title="Next" onPress={goNext} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
