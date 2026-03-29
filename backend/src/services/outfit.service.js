const clothingService = require('./clothing.service');
const aiService = require('./ai.service');
const { generateCombinations } = require('../utils/outfitGenerator');
const { filterInvalidOutfits } = require('../utils/outfitFilters');
const supabase = require('../config/supabaseClient');

async function generateOutfits(userId, occasion, season) {
  const clothes = await clothingService.getClothingByUserId(userId);

  if (!clothes || clothes.length === 0) {
    throw new Error('No clothing items found for this user');
  }

  // Generate and filter combinations
  let combinations = generateCombinations(clothes);
  combinations = filterInvalidOutfits(combinations);

  // Limit to 30 candidates
  if (combinations.length > 30) {
    combinations = combinations.slice(0, 30);
  }

  if (combinations.length === 0) {
    return { outfits: [] };
  }

  // Build AI-friendly candidate list
  const candidates = combinations.map((combo, index) => {
    const candidate = {
      index,
      top: {
        name: combo.top.name,
        type: combo.top.type,
        color: combo.top.color,
        style: combo.top.style,
        season: combo.top.season,
      },
      bottom: {
        name: combo.bottom.name,
        type: combo.bottom.type,
        color: combo.bottom.color,
        style: combo.bottom.style,
        season: combo.bottom.season,
      },
      shoes: {
        name: combo.shoes.name,
        type: combo.shoes.type,
        color: combo.shoes.color,
        style: combo.shoes.style,
        season: combo.shoes.season,
      },
    };
    if (combo.outerwear) {
      candidate.outerwear = {
        name: combo.outerwear.name,
        type: combo.outerwear.type,
        color: combo.outerwear.color,
        style: combo.outerwear.style,
        season: combo.outerwear.season,
      };
    }
    return candidate;
  });

  // AI ranking
  const aiResult = await aiService.rankOutfits(candidates, occasion, season);

  // Take top 3
  const top3 = (aiResult.rankings || []).slice(0, 3);

  // Save top 3 outfits to database
  const savedOutfits = [];
  for (const ranked of top3) {
    const combo = combinations[ranked.index];
    if (!combo) continue;

    const outfitRow = {
      user_id: userId,
      top_id: combo.top.id,
      bottom_id: combo.bottom.id,
      shoes_id: combo.shoes.id,
      outerwear_id: combo.outerwear ? combo.outerwear.id : null,
      style: combo.top.style || null,
      occasion: occasion || null,
      season: season || null,
      ai_score: ranked.score,
    };

    const { data, error } = await supabase
      .from('outfits')
      .insert(outfitRow)
      .select(
        `
        *,
        top:clothing_items!outfits_top_id_fkey(*),
        bottom:clothing_items!outfits_bottom_id_fkey(*),
        shoes:clothing_items!outfits_shoes_id_fkey(*),
        outerwear:clothing_items!outfits_outerwear_id_fkey(*)
      `,
      )
      .single();

    if (error) {
      console.error('Error saving outfit:', error.message);
      continue;
    }

    savedOutfits.push({ ...data, reason: ranked.reason });
  }

  return { outfits: savedOutfits };
}

async function getOutfitsByUserId(userId) {
  const { data, error } = await supabase
    .from('outfits')
    .select(
      `
      *,
      top:clothing_items!outfits_top_id_fkey(*),
      bottom:clothing_items!outfits_bottom_id_fkey(*),
      shoes:clothing_items!outfits_shoes_id_fkey(*),
      outerwear:clothing_items!outfits_outerwear_id_fkey(*)
    `,
    )
    .eq('user_id', userId)
    .order('ai_score', { ascending: false });

  if (error) throw error;
  return data;
}

async function likeOutfit(outfitId, liked) {
  const { data, error } = await supabase
    .from('outfits')
    .update({ liked })
    .eq('id', outfitId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const notFound = new Error('Outfit not found');
      notFound.status = 404;
      throw notFound;
    }
    throw error;
  }
  return data;
}

module.exports = { generateOutfits, getOutfitsByUserId, likeOutfit };
