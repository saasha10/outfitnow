function generateCombinations(clothes) {
  const tops = clothes.filter((item) => item.category === 'top');
  const bottoms = clothes.filter((item) => item.category === 'bottom');
  const shoes = clothes.filter((item) => item.category === 'shoes');
  const jackets = clothes.filter((item) => item.category === 'jacket');

  const combinations = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        combinations.push({ top, bottom, shoes: shoe });

        for (const jacket of jackets) {
          combinations.push({ top, bottom, shoes: shoe, jacket });
        }
      }
    }
  }

  return combinations;
}

module.exports = { generateCombinations };
