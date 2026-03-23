const clothingService = require('../services/clothing.service');

async function addClothing(req, res) {
  try {
    const { user_id, image_uri, category, subcategory, color, style, season } = req.body;

    if (!user_id || !category) {
      return res.status(400).json({ error: 'user_id and category are required' });
    }

    const item = await clothingService.addClothingItem({
      user_id,
      image_uri,
      category,
      subcategory,
      color,
      style,
      season,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding clothing:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getClothing(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    const items = await clothingService.getClothingByUserId(userId);
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
