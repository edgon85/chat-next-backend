const Mensaje = require("../models/message");

const obtenerChat = async (req, res) => {
  const miId = req.uid;
  const mensajesDe = req.params.de;

  const last30 = await Mensaje.find({
    $or: [
      { from: miId, to: mensajesDe },
      { from: mensajesDe, to: miId },
    ],
  })
    .sort({ createdAt: "asc" })
    .limit(30);

  res.json({
    ok: true,
    mensajes: last30,
  });
};

module.exports = {
  obtenerChat,
};
