const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'marketech_sellers', // Cambia esto si el nombre de la tabla es diferente
      key: 'id', // Referencia a la clave primaria en la tabla de vendedores
    },
    onDelete: 'CASCADE', // Elimina el producto si se elimina el vendedor
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_mark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  product_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  product_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  product_discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  product_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,   // Nueva columna de categoría
    allowNull: true,
  },
  subcategory: {
    type: DataTypes.STRING,   // Nueva columna de subcategoría
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'marketech_products', // Especificar el nombre de la tabla en la base de datos
  timestamps: false, // Desactiva la gestión automática de createdAt y updatedAt
});

module.exports = Product;
