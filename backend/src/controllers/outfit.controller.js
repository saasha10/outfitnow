const outfitService = require('../services/outfit.service');

async function generateOutfits(req, res) {
  try {
    const { user_id, occasion, season } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const result = await outfitService.generateOutfits(
      user_id,
      occasion || 'daily',
      season || 'all',
    );

    res.json(result);
  } catch (error) {
    console.error('Error generating outfits:', error.message);

    if (error.message === 'No clothing items found for this user') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOutfits(req, res) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const outfits = await outfitService.getOutfitsByUserId(user_id);
    res.json(outfits);
  } catch (error) {
    console.error('Error fetching outfits:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function likeOutfit(req, res) {
  try {
    const { id } = req.params;
    const { liked } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'id parameter is required' });
    }

    if (typeof liked !== 'boolean') {
      return res.status(400).json({ error: 'liked must be a boolean' });
    }

    const updated = await outfitService.likeOutfit(id, liked);
    res.json(updated);
  } catch (error) {
    console.error('Error liking outfit:', error.message);
    if (error.status === 404) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { generateOutfits, getOutfits, likeOutfit };
