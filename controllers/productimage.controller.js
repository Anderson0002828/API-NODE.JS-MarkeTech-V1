const ProductImage = require('../models/productimage.model');

exports.addProductImages = async (req, res) => {
  try {
    const { images } = req.body; // Espera un array de objetos con product_id e image_url

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: 'Datos de imagen inválidos' });
    }

    const insertedImages = await ProductImage.bulkCreate(images); // Inserta todas las imágenes de una vez

    res.status(201).json(insertedImages);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar las imágenes', error });
  }
};
