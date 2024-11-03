const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const ProductsVisited = require('../models/productsvisited.model');

const registerProductsVisited = async (req, res) => {
    const { user_id, product_id } = req.body;

    // Verificación de que user_id y product_id sean numéricos
    if (!Number.isInteger(user_id) || !Number.isInteger(product_id)) {
        return res.status(400).json({ message: 'El user_id y product_id deben ser números enteros.' });
    }

    try {
        const newVisited = await ProductsVisited.create({
            user_id,
            product_id,
            visited_at: new Date(),
        });

        res.status(200).json({ message: 'Producto visitado registrado correctamente', data: newVisited });
    } catch (error) {
        console.error("Error al registrar el producto visitado:", error);
        res.status(500).json({ message: 'Error al registrar el producto visitado', error });
    }
};

module.exports = { registerProductsVisited };