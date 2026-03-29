const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfit.controller');

router.post('/', outfitController.generateOutfits);

module.exports = router;
