const express = require('express');
const router = express.Router();
const outfitController = require('../controllers/outfit.controller');

router.post('/generate', outfitController.generateOutfit);

module.exports = router;
