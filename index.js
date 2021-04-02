const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

// Express server
const app = express();

// Database
dbConnection();

// CORS
app.use(cors());

// Parse body
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// Listen server
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
