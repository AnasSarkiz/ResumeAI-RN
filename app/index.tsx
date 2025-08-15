import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(main)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
}
