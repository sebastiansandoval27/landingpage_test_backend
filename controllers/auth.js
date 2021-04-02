const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { newJWT } = require("../helpers/jwt");

const getUsers = async (req, res = response) => {
  try {
    let users = await User.find();

    if (!users) {
      return res.status(400).json({
        ok: false,
        msg: "No existen Usuarios",
      });
    }

    res.json({
      ok: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const newUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = await newJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar JWT
    const token = await generarJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar JWT
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
    uid,
    name,
  });
};

const editUser = async (req, res = response) => {
  const { uid } = req.body;

  let { name, email, password } = req.body;

  // Encriptar contraseña
  const salt = bcrypt.genSaltSync();
  password = bcrypt.hashSync(password, salt);

  let body = {
    name,
    email,
    password,
  };

  try {
    let response = await User.findOneAndUpdate(uid, body, {
      useFindAndModify: false,
    });

    if (!response) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "Actualizado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const { uid } = req.body;

  try {
    let response = await User.findOneAndRemove(uid, {
      useFindAndModify: false,
    });

    if (!response) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "Eliminado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  newUser,
  loginUser,
  revalidateToken,
  editUser,
  deleteUser,
  getUsers,
};
