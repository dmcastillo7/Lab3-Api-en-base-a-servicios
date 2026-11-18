//Requerir dependencias necesarias
const jwt = require('jsonwebtoken');

//Middleware que protege las rutas usando JWT
function authMiddleware(req, res, next) {
    //Extraer el token del encabezado de autorización
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No autorizado.' });
    } try {
        //Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; //Almacenar el ID del usuario en la solicitud para su uso posterior
        next(); //Continuar con la siguiente función de middleware o ruta
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' });
    }
}

module.exports = authMiddleware; //Exportar el middleware para su uso en otras partes de la aplicación