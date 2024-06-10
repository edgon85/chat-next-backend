const User = require("../models/user");
const Mensaje = require("../models/message");

const usuarioConectado = async (uid = "") => {
  const usuario = await User.findById(uid);
  usuario.online = true;

  await usuario.save();
  return usuario;
};

const usuarioDesconectado = async (uid = "") => {
  const usuario = await User.findById(uid);
  usuario.online = false;

  await usuario.save();
  return usuario;
};

const getUsuarios = async () => {
  const usuarios = await User.find().sort("-online");
  return usuarios;
};

const grabarMensaje = async (payload) => {
  try {
    const mensaje = new Mensaje(payload);
    await mensaje.save();
    return mensaje;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje,
};
