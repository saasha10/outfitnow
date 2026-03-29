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
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: 150 }}
          resizeMode="cover"
        />
      ) : (
        <YStack width="100%" height={150} bg="$gray3" justify="center" items="center">
          <Text color="$gray9" fontSize="$2">No image</Text>
        </YStack>
      )}
      <YStack p="$2" gap="$1">
        <Text fontSize="$3" fontWeight="600">
          {item.name}
        </Text>
        <Text fontSize="$2" color="$gray10" textTransform="capitalize">
          {item.category} · {item.color}
        </Text>
      </YStack>
    </Card>
  );
}
