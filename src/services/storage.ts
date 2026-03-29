import AsyncStorage from '@react-native-async-storage/async-storage';

import { ClothingItem } from '@app-types/index';

const WARDROBE_ITEMS = 'WARDROBE_ITEMS';

export async function getClothingItems(): Promise<ClothingItem[]> {
  const json = await AsyncStorage.getItem(WARDROBE_ITEMS);
  return json ? JSON.parse(json) : [];
}

export async function saveClothingItems(items: ClothingItem[]): Promise<void> {
  await AsyncStorage.setItem(WARDROBE_ITEMS, JSON.stringify(items));
}

export async function addClothingItem(item: ClothingItem): Promise<void> {
  const items = await getClothingItems();
  items.unshift(item);
  await saveClothingItems(items);
}

export async function deleteClothingItem(id: string): Promise<void> {
  const items = await getClothingItems();
  const filtered = items.filter((item) => item.id !== id);
  await saveClothingItems(filtered);
}
