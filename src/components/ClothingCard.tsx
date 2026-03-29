import { Image } from 'react-native';
import { Card, Text, YStack } from 'tamagui';

import { ClothingItem } from '@app-types/index';

interface ClothingCardProps {
  item: ClothingItem;
  onPress: () => void;
}

export default function ClothingCard({ item, onPress }: ClothingCardProps) {
  return (
    <Card
      elevation="$1"
      flex={1}
      m="$1.5"
      onPress={onPress}
      overflow="hidden"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Image
        source={{ uri: item.imageUri }}
        style={{ width: '100%', height: 150 }}
        resizeMode="cover"
      />
      <YStack p="$2" gap="$1">
        <Text fontSize="$3" fontWeight="600" textTransform="capitalize">
          {item.type}
        </Text>
        <Text fontSize="$2" color="$gray10">
          {item.color}
        </Text>
      </YStack>
    </Card>
  );
}
