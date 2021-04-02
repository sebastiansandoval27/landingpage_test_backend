/*
    basic path url: /api/auth/
 */
const { Router } = require("express");
const { check } = require("express-validator");
const { validFields } = require("../middlewares/valid-fields");
const {
  newUser,
  loginUser,
  revalidateToken,
  editUser,
  deleteUser,
  getUsers,
} = require("../controllers/auth");
const { validJWT } = require("../middlewares/valid-JWT");

const router = Router();

router.get("/users", getUsers);

// Registrar usuario
router.post(
  "/new",
  [
    // middlewares
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name", "El nombre debe ser mayor a 3 carácteres").isLength({
      min: 3,
    }),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validFields,
  ],
  newUser
);

// Iniciar sesión
router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validFields,
  ],
  loginUser
);

// Actualizar datos del usuario
router.post(
  "/update",
  [
    check("uid", "El id es obligatorio").not().isEmpty(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name", "El nombre debe ser mayor a 3 carácteres").isLength({
      min: 3,
    }),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validFields,
  ],
  editUser
);

// Eliminar Usuario
router.delete(
  "/delete",
  [check("uid", "El id es obligatorio").not().isEmpty(), validFields],
  deleteUser
);

// Renovar Token
router.get("/renew", validJWT, revalidateToken);

module.exports = router;
