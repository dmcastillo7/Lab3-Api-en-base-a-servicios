//Requerir dependencias necesarias
const mongoose = require('mongoose');

//Definir el esquema del modelo de usuario
const usuarioSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  }
});

//Exportar el modelo de usuario
module.exports = mongoose.model('Usuario', usuarioSchema);