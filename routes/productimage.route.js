const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/productimage.controller');

// Ruta para agregar URLs de imágenes a la tabla marketech_imageproducts
router.post('/', productImageController.addProductImages);

module.exports = router;
