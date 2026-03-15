import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, H2, Text, YStack } from 'tamagui';

import { RootStackParamList } from '@app-types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} justify="center" items="center" p="$5" pt={insets.top} gap="$4" bg="$background">
      <H2>OutfitNow</H2>
      <Text color="$gray10" text="center">
        Tu estilo, tu momento.
      </Text>

      <YStack gap="$3" width="100%" maxW={300} mt="$6">
        <Button size="$5" theme="accent" onPress={() => navigation.navigate('AddClothing')}>
          Add Clothing
        </Button>
        <Button size="$5" variant="outlined" onPress={() => navigation.navigate('Wardrobe')}>
          View Wardrobe
        </Button>
      </YStack>
    </YStack>
  );
}
