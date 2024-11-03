const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const WishList = sequelize.define('WishList', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'marketech_wish_list',
    timestamps: false,
});

module.exports = WishList;