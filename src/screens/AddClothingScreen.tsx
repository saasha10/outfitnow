import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image } from 'react-native';
import { Button, Input, ScrollView, Text, XStack, YStack } from 'tamagui';

import { ClothingCategory, ClothingItem, Season } from '@app-types/index';
import { RootStackParamList } from '@app-types/navigation';
import { addClothingItem } from '@services/storage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'AddClothing'>;

const CATEGORIES: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];
const SEASONS: Season[] = ['summer', 'winter', 'spring', 'autumn', 'all'];

export default function AddClothingScreen() {
    const navigation = useNavigation<Nav>();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState<ClothingCategory>('top');
    const [type, setType] = useState('');
    const [color, setColor] = useState('');
    const [season, setSeason] = useState<Season | undefined>(undefined);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the photo library is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            legacy: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!imageUri) {
            Alert.alert('Missing image', 'Please select an image first.');
            return;
        }
        if (!name.trim()) {
            Alert.alert('Missing name', 'Please enter a name for the item.');
            return;
        }
        if (!color.trim()) {
            Alert.alert('Missing color', 'Please enter a color.');
            return;
        }

        const item: ClothingItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: name.trim(),
            imageUrl: imageUri,
            category,
            type: type.trim() || category,
            color: color.trim().toLowerCase(),
            season,
            createdAt: Date.now(),
        };

        await addClothingItem(item);
        navigation.replace('Wardrobe');
    };

    return (
        <ScrollView flex={1} bg="$background" contentContainerStyle={{ p: 20 }}>
            <YStack gap="$4">

                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ width: '100%', height: 250, borderRadius: 12 }}
                        resizeMode="cover"
                    />
                ) : (
                    <YStack
                        height={250}
                        bg="$gray3"
                        rounded="$4"
                        justify="center"
                        items="center"
                    >
                        <Text color="$gray9">No image selected</Text>
                    </YStack>
                )}

                <Button size="$4" onPress={pickImage}>
                    {imageUri ? 'Change Image' : 'Pick Image'}
                </Button>

                <YStack gap="$2">
                    <Text fontWeight="600">Name</Text>
                    <Input
                        size="$4"
                        placeholder="e.g. White T-Shirt, Blue Jeans"
                        value={name}
                        onChangeText={setName}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text fontWeight="600">Category</Text>
                    <XStack flexWrap="wrap" gap="$2">
                        {CATEGORIES.map((c) => (
                            <Button
                                key={c}
                                size="$3"
                                theme={category === c ? 'accent' : undefined}
                                variant={category === c ? undefined : 'outlined'}
                                onPress={() => setCategory(c)}
                            >
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </Button>
                        ))}
                    </XStack>
                </YStack>

                <YStack gap="$2">
                    <Text fontWeight="600">Type (optional)</Text>
                    <Input
                        size="$4"
                        placeholder="e.g. tshirt, hoodie, jeans, sneakers"
                        value={type}
                        onChangeText={setType}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text fontWeight="600">Color</Text>
                    <Input
                        size="$4"
                        placeholder="e.g. black, blue, red"
                        value={color}
                        onChangeText={setColor}
                    />
                </YStack>

                <YStack gap="$2">
                    <Text fontWeight="600">Season (optional)</Text>
                    <XStack flexWrap="wrap" gap="$2">
                        {SEASONS.map((s) => (
                            <Button
                                key={s}
                                size="$3"
                                theme={season === s ? 'accent' : undefined}
                                variant={season === s ? undefined : 'outlined'}
                                onPress={() => setSeason(season === s ? undefined : s)}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </Button>
                        ))}
                    </XStack>
                </YStack>

                <Button size="$5" theme="accent" onPress={handleSave} mt="$2">
                    Save Item
                </Button>
            </YStack>
        </ScrollView>
    );
}
