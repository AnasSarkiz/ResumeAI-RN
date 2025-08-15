import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}
