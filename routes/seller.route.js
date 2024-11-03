const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');

// Ruta para registrar un nuevo vendedor
router.post('/register', sellerController.createSeller);

// Ruta para verificar si un usuario tiene un negocio registrado
router.get('/checkBusinessByUserId/:userId', sellerController.checkSellerByUserId);

// Ruta para verificar si un usuario tiene un negocio registrado por correo
router.get('/check', sellerController.checkSellerExists);

// Ruta para obtener el perfil del vendedor por correo
router.get('/profile', sellerController.getSellerProfile);

module.exports = router;