const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ImageProduct = sequelize.define('marketech_imageproducts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'marketech_products', // nombre de la tabla de productos
            key: 'id'
        }
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Si no necesitas createdAt y updatedAt
});

module.exports = ImageProduct;
