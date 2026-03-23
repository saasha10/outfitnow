const express = require('express');
const router = express.Router();
const clothingController = require('../controllers/clothing.controller');

router.post('/', clothingController.addClothing);
router.get('/:userId', clothingController.getClothing);
router.delete('/:id', clothingController.deleteClothing);

module.exports = router;
