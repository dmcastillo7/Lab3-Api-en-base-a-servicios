//Requerir dependencias necesarias
const mongoose = require('mongoose');

//Definir el esquema del modelo de reserva  
const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  sala: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);