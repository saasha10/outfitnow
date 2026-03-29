import AsyncStorage from '@react-native-async-storage/async-storage';

import { ClothingItem, Outfit } from '@app-types/index';
import {
  apiAddClothingItem,
  apiDeleteClothingItem,
  apiGenerateOutfits,
  apiGetClothingItems,
  apiGetOutfits,
  apiLikeOutfit,
  apiUploadClothingImage,
} from '@services/api';

const WARDROBE_ITEMS = 'WARDROBE_ITEMS';

export async function getClothingItems(): Promise<ClothingItem[]> {
  try {
    const items = await apiGetClothingItems();
    await AsyncStorage.setItem(WARDROBE_ITEMS, JSON.stringify(items));
    return items;
  } catch {
    const json = await AsyncStorage.getItem(WARDROBE_ITEMS);
    return json ? JSON.parse(json) : [];
  }
}

export async function saveClothingItems(items: ClothingItem[]): Promise<void> {
  await AsyncStorage.setItem(WARDROBE_ITEMS, JSON.stringify(items));
}

export async function addClothingItem(item: ClothingItem): Promise<ClothingItem> {
  try {
    let imageUrl = item.imageUrl;

    // Upload image if it's a local URI
    if (item.imageUrl && !item.imageUrl.startsWith('http')) {
      const { image_url } = await apiUploadClothingImage(item.imageUrl);
      imageUrl = image_url;
    }

    const uploaded: ClothingItem = { ...item, imageUrl };
    const saved = await apiAddClothingItem(uploaded);

    const items = await getLocalItems();
    items.unshift(saved);
    await saveClothingItems(items);
    return saved;
  } catch {
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
  const filtered = items.filter((i) => i.id !== id);
  await saveClothingItems(filtered);
}

export async function generateOutfits(occasion?: string, season?: string): Promise<Outfit[]> {
  return apiGenerateOutfits(occasion, season);
}

export async function getOutfits(): Promise<Outfit[]> {
  return apiGetOutfits();
}

export async function likeOutfit(outfitId: string, liked: boolean): Promise<void> {
  return apiLikeOutfit(outfitId, liked);
}

async function getLocalItems(): Promise<ClothingItem[]> {
  const json = await AsyncStorage.getItem(WARDROBE_ITEMS);
  return json ? JSON.parse(json) : [];
}
