const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // verificar que el email no exista
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    const user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar usuario en BD
    await user.save();

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si existe el correo
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Password no es correcto",
      });
    }

    // Generar el JWT
    const token = await generarJWT(userDB.id);

    res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// renewToken
const renewToken = async (req, res) => {
  const uid = req.uid;

  // Generar un nuevo JWT
  const token = await generarJWT(uid);

  // Obtener el usuario por UID
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
    token,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewToken,
};
