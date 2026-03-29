const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfit.controller');

router.get('/', outfitController.getOutfits);
router.patch('/:id/like', outfitController.likeOutfit);

module.exports = router;
