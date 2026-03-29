import axios from 'axios';

import { ClothingItem, Outfit } from '@app-types/index';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.status, error.message);
    }
    return Promise.reject(error);
  },
);

// --- Constants ---

const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// --- Type mapping between frontend and backend ---

interface BackendClothingItem {
  id: string;
  user_id: string;
  name: string;
  image_url: string | null;
  category: string;
  type: string;
  color: string;
  secondary_color: string | null;
  style: string | null;
  season: string | null;
  occasion: string | null;
  temperature_min: number | null;
  temperature_max: number | null;
  brand: string | null;
  created_at: string;
}

interface BackendOutfit {
  id: string;
  user_id: string;
  top: BackendClothingItem;
  bottom: BackendClothingItem;
  shoes: BackendClothingItem;
  outerwear: BackendClothingItem | null;
  style: string | null;
  occasion: string | null;
  season: string | null;
  ai_score: number;
  liked: boolean;
  reason?: string;
  created_at: string;
}

function clothingToFrontend(item: BackendClothingItem): ClothingItem {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.image_url,
    category: item.category as ClothingItem['category'],
    type: item.type,
    color: item.color,
    secondaryColor: item.secondary_color ?? undefined,
    style: (item.style as ClothingItem['style']) ?? undefined,
    season: (item.season as ClothingItem['season']) ?? undefined,
    occasion: (item.occasion as ClothingItem['occasion']) ?? undefined,
    temperatureMin: item.temperature_min ?? undefined,
    temperatureMax: item.temperature_max ?? undefined,
    brand: item.brand ?? undefined,
    createdAt: new Date(item.created_at).getTime(),
  };
}

function outfitToFrontend(outfit: BackendOutfit): Outfit {
  return {
    id: outfit.id,
    top: clothingToFrontend(outfit.top),
    bottom: clothingToFrontend(outfit.bottom),
    shoes: clothingToFrontend(outfit.shoes),
    outerwear: outfit.outerwear ? clothingToFrontend(outfit.outerwear) : null,
    style: outfit.style,
    occasion: outfit.occasion,
    season: outfit.season,
    aiScore: outfit.ai_score,
    liked: outfit.liked,
    reason: outfit.reason,
    createdAt: new Date(outfit.created_at).getTime(),
  };
}

// --- Clothing API ---

export async function apiUploadClothingImage(
  localUri: string,
  userId?: string,
): Promise<{ image_url: string; image_path: string }> {
  const formData = new FormData();
  const filename = localUri.split('/').pop() || 'photo.jpg';
  const match = /\.([\w]+)$/.exec(filename);
  const ext = match ? match[1] : 'jpg';
  const mimeType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

  formData.append('file', {
    uri: localUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);
  formData.append('user_id', userId ?? DEFAULT_USER_ID);

  const { data } = await apiClient.post<{ image_url: string; image_path: string }>(
    '/upload/clothing-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export async function apiAddClothingItem(item: ClothingItem): Promise<ClothingItem> {
  const { data } = await apiClient.post<BackendClothingItem>('/clothing', {
    user_id: DEFAULT_USER_ID,
    name: item.name,
    image_url: item.imageUrl,
    category: item.category,
    type: item.type,
    color: item.color,
    secondary_color: item.secondaryColor,
    style: item.style ?? 'casual',
    season: item.season ?? 'all',
    occasion: item.occasion,
    temperature_min: item.temperatureMin,
    temperature_max: item.temperatureMax,
    brand: item.brand,
  });
  return clothingToFrontend(data);
}

export async function apiGetClothingItems(): Promise<ClothingItem[]> {
  const { data } = await apiClient.get<BackendClothingItem[]>('/clothing', {
    params: { user_id: DEFAULT_USER_ID },
  });
  return data.map(clothingToFrontend);
}

export async function apiDeleteClothingItem(id: string): Promise<void> {
  await apiClient.delete(`/clothing/${id}`);
}

// --- Outfit API ---

export async function apiGenerateOutfits(occasion?: string, season?: string): Promise<Outfit[]> {
  const { data } = await apiClient.post<{ outfits: BackendOutfit[] }>(
    '/generate-outfits',
    {
      user_id: DEFAULT_USER_ID,
      occasion: occasion ?? 'daily',
      season: season ?? 'all',
    },
    { timeout: 60000 },
  );
  return (data.outfits || []).map(outfitToFrontend);
}

export async function apiGetOutfits(): Promise<Outfit[]> {
  const { data } = await apiClient.get<BackendOutfit[]>('/outfits', {
    params: { user_id: DEFAULT_USER_ID },
  });
  return data.map(outfitToFrontend);
}

export async function apiLikeOutfit(outfitId: string, liked: boolean): Promise<void> {
  await apiClient.patch(`/outfits/${outfitId}/like`, { liked });
}
