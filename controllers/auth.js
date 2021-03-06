const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { newJWT } = require("../helpers/jwt");

const getUsers = async (req, res = response) => {
  try {
    let users = await User.find();

    if (!users) {
      return res.json({
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
      return res.json({
        ok: false,
        msg: "Este correo ya está registrado",
      });
    }

    user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = await newJWT(user.id, user.name, user.email);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      email: user.email,
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
      return res.json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.json({
        ok: false,
        msg: "Credenciales incorrectas",
      });
    }
    // Generar JWT
    const token = await newJWT(user.id, user.name, user.email);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      email,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};
const getUser = async (req, res = response) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ _id: uid });

    if (!user) {
      return res.json({
        ok: false,
        msg: "El usuario no existe con ese id",
      });
    }
    user.password = undefined;
    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { uid, name, email } = req;

  // Generar JWT
  const token = await newJWT(uid, name, email);

  const user = await User.findOne({ _id: uid });

  res.json({
    ok: true,
    token,
    uid,
    name,
    email: user.email,
  });
};

const editUser = async (req, res = response) => {
  let { name, email } = req.body;
  let uid = req.params.uid;

  let body = {
    uid,
    name,
    email,
  };

  try {
    let response = await User.findOneAndUpdate(uid, body, {
      useFindAndModify: false,
    });

    if (!response) {
      return res.json({
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
      msg: error.message,
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
      return res.json({
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
  getUser,
};
