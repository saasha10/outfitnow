const SEASON_COMPAT = {
  summer: ['summer', 'all'],
  winter: ['winter', 'all'],
  spring: ['spring', 'autumn', 'all'],
  autumn: ['autumn', 'spring', 'all'],
  all: ['summer', 'winter', 'spring', 'autumn', 'all'],
};

function areSeasonsCompatible(a, b) {
  if (!a || !b) return true;
  const allowed = SEASON_COMPAT[a] || ['all'];
  return allowed.includes(b);
}

function filterInvalidOutfits(combinations) {
  return combinations.filter((combo) => {
    const { top, bottom, shoes, outerwear } = combo;

    // Rule 1: same color top and bottom
    if (top.color && bottom.color && top.color === bottom.color) {
      return false;
    }

    // Rule 2: incompatible seasons between top and bottom
    if (!areSeasonsCompatible(top.season, bottom.season)) {
      return false;
    }

    // Rule 3: incompatible season for outerwear
    if (outerwear && !areSeasonsCompatible(outerwear.season, top.season)) {
      return false;
    }

    // Rule 4: formal shoes with sport outfit
    if (shoes.style === 'formal' && (top.style === 'sport' || bottom.style === 'sport')) {
      return false;
    }

    // Rule 5: sport shoes with formal/elegant outfit
    if (
      shoes.style === 'sport' &&
      (top.style === 'formal' ||
        top.style === 'elegant' ||
        bottom.style === 'formal' ||
        bottom.style === 'elegant')
    ) {
      return false;
    }

    // Rule 6: boots with shorts
    if (shoes.type === 'boots' && bottom.type === 'shorts') {
      return false;
    }

    // Rule 7: temperature range overlap check
    if (
      top.temperature_min != null &&
      top.temperature_max != null &&
      bottom.temperature_min != null &&
      bottom.temperature_max != null
    ) {
      const overlapMin = Math.max(top.temperature_min, bottom.temperature_min);
      const overlapMax = Math.min(top.temperature_max, bottom.temperature_max);
      if (overlapMin > overlapMax) return false;
    }

    // Rule 8: try to match similar styles (loose — only reject extreme mismatches)
    if (
      (top.style === 'elegant' && bottom.style === 'sport') ||
      (top.style === 'sport' && bottom.style === 'elegant')
    ) {
      return false;
    }

    return true;
  });
}

module.exports = { filterInvalidOutfits };
