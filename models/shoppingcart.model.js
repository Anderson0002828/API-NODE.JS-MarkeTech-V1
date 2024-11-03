const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const ShoppingCart = sequelize.define('ShoppingCart', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'marketech_shopping_cart',
    timestamps: false,
});

module.exports = ShoppingCart;