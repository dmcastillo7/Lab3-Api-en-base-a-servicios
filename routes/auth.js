const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { correo, contrasena } = req.body ?? {};

    if (typeof correo !== 'string' || !correo.trim() ||
        typeof contrasena !== 'string' || !contrasena) {
        return res.status(400).json({
            msg: 'Debes enviar correo y contrasena como texto'
        });
    }

    //Encriptar la contraseña antes de guardarla en la base de datos
    try {
        const hashed = await bcrypt.hash(contrasena, 10);
        const usuario = new Usuario({
            correo: correo.trim(),
            contrasena: hashed
        });
        await usuario.save();
        return res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ msg: 'El correo ya está registrado' });
        }

        console.error('Error al registrar usuario:', error);
        return res.status(500).json({ msg: 'No se pudo registrar el usuario' });
    }
});

router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body ?? {};

    if (typeof correo !== 'string' || !correo.trim() ||
        typeof contrasena !== 'string' || !contrasena) {
        return res.status(400).json({
            msg: 'Debes enviar correo y contrasena como texto'
        });
    }

    try {
        const usuario = await Usuario.findOne({ correo: correo.trim() });
        if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
            return res.status(401).json({ msg: 'Correo o contraseña incorrectos' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('Error al iniciar sesión: JWT_SECRET no está configurado');
            return res.status(500).json({ msg: 'Error interno del servidor' });
        }

        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ msg: 'No se pudo iniciar sesión' });
    }
});

// Recuperación simulada de contraseña
router.post('/recover', async (req, res) => {
    const { correo } = req.body ?? {};

    if (typeof correo !== 'string' || !correo.trim()) {
        return res.status(400).json({
            msg: 'Debes enviar un correo válido'
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            msg: 'JWT_SECRET no está configurado'
        });
    }

    try {
        const usuario = await Usuario.findOne({
            correo: correo.trim()
        });

        if (!usuario) {
            return res.status(404).json({
                msg: 'No existe un usuario con ese correo'
            });
        }

        const tokenRecuperacion = jwt.sign(
            {
                id: usuario.id,
                tipo: 'recuperacion'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '10m'
            }
        );

        return res.json({
            msg: 'Token temporal generado. En un sistema real se enviaría por correo.',
            token: tokenRecuperacion,
            expiraEn: '10 minutos'
        });

    } catch (error) {
        console.error('Error al generar token de recuperación:', error);

        return res.status(500).json({
            msg: 'No se pudo procesar la recuperación'
        });
    }
});

module.exports = router; //Exportar el router para su uso en otras partes de la aplicación
