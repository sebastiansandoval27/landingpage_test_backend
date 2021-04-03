const jwt = require("jsonwebtoken");

const newJWT = (uid, name, email) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name, email };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          reject("Error al generar el token");
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  newJWT,
};
