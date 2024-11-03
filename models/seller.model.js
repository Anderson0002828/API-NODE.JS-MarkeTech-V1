const { DataTypes } = require('sequelize');
const db = require('../config/db.config');
const User = require('./user.model');  // Asegúrate de que el modelo de usuarios esté cargado

const Seller = db.define('marketech_sellers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'marketech_users',
            key: 'id',
        },
    },
    business_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    business_ruc: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    business_email: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    business_phone: {
        type: DataTypes.STRING(20),
    },
    business_address: {
        type: DataTypes.STRING(255),
    },
    business_reference: {
        type: DataTypes.TEXT,
    },
    description: {
        type: DataTypes.TEXT,
    },
    department: {
        type: DataTypes.STRING(100),
    },
    province: {
        type: DataTypes.STRING(100),
    },
    district: {
        type: DataTypes.STRING(100),
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
});

module.exports = Seller;