const express = require('express');
const { createUser, getUserByEmail , getUserIdByEmail} = require('../controllers/user.controller');

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post('/register', createUser);

// Ruta para obtener los datos de un usuario por su email
router.get('/profile', getUserByEmail);

// Nueva ruta para obtener el ID del usuario por correo electrónico
router.get('/getIdByEmail', getUserIdByEmail);

module.exports = router;