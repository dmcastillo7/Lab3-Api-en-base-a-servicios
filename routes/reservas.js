const express = require('express');
const Reserva = require('../models/Reserva');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const router = express.Router();

// Proteger todas las rutas de reservas con el middleware de autenticación
router.use(authMiddleware);

//Crear una nueva reserva
router.post('/', async (req, res) => {
    const { fecha, hora, sala } = req.body ?? {};

    if (!fecha || Number.isNaN(new Date(fecha).getTime())) {
        return res.status(400).json({ msg: 'Envía una fecha válida' });
    }

    if (typeof hora !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
        return res.status(400).json({ msg: 'La hora debe tener formato HH:mm, por ejemplo 14:30' });
    }

    try {
        const nuevaReserva = new Reserva({
            fecha: new Date(fecha),
            sala,
            hora,
            usuario: req.userId // Asignar el ID del usuario autenticado a la reserva
        });
        
        if(!sala || !['A', 'B', 'C'].includes(sala)) {
            return res.status(400).json({ msg: 'Sala inválida. Debe ser A, B o C' });
        }

        await nuevaReserva.save();
        return res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ msg: 'Error al crear la reserva' });
    }
});

//Listar todas las reservas del usuario autenticado
router.get('/', async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.userId }).populate('usuario', 'correo'); // Obtener reservas del usuario autenticado y poblar el campo de usuario con el correo
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las reservas' });
    }
});

// Editar una reserva perteneciente al usuario autenticado
router.put('/:id', async (req, res) => {
    const { fecha, hora, sala } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            msg: 'Identificador de reserva inválido'
        });
    }

    if (
        fecha === undefined &&
        hora === undefined &&
        sala === undefined
    ) {
        return res.status(400).json({
            msg: 'Envía al menos un campo para modificar'
        });
    }

    const cambios = {};

    if (fecha !== undefined) {
        if (!fecha || Number.isNaN(new Date(fecha).getTime())) {
            return res.status(400).json({
                msg: 'Envía una fecha válida'
            });
        }

        cambios.fecha = new Date(fecha);
    }

    if (hora !== undefined) {
        if (
            typeof hora !== 'string' ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)
        ) {
            return res.status(400).json({
                msg: 'La hora debe tener formato HH:mm, por ejemplo 14:30'
            });
        }

        cambios.hora = hora;
    }

    if (sala !== undefined) {
        if (!['A', 'B', 'C'].includes(sala)) {
            return res.status(400).json({
                msg: 'Sala inválida. Debe ser A, B o C'
            });
        }

        cambios.sala = sala;
    }

    try {
        const reservaActualizada =
            await Reserva.findOneAndUpdate(
                {
                    _id: req.params.id,
                    usuario: req.userId
                },
                {
                    $set: cambios
                },
                {
                    new: true,
                    runValidators: true
                }
            ).populate('usuario', 'correo');

        if (!reservaActualizada) {
            return res.status(404).json({
                msg: 'Reserva no encontrada o no pertenece al usuario'
            });
        }

        return res.json({
            msg: 'Reserva actualizada exitosamente',
            reserva: reservaActualizada
        });

    } catch (error) {
        console.error('Error al actualizar la reserva:', error);

        return res.status(500).json({
            msg: 'Error al actualizar la reserva'
        });
    }
});

//Eliminar una reserva específica del usuario autenticado
router.delete('/:id', async (req, res) => {
    const resultado = await Reserva.deleteOne({ _id: req.params.id, usuario: req.userId });

    //Si no se eliminó ninguna reserva, significa que no existe o no pertenece al usuario autenticado
    if (resultado.deletedCount === 0) {
        return res.status(404).json({ msg: 'Reserva no encontrada o no pertenece al usuario' });
    }
    res.json({ msg: 'Reserva eliminada exitosamente' });
});

module.exports = router; //Exportar el enrutador para su uso en otras partes de la aplicación