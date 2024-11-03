const sequelize = require('../config/db.config');
const ShoppingCart = require('../models/shoppingcart.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const ImageProduct = require('../models/productimage.model');

const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, cantidad } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "user_id y product_id son requeridos." });
    }

    const cartItem = await ShoppingCart.create({
      user_id: user_id,
      product_id: product_id,
      cantidad: cantidad,
    });

    return res.status(200).json({ message: "Producto agregado al carrito", cartItem });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return res.status(500).json({ message: "Error al agregar al carrito", error });
  }
};

// Método para obtener los productos del carrito de un usuario
const getCartItems = async (req, res) => {
    try {
        const { userId } = req.query;  // Obtener userId de los parámetros de consulta

        // 1. Obtener los items del carrito según el user_id
        const cartItems = await ShoppingCart.findAll({ where: { user_id: userId } });

        if (!cartItems.length) {
            return res.status(404).json({ message: 'Carrito vacío o usuario no encontrado' });
        }

        // 2. Obtener los detalles de cada producto del carrito, incluyendo las imágenes
        const productsWithDetails = await Promise.all(cartItems.map(async (item) => {
            const product = await Product.findOne({ where: { id: item.product_id } });
            const images = await ImageProduct.findAll({ where: { product_id: product.id } });

            return {
                shoppingCartId: item.id,  // Añadir el id del carrito
                ...product.dataValues,   // Detalles del producto
                images: images.map(image => image.image_url),  // Lista de imágenes
                cantidad: item.cantidad  // Añadir la cantidad que el usuario ha seleccionado
            };
        }));

        return res.status(200).json(productsWithDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos del carrito' });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;  // Obtener el id del carrito desde los parámetros de la ruta

        // 1. Buscar el item en el carrito por su id
        const cartItem = await ShoppingCart.findOne({ where: { id: cartItemId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Elemento del carrito no encontrado' });
        }

        // 2. Eliminar el item del carrito
        await cartItem.destroy();

        return res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
};

module.exports = {
  addToCart,
  getCartItems,
  deleteCartItem
};