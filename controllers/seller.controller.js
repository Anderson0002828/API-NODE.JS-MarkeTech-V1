const Seller = require('../models/seller.model');
const User = require('../models/user.model');

// Crear un nuevo vendedor
exports.createSeller = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar al usuario por su correo
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si ya existe un negocio registrado para este usuario
        const existingSeller = await Seller.findOne({ where: { user_id: user.id } });
        if (existingSeller) {
            return res.status(400).json({ message: 'El usuario ya tiene un negocio registrado' });
        }

        // Crear un nuevo registro en la tabla sellers
        const newSeller = await Seller.create({
            user_id: user.id,
            business_name: req.body.business_name,
            business_ruc: req.body.business_ruc,
            business_email: req.body.business_email,
            business_phone: req.body.business_phone,
            business_address: req.body.business_address,
            business_reference: req.body.business_reference,
            description: req.body.description,
            department: req.body.department,
            province: req.body.province,
            district: req.body.district,
        });

        return res.status(201).json(newSeller);
    } catch (error) {
        console.error('Error creando el vendedor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Verificar si un usuario tiene un negocio registrado por correo
exports.checkSellerExists = async (req, res) => {
    try {
        const { email } = req.query;

        // Buscar al usuario por su correo
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si ya existe un negocio registrado para este usuario
        const existingSeller = await Seller.findOne({ where: { user_id: user.id } });
        if (existingSeller) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error verificando el vendedor:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Verificar si un usuario tiene un negocio registrado
exports.checkSellerByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar si el usuario tiene un negocio registrado
        const seller = await Seller.findOne({ where: { user_id: userId } });

        if (seller) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error al verificar negocio:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Función para obtener el perfil del vendedor
exports.getSellerProfile = async (req, res) => {
    try {
        // Obtener el correo desde el query param
        const email = req.query.email;

        // Buscar en la tabla users el usuario con el correo proporcionado
        const user = await User.findOne({
            where: { email: email }
        });

        // Si el usuario no se encuentra
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Ahora buscar en la tabla sellers usando el id del usuario
        const seller = await Seller.findOne({
            where: { user_id: user.id } // user_id es la clave foránea que relaciona las tablas
        });

        // Si no se encuentra el vendedor
        if (!seller) {
            return res.status(404).json({ message: 'Vendedor no encontrado.' });
        }

        // Retornar la información del vendedor con los campos correctos
        return res.status(200).json({
            business_name: seller.business_name,
            business_ruc: seller.business_ruc,
            business_email: seller.business_email,
            business_phone: seller.business_phone,
            business_address: seller.business_address,
            business_reference: seller.business_reference,
            description: seller.description,
            department: seller.department,
            province: seller.province,
            district: seller.district,
            created_at: seller.createdAt, // Suponiendo que "created_at" es un campo generado automáticamente
        });
    } catch (error) {
        console.error('Error al obtener los datos del vendedor:', error);
        return res.status(500).json({ message: 'Error del servidor.' });
    }
};