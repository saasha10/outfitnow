const clothingService = require('../services/clothing.service');

const VALID_CATEGORIES = ['top', 'bottom', 'shoes', 'outerwear', 'accessory'];

async function addClothing(req, res) {
  try {
    const {
      user_id,
      name,
      category,
      type,
      color,
      secondary_color,
      style,
      season,
      occasion,
      temperature_min,
      temperature_max,
      brand,
      image_url,
    } = req.body;

    if (!user_id || !category) {
      return res.status(400).json({ error: 'user_id and category are required' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res
        .status(400)
        .json({ error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const item = await clothingService.addClothingItem({
      user_id,
      name,
      category,
      type,
      color,
      secondary_color,
      style,
      season,
      occasion,
      temperature_min,
      temperature_max,
      brand,
      image_url,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding clothing:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getClothing(req, res) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id query parameter is required' });
    }

    const items = await clothingService.getClothingByUserId(user_id);
    res.json(items);
  } catch (error) {
    console.error('Error fetching clothing:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteClothing(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'id parameter is required' });
    }

    const deleted = await clothingService.deleteClothingItem(id);
    res.json({ message: 'Clothing item deleted', item: deleted });
  } catch (error) {
    console.error('Error deleting clothing:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { addClothing, getClothing, deleteClothing };
