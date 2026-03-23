const outfitService = require('../services/outfit.service');

async function generateOutfit(req, res) {
  try {
    const { user_id, occasion, weather, style } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const result = await outfitService.generateOutfits(
      user_id,
      occasion || 'casual',
      weather || 'mild',
      style || 'balanced',
    );

    res.json(result);
  } catch (error) {
    console.error('Error generating outfit:', error.message);

    if (error.message === 'No clothing items found for this user') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { generateOutfit };
