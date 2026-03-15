import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '@app-types/navigation';
import {
  HomeScreen,
  AddClothingScreen,
  WardrobeScreen,
  ClothingDetailScreen,
} from '@screens/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddClothing" component={AddClothingScreen} options={{ title: 'Add Clothing' }} />
      <Stack.Screen name="Wardrobe" component={WardrobeScreen} options={{ title: 'My Wardrobe' }} />
      <Stack.Screen name="ClothingDetail" component={ClothingDetailScreen} options={{ title: 'Item Detail' }} />
    </Stack.Navigator>
  );
}
