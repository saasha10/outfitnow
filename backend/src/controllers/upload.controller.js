const storageService = require('../services/storage.service');

async function uploadClothingImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const result = await storageService.uploadImage(req.file, user_id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ error: 'Image upload failed' });
  }
}

module.exports = { uploadClothingImage };
