const sequelize = require('../config/db.config')
const User = require('../models/user.model');
const Product = require('../models/product.model');
const ImageProduct = require('../models/productimage.model');
const WishList = require('../models/wishlist.model');

const addToWishList = async (req, res) => {
    try{
        const { user_id, product_id } = req.body;
        if (!user_id || !product_id) {
            return res.status(400).json({ message: "user_id y product_id son requeridos." });
        }
        const wishListItem = await WishList.create({
            user_id: user_id,
            product_id: product_id
        });
        return res.status(200).json({ message: "Agregado a lista de deseos", wishListItem });
    }catch (error){
        console.error("Error al agregar a lista de deseos:", error);
        return res.status(500).json({ message: "Error al agregar a lista de deseos", error });
    }
}

const getWishListItems = async (req, res) => {
    try {
        const { userId } = req.query;  // Obtener userId de los parámetros de consulta

        // 1. Obtener los items del carrito según el user_id
        const wishListItems = await WishList.findAll({ where: { user_id: userId } });

        if (!wishListItems.length) {
            return res.status(404).json({ message: 'lista de deseos vacía o no encontrada' });
        }

        // 2. Obtener los detalles de cada producto del carrito, incluyendo las imágenes
        const productsWithDetails = await Promise.all(wishListItems.map(async (item) => {
            const product = await Product.findOne({ where: { id: item.product_id } });
            const images = await ImageProduct.findAll({ where: { product_id: product.id } });

            return {
                wishListId: item.id,  // Añadir el id del carrito
                ...product.dataValues,   // Detalles del producto
                images: images.map(image => image.image_url)  // Lista de imágenes
            };
        }));

        return res.status(200).json(productsWithDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos de su lista de deseos' });
    }
};

const deleteWishListItem = async (req, res) => {
    try {
        const { wishlistItemId } = req.params;  // Obtener el id del elemento de la lista de deseos desde los parámetros de la ruta

        // 1. Buscar el item en la lista de deseos por su id y verificar que pertenece al usuario
        const wishlistItem = await WishList.findOne({ where: { id: wishlistItemId } });

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Elemento no encontrado en la lista de deseos o no pertenece al usuario' });
        }

        // 2. Eliminar el item de la lista de deseos
        await wishlistItem.destroy();

        return res.status(200).json({ message: 'Producto eliminado de la lista de deseos' });
    } catch (error) {
        console.error('Error al eliminar el producto de la lista de deseos:', error);
        return res.status(500).json({ message: 'Error al eliminar el producto de la lista de deseos', error });
    }
};

module.exports = {
    addToWishList,
    getWishListItems,
    deleteWishListItem
}