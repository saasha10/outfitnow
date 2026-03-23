import AsyncStorage from '@react-native-async-storage/async-storage';

import { ClothingItem } from '@app-types/index';
import { apiAddClothingItem, apiDeleteClothingItem, apiGetClothingItems } from '@services/api';

const WARDROBE_ITEMS = 'WARDROBE_ITEMS';

export async function getClothingItems(): Promise<ClothingItem[]> {
  try {
    const items = await apiGetClothingItems();
    // Sync local cache with backend data
    await AsyncStorage.setItem(WARDROBE_ITEMS, JSON.stringify(items));
    return items;
  } catch {
    // Fallback to local cache if backend is unreachable
    const json = await AsyncStorage.getItem(WARDROBE_ITEMS);
    return json ? JSON.parse(json) : [];
  }
}

export async function saveClothingItems(items: ClothingItem[]): Promise<void> {
  await AsyncStorage.setItem(WARDROBE_ITEMS, JSON.stringify(items));
}

export async function addClothingItem(item: ClothingItem): Promise<ClothingItem> {
  try {
    const saved = await apiAddClothingItem(item);
    // Update local cache
    const items = await getLocalItems();
    items.unshift(saved);
    await saveClothingItems(items);
    return saved;
  } catch {
    // Fallback: save locally only
    const items = await getLocalItems();
    items.unshift(item);
    await saveClothingItems(items);
    return item;
  }
}

export async function deleteClothingItem(id: string): Promise<void> {
  try {
    await apiDeleteClothingItem(id);
  } catch {
    // Continue with local delete even if backend fails
  }
  const items = await getLocalItems();
  const filtered = items.filter((item) => item.id !== id);
  await saveClothingItems(filtered);
}

async function getLocalItems(): Promise<ClothingItem[]> {
  const json = await AsyncStorage.getItem(WARDROBE_ITEMS);
  return json ? JSON.parse(json) : [];
}
