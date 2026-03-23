const clothingService = require('./clothing.service');
const aiService = require('./ai.service');
const { generateCombinations } = require('../utils/outfitGenerator');
const { filterInvalidOutfits } = require('../utils/outfitFilters');
const supabase = require('../config/supabaseClient');

async function generateOutfits(userId, occasion, weather, style) {
  const clothes = await clothingService.getClothingByUserId(userId);

  if (!clothes || clothes.length === 0) {
    throw new Error('No clothing items found for this user');
  }

  let combinations = generateCombinations(clothes);
  combinations = filterInvalidOutfits(combinations);

  if (combinations.length > 20) {
    combinations = combinations.slice(0, 20);
  }

  if (combinations.length === 0) {
    return { outfits: [] };
  }

  const candidates = combinations.map((combo, index) => ({
    index,
    top: {
      category: combo.top.category,
      subcategory: combo.top.subcategory,
      color: combo.top.color,
      style: combo.top.style,
      season: combo.top.season,
    },
    bottom: {
      category: combo.bottom.category,
      subcategory: combo.bottom.subcategory,
      color: combo.bottom.color,
      style: combo.bottom.style,
      season: combo.bottom.season,
    },
    shoes: {
      category: combo.shoes.category,
      subcategory: combo.shoes.subcategory,
      color: combo.shoes.color,
      style: combo.shoes.style,
      season: combo.shoes.season,
    },
    ...(combo.jacket && {
      jacket: {
        category: combo.jacket.category,
        subcategory: combo.jacket.subcategory,
        color: combo.jacket.color,
        style: combo.jacket.style,
        season: combo.jacket.season,
      },
    }),
  }));

  const aiResult = await aiService.rankOutfits(candidates, occasion, weather);

  const selectedOutfits = aiResult.outfits
    .map((selection) => {
      const combo = combinations[selection.index];
      if (!combo) return null;
      const outfit = {
        top: combo.top,
        bottom: combo.bottom,
        shoes: combo.shoes,
      };
      if (combo.jacket) {
        outfit.jacket = combo.jacket;
      }
      return outfit;
    })
    .filter(Boolean);

  if (selectedOutfits.length > 0) {
    await supabase.from('outfits_generated').insert({
      user_id: userId,
      outfit_data: selectedOutfits,
    });
  }

  return { outfits: selectedOutfits };
}

module.exports = { generateOutfits };
