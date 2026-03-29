function generateCombinations(clothes) {
  const tops = clothes.filter((item) => item.category === 'top');
  const bottoms = clothes.filter((item) => item.category === 'bottom');
  const shoes = clothes.filter((item) => item.category === 'shoes');
  const outerwear = clothes.filter((item) => item.category === 'outerwear');

  const combinations = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        // Without outerwear
        combinations.push({ top, bottom, shoes: shoe, outerwear: null });

        // With each outerwear piece
        for (const outer of outerwear) {
          combinations.push({ top, bottom, shoes: shoe, outerwear: outer });
        }
      }
    }
  }

  return combinations;
}

module.exports = { generateCombinations };
