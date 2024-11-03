const History = require('../models/history.model');

exports.registerSearch = async (req, res) => {
  const { user_id, search_term } = req.body;

  try {
    const newSearch = await History.create({
      user_id,
      search_term,
      created_at: new Date(),
    });

    res.status(200).json({ message: 'Búsqueda registrada correctamente', data: newSearch });
  } catch (error) {
    console.error("Error al registrar búsqueda:", error);
    res.status(500).json({ message: 'Error al registrar búsqueda', error });
  }
};
