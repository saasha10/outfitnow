import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@screens/index';
import { RootStackParamList } from '@app-types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
