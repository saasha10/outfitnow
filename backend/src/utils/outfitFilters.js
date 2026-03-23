function filterInvalidOutfits(combinations) {
  return combinations.filter((combo) => {
    // Rule: boots + shorts -> invalid
    if (combo.shoes.subcategory === 'boots' && combo.bottom.subcategory === 'shorts') {
      return false;
    }

    // Rule: winter jacket + summer outfit -> invalid
    if (
      combo.jacket &&
      combo.jacket.season === 'winter' &&
      (combo.top.season === 'summer' || combo.bottom.season === 'summer')
    ) {
      return false;
    }

    // Rule: formal shoes + sport outfit -> invalid
    if (
      combo.shoes.style === 'formal' &&
      (combo.top.style === 'sport' || combo.bottom.style === 'sport')
    ) {
      return false;
    }

    // Rule: sport shoes + formal outfit -> invalid
    if (
      combo.shoes.style === 'sport' &&
      (combo.top.style === 'formal' || combo.bottom.style === 'formal')
    ) {
      return false;
    }

    // Rule: mixing extreme seasons (winter top + summer bottom or vice versa)
    if (
      (combo.top.season === 'winter' && combo.bottom.season === 'summer') ||
      (combo.top.season === 'summer' && combo.bottom.season === 'winter')
    ) {
      return false;
    }

    return true;
  });
}

module.exports = { filterInvalidOutfits };
