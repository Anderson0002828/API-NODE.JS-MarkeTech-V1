const express = require('express');
const router = express.Router();
const productsVisitedController = require('../controllers/productsvisited.controller');

router.post('/registerVisited', productsVisitedController.registerProductsVisited);

module.exports = router;