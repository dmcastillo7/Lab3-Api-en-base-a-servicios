# API REST de reservas de salas

API REST desarrollada para administrar usuarios y reservas de salas. El proyecto utiliza Node.js, Express y MongoDB, incorporando autenticación mediante JWT y protección de las rutas privadas.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- dotenv
- CORS
- Postman

## Funcionalidades

La API permite:

- Registrar usuarios.
- Iniciar sesión mediante correo y contraseña.
- Generar tokens JWT.
- Simular la recuperación de contraseña.
- Crear reservas de salas.
- Consultar las reservas del usuario autenticado.
- Modificar reservas propias.
- Eliminar reservas propias.
- Validar fechas, horas y salas.
- Proteger las operaciones mediante autenticación.

## Requisitos
Antes de ejecutar el proyecto se necesita tener instalado:
- Node.js
- npm
- MongoDB local o una conexión a MongoDB Atlas
- Postman para realizar las pruebas

## Instalación
Clonar o descargar el proyecto y abrir una terminal dentro de la carpeta principal.

Repositorio: https://github.com/dmcastillo7/Lab3-Api-en-base-a-servicios.git

Instalar las dependencias:
npm install

Crear un archivo llamado .env en la raíz del proyecto.

El contenido puede ser:
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/reservas_salas
JWT_SECRET=coloca_una_clave_segura

Si se utiliza MongoDB Atlas, se debe reemplazar el valor de MONGODB_URI por la cadena de conexión correspondiente.

## Ejecución
Iniciar el servidor con:
npm start

Si la conexión es correcta, se mostrarán mensajes similares a los siguientes:

Conexión a la base de datos establecida

Servidor corriendo en el puerto 3000

La API estará disponible en:
http://localhost:3000

## Endpoints de autenticación
Registrar usuario
POST http://localhost:3000/api/auth/register

Body:
{
  "correo": "dario@example.com",
  "contrasena": "123456"
}

Respuesta esperada:
{
  "msg": "Usuario registrado exitosamente"
}

Código HTTP:
201 Created

## Iniciar sesión
POST http://localhost:3000/api/auth/login

Body:
{
  "correo": "dario@example.com",
  "contrasena": "123456"
}

Respuesta esperada:
{
  "token": "TOKEN_JWT_GENERADO"
}

El token debe copiarse para utilizarlo en las operaciones protegidas.

## Recuperar contraseña
Esta ruta simula la recuperación de contraseña. No envía correos reales; genera un token temporal con una duración de diez minutos.

POST http://localhost:3000/api/auth/recover

Body:
{
  "correo": "dario@example.com"
}

Respuesta esperada:
{
  "msg": "Token temporal generado. En un sistema real se enviaría por correo.",
  "token": "TOKEN_TEMPORAL",
  "expiraEn": "10 minutos"
}

## Autenticación de las rutas privadas
Las rutas de reservas requieren un token JWT.

En Postman se debe seleccionar:

Authorization
Type: Bearer Token

Token: pegar el token obtenido en el inicio de sesión

También se puede enviar manualmente el encabezado:
Authorization: Bearer TOKEN_JWT

## Endpoints de reservas
Crear una reserva

POST http://localhost:3000/api/reservas

Body:
{
  "fecha": "2026-11-25",
  "hora": "14:30",
  "sala": "A"
}

Las salas permitidas son:
A, B y C

La hora debe tener el formato:
HH:mm

## Consultar las reservas del usuario
GET http://localhost:3000/api/reservas

Esta operación devuelve únicamente las reservas asociadas al usuario autenticado.

## Modificar una reserva
PUT http://localhost:3000/api/reservas/ID_DE_LA_RESERVA

Body:
{
  "sala": "B",
  "hora": "16:00"
}

También se puede modificar la fecha:
{
  "fecha": "2026-11-28"
}

La API verifica que la reserva pertenezca al usuario que realiza la solicitud.

## Eliminar una reserva
DELETE http://localhost:3000/api/reservas/ID_DE_LA_RESERVA


## Códigos HTTP utilizados

200	Solicitud procesada correctamente

201	Usuario o reserva creada correctamente

400	Datos enviados incorrectamente

401	Falta el token de autenticación

403	Token inválido

404	Recurso no encontrado

409	El correo ya está registrado

500	Error interno del servidor

## Autor
Dario Miguel Castillo Salazar