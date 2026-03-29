import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { Button, Text, YStack } from 'tamagui';

import { ClothingItem } from '@app-types/index';
import { RootStackParamList } from '@app-types/navigation';
import ClothingCard from '@components/ClothingCard';
import { getClothingItems } from '@services/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Wardrobe'>;

export default function WardrobeScreen() {
    const navigation = useNavigation<Nav>();
    const [items, setItems] = useState<ClothingItem[]>([]);

    useFocusEffect(
        useCallback(() => {
            getClothingItems().then(setItems);
        }, [])
    );

    if (items.length === 0) {
        return (
            <YStack flex={1} justify="center" items="center" p="$5" bg="$background">
                <Text fontSize="$5" color="$gray9">
                    Your wardrobe is empty
                </Text>
                <Text fontSize="$3" color="$gray8" mt="$2">
                    Add some clothing items to get started!
                </Text>
                <Button
                    size="$5"
                    theme="accent"
                    mt="$5"
                    onPress={() => navigation.navigate('AddClothing')}
                >
                    Add Clothing
                </Button>
            </YStack>
        );
    }

    return (
        <YStack flex={1} bg="$background">
            <FlatList
                data={items}
                numColumns={2}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 8 }}
                renderItem={({ item }) => (
                    <ClothingCard
                        item={item}
                        onPress={() => navigation.navigate('ClothingDetail', { itemId: item.id })}
                    />
                )}
            />
        </YStack>
    );
}
