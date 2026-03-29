import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Image } from 'react-native';
import { Button, ScrollView, Text, YStack } from 'tamagui';

import { ClothingItem } from '@app-types/index';
import { RootStackParamList } from '@app-types/navigation';
import { getClothingItems, deleteClothingItem } from '@services/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ClothingDetail'>;
type DetailRoute = RouteProp<RootStackParamList, 'ClothingDetail'>;

export default function ClothingDetailScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<DetailRoute>();
    const [item, setItem] = useState<ClothingItem | null>(null);

    useEffect(() => {
        getClothingItems().then((items) => {
            const found = items.find((i) => i.id === route.params.itemId);
            setItem(found ?? null);
        });
    }, [route.params.itemId]);

    const handleDelete = () => {
        if (!item) return;
        Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteClothingItem(item.id);
                    navigation.goBack();
                },
            },
        ]);
    };

    if (!item) {
        return (
            <YStack flex={1} justify="center" items="center" bg="$background">
                <Text color="$gray9">Item not found</Text>
            </YStack>
        );
    }

    return (
        <ScrollView flex={1} bg="$background" contentContainerStyle={{ pb: 40 }}>
            <YStack gap="$4" p="$4">
                <Image
                    source={{ uri: item.imageUri }}
                    style={{ width: '100%', height: 350, borderRadius: 16 }}
                    resizeMode="cover"
                />

                <YStack gap="$2">
                    <Text fontSize="$8" fontWeight="700" textTransform="capitalize">
                        {item.type}
                    </Text>
                    <Text fontSize="$5" color="$gray10">
                        Color: {item.color}
                    </Text>
                    {item.season && (
                        <Text fontSize="$5" color="$gray10" textTransform="capitalize">
                            Season: {item.season}
                        </Text>
                    )}
                </YStack>

                <Button size="$5" theme="red" onPress={handleDelete} mt="$4">
                    Delete Item
                </Button>
            </YStack>
        </ScrollView>
    );
}
