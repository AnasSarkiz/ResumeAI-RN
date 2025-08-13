// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
// import { Link } from 'expo-router';

// const onboardingData = [
//   {
//     id: '1',
//     title: 'Create Professional Resumes',
//     description: 'Build polished resumes with our easy-to-use editor',
//     image: require('../../assets/ResumeAILogo.png'),
//   },
//   {
//     id: '2',
//     title: 'AI-Powered Enhancements',
//     description: 'Get smart suggestions to improve your resume',
//     image: require('../../assets/ResumeAILogo.png'),
//   },
//   {
//     id: '3',
//     title: 'Export to PDF',
//     description: 'Download and share your resume with employers',
//     image: require('../../assets/ResumeAILogo.png'),
//   },
// ];

// export default function OnboardingScreen() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleNext = () => {
//     if (currentIndex < onboardingData.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1);
//     }
//   };

//   return (
//     <View className="flex-1 bg-white">
//       <FlatList
//         data={onboardingData}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={(e) => {
//           const index = Math.round(
//             e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
//           );
//           setCurrentIndex(index);
//         }}
//         renderItem={({ item }) => (
//           <View className="w-screen flex-1 items-center justify-center p-6">
//             <Image source={item.image} className="mb-8 h-64 w-64" />
//             <Text className="mb-4 text-center text-2xl font-bold">{item.title}</Text>
//             <Text className="mb-8 text-center text-lg text-gray-600">{item.description}</Text>
//           </View>
//         )}
//       />

//       <View className="mb-8 flex-row justify-center">
//         {onboardingData.map((_, index) => (
//           <View
//             key={index}
//             className={`mx-1 h-2 w-2 rounded-full ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`}
//           />
//         ))}
//       </View>

//       <View className="px-6 pb-8">
//         {currentIndex === onboardingData.length - 1 ? (
//           <Link href="./home" asChild>
//             <TouchableOpacity className="rounded-full bg-blue-500 py-3">
//               <Text className="text-center text-lg font-medium text-white">Get Started</Text>
//             </TouchableOpacity>
//           </Link>
//         ) : (
//           <View className="flex-row justify-between">
//             <TouchableOpacity
//               onPress={handlePrevious}
//               disabled={currentIndex === 0}
//               className={`px-6 py-3 ${currentIndex === 0 ? 'opacity-0' : ''}`}>
//               <Text className="font-medium text-blue-500">Back</Text>
//             </TouchableOpacity>
// 
//             <TouchableOpacity onPress={handleNext} className="rounded-full bg-blue-500 px-6 py-3">
//               <Text className="font-medium text-white">Next</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }
