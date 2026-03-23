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
  image_url: string;
  image_path: string;
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
    imageUri: item.image_url,
    imagePath: item.image_path,
    type: categoryToType(item.category),
    color: item.color,
    season: (item.season as Season) || undefined,
    createdAt: new Date(item.created_at).getTime(),
  };
}

// --- API methods ---

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
  formData.append('user_id', userId ?? DEVICE_USER_ID);

  const { data } = await apiClient.post<{ image_url: string; image_path: string }>(
    '/upload/clothing-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export async function apiAddClothingItem(item: ClothingItem): Promise<ClothingItem> {
  const mapped = typeToCategory(item.type);
  const { data } = await apiClient.post<BackendClothingItem>('/clothing', {
    user_id: DEVICE_USER_ID,
    image_url: item.imageUri,
    image_path: item.imagePath,
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
