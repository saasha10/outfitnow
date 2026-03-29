export type RootStackParamList = {
  Home: undefined;
  AddClothing: undefined;
  Wardrobe: undefined;
  ClothingDetail: { itemId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
