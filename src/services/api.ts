import axios from 'axios';

import { ClothingItem, ClothingType, Season } from '@app-types/index';

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

// --- Type mapping between frontend and backend ---

const DEVICE_USER_ID = 'device_user_123';

interface BackendClothingItem {
  id: string;
  user_id: string;
  image_uri: string;
  category: string;
  subcategory: string;
  color: string;
  style: string;
  season: string;
  created_at: string;
}

function typeToCategory(type: ClothingType): { category: string; subcategory: string } {
  switch (type) {
    case 'shirt':
      return { category: 'top', subcategory: 'shirt' };
    case 'pants':
      return { category: 'bottom', subcategory: 'pants' };
    case 'shoes':
      return { category: 'shoes', subcategory: 'sneakers' };
    case 'jacket':
      return { category: 'jacket', subcategory: 'jacket' };
    case 'other':
      return { category: 'other', subcategory: 'other' };
  }
}

function categoryToType(category: string): ClothingType {
  switch (category) {
    case 'top':
      return 'shirt';
    case 'bottom':
      return 'pants';
    case 'shoes':
      return 'shoes';
    case 'jacket':
      return 'jacket';
    default:
      return 'other';
  }
}

function backendToFrontend(item: BackendClothingItem): ClothingItem {
  return {
    id: item.id,
    imageUri: item.image_uri,
    type: categoryToType(item.category),
    color: item.color,
    season: (item.season as Season) || undefined,
    createdAt: new Date(item.created_at).getTime(),
  };
}

// --- API methods ---

export async function apiAddClothingItem(item: ClothingItem): Promise<ClothingItem> {
  const mapped = typeToCategory(item.type);
  const { data } = await apiClient.post<BackendClothingItem>('/clothing', {
    user_id: DEVICE_USER_ID,
    image_uri: item.imageUri,
    category: mapped.category,
    subcategory: mapped.subcategory,
    color: item.color,
    style: 'casual',
    season: item.season ?? 'all',
  });
  return backendToFrontend(data);
}

export async function apiGetClothingItems(): Promise<ClothingItem[]> {
  const { data } = await apiClient.get<BackendClothingItem[]>(`/clothing/${DEVICE_USER_ID}`);
  return data.map(backendToFrontend);
}

export async function apiDeleteClothingItem(id: string): Promise<void> {
  await apiClient.delete(`/clothing/${id}`);
}
