require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db.config');
const userRoutes = require('./routes/user.route');
const sellerRoutes = require('./routes/seller.route');
const productRoutes = require('./routes/product.route');//nuevo
const productImageRoutes = require('./routes/productimage.route');
const shoppingCartRoutes = require('./routes/shoppingcart.route');
const wishListRoutes = require('./routes/wishlist.route');// new line for wish list routes
const historyRoutes = require('./routes/history.route');
const productsVisitedRoutes = require('./routes/productsvisited.route');


// Inicializar la app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productimage', productImageRoutes); // add route to image_products
app.use('/api/shoppingcart', shoppingCartRoutes); // add route to shopping_cart
app.use('/api/wishlist', wishListRoutes); // add route to wish_list
app.use('/api/search', historyRoutes);
app.use('/api/productsvisited', productsVisitedRoutes);


// Sincronizar con la base de datos
sequelize.sync()
    .then(() => {
        console.log('Conexión a la base de datos establecida');
    })
    .catch((err) => {
        console.error('Error al conectar con la base de datos:', err);
    });
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Escuchar en el puerto definido
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});