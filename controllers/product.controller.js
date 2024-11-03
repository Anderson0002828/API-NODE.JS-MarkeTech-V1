const sequelize = require('../config/db.config');
const Product = require('../models/product.model');
const User = require('../models/user.model'); // Modelo de usuario
const Seller = require('../models/seller.model'); // Modelo de vendedor
const ImageProduct = require('../models/productimage.model'); // Nuevo modelo de imágenes
const ShoppingCart = require('../models/shoppingcart.model'); // new model for shopping cart

// Función para agregar un producto y guardar las imágenes
const addProduct = async (req, res) => {
    const t = await sequelize.transaction(); // Crear transacción

    try {
        const { email, product_name, product_mark, product_model, product_description, product_price, product_discount, product_quantity, category, subcategory, image_urls } = req.body;

        // 1. Buscar el usuario por el correo
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. Buscar el vendedor por el user_id
        const seller = await Seller.findOne({ where: { user_id: user.id } });

        if (!seller) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        // 3. Crear el producto
        const newProduct = await Product.create({
            seller_id: seller.id,
            product_name,
            product_mark,
            product_model,
            product_description,
            product_price,
            product_discount,
            product_quantity,
            category,         // Nueva columna de categoría
            subcategory,      // Nueva columna de subcategoría
        }, { transaction: t });

        // 4. Insertar URLs de imágenes en la nueva tabla
        if (image_urls && image_urls.length > 0) {
            const imagePromises = image_urls.map(url => {
                return ImageProduct.create({
                    product_id: newProduct.id,
                    image_url: url
                }, { transaction: t });
            });
            await Promise.all(imagePromises);
        }

        await t.commit(); // Confirmar la transacción
        return res.status(201).json(newProduct);
    } catch (error) {
        await t.rollback(); // Revertir la transacción en caso de error
        console.error(error);
        return res.status(500).json({ message: 'Error al agregar el producto' });
    }
};

// Función para obtener todos los productos de un usuario
const getProductsByEmail = async (req, res) => {
    try {
        const { email } = req.query; // Asumiendo que el email se pasa como query parameter

        // 1. Buscar el usuario por el correo
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. Buscar el vendedor por el user_id
        const seller = await Seller.findOne({ where: { user_id: user.id } });

        if (!seller) {
            return res.status(404).json({ message: 'Vendedor no encontrado' });
        }

        // 3. Obtener todos los productos del vendedor
        const products = await Product.findAll({ where: { seller_id: seller.id } });

        if (!products.length) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        // 4. Obtener las imágenes para cada producto
        const productsWithImages = await Promise.all(products.map(async (product) => {
            const images = await ImageProduct.findAll({ where: { product_id: product.id } });
            return {
                ...product.dataValues,
                images: images.map(image => image.image_url) // Extraer solo las URLs de las imágenes
            };
        }));

        return res.status(200).json(productsWithImages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Función para obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        // Obtener todos los productos
        const products = await Product.findAll();

        if (!products.length) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        // Obtener las imágenes y el nombre del negocio para cada producto
        const productsWithDetails = await Promise.all(products.map(async (product) => {
            // Obtener las imágenes del producto
            const images = await ImageProduct.findAll({ where: { product_id: product.id } });

            // Obtener el vendedor y el nombre del negocio
            const seller = await Seller.findOne({ where: { id: product.seller_id } });

            if (!seller) {
                throw new Error(`Vendedor no encontrado para el producto con ID ${product.id}`);
            }

            return {
                ...product.dataValues,
                images: images.map(image => image.image_url), // Extraer solo las URLs de las imágenes
                business_name: seller.business_name // Suponiendo que 'business_name' es el nombre del negocio
            };
        }));

        return res.status(200).json(productsWithDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Método para obtener los productos del carrito de un usuario
const getCartItemsByUserId = async (req, res) => {
    try {
        const { userId } = req.query; // Obtener el userId de los parámetros de la URL

        // 1. Verificar si existe el usuario
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 2. Buscar todos los productos del carrito de ese usuario
        const cartItems = await ShoppingCart.findAll({ where: { user_id: userId } });

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No se encontraron productos en el carrito' });
        }

        // 3. Obtener los detalles de los productos en el carrito
        const cartDetails = await Promise.all(cartItems.map(async (item) => {
            // Obtener el producto basado en el product_id del carrito
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                return null; // Si el producto no existe, saltarlo
            }

            // Obtener las imágenes del producto
            const images = await ImageProduct.findAll({ where: { product_id: product.id } });

            return {
                product_id: product.id,
                product_name: product.product_name,
                product_price: product.product_price,
                product_quantity: item.cantidad, // Cantidad del producto en el carrito
                images: images.map(image => image.image_url) // URLs de las imágenes
            };
        }));

        // Filtrar productos que no fueron encontrados (en caso de que alguno no exista)
        const validCartDetails = cartDetails.filter(item => item !== null);

        return res.status(200).json(validCartDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos del carrito' });
    }
};


module.exports = {
    addProduct,
    getProductsByEmail,
    getAllProducts,
    getCartItemsByUserId
};