export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessory';

export type Season = 'summer' | 'winter' | 'spring' | 'autumn' | 'all';

export type Occasion = 'daily' | 'office' | 'date' | 'party' | 'sport' | 'formal';

export type Style = 'casual' | 'streetwear' | 'elegant' | 'sporty' | 'classic' | 'bohemian';

export interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string | null;
  category: ClothingCategory;
  type: string;
  color: string;
  secondaryColor?: string;
  style?: Style;
  season?: Season;
  occasion?: Occasion;
  temperatureMin?: number;
  temperatureMax?: number;
  brand?: string;
  createdAt: number;
}

export interface Outfit {
  id: string;
  top: ClothingItem;
  bottom: ClothingItem;
  shoes: ClothingItem;
  outerwear: ClothingItem | null;
  style: string | null;
  occasion: string | null;
  season: string | null;
  aiScore: number;
  liked: boolean;
  reason?: string;
  createdAt: number;
}
