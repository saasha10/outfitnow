export type ClothingType = 'shirt' | 'pants' | 'shoes' | 'jacket' | 'other';

export type Season = 'summer' | 'winter' | 'all';

export interface ClothingItem {
  id: string;
  imageUri: string;
  imagePath?: string;
  type: ClothingType;
  color: string;
  season?: Season;
  createdAt: number;
}
