const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { name, last_name, email, password, dni, phone, address, region, province, district, reference } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await User.create({
            name,
            last_name,
            email,
            password: hashedPassword, // Almacenamos la contraseña encriptada
            dni,
            phone,
            address,
            region,
            province,
            district,
            reference,
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
};

// Obtener usuario por email
const getUserByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        // Buscar usuario en la base de datos
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user); // Devolver los datos del usuario en formato JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos del usuario', error });
    }
};

// Obtener ID de usuario por email
const getUserIdByEmail = async (req, res) => {
    const { email } = req.query;

    try {
        // Buscar usuario en la base de datos
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ id: user.id }); // Devolver solo el ID del usuario en formato JSON
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el ID del usuario', error });
    }
};

// Exportar ambos controladores
module.exports = { createUser, getUserByEmail, getUserIdByEmail };