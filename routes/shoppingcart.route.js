const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shoppingcart.controller');

// Ruta para agregar un producto al carrito (POST)
router.post('/add', shoppingCartController.addToCart);

// Ruta para obtener los productos del carrito de un usuario (GET)
router.get('/getCartItems', shoppingCartController.getCartItems);

// Eliminar un producto del carrito
router.delete('/deleteCartItem/:cartItemId', shoppingCartController.deleteCartItem);

module.exports = router;