const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Ruta para agregar un producto
router.post('/', productController.addProduct);
// Ruta para obtener todos los productos por email
router.get('/by-email', productController.getProductsByEmail);
// Ruta para obtener todos los datos sin excepción
router.get('/all', productController.getAllProducts);

module.exports = router;