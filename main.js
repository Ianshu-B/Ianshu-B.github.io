const mysql = require("mysql2");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

const app = express();

dotenv.config();

// Configuración Express para analizar datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Conexion a la base de datos
const conexion = () => {
  const conn = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "pagina",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    port: process.env.DB_PORT || "3306"
  });
  return conn;
} 

// Maneja la solicitud POST para guardar datos en la base de datos
// app = nueva instancia de Express()
app.post('/guardar', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  const connection = conexion();
  const queryC = `INSERT INTO usuario (nombre, correo, mensaje) VALUES (?, ?, ?)`;
  const response = await new Promise((resolve) => {
    connection.query(queryC, [nombre, correo, mensaje], (err, result) => {
      if (err) {
        connection.end();
        console.error('Error al insertar datos en la base de datos:', err);
        resolve(err.message)
      }else{
        connection.end();
        resolve("Datos insertados con exito");
      }      
    });
  });
  res.send({ mensaje: response });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
