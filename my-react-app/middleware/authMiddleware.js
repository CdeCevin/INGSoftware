// my-react-app/middleware/authMiddleware.js (
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Necesario para acceder a process.env.JWT_SECRET

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  // Formato esperado: "Bearer TOKEN_AQUI"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token después de "Bearer "

  if (!token) {
    // Si no hay token, el acceso es denegado
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Si el token es válido, decodifica el payload (que contiene { rut, role })
    // y lo adjunta al objeto de solicitud (req) para que las rutas puedan acceder a él.
    req.user = decoded; // Ahora req.user contendrá { rut: <valor>, role: <valor> }
    next(); // Pasar al siguiente middleware o a la función de la ruta
  } catch (error) {
    // Si la verificación falla (token inválido, expirado, etc.)
    console.error("Error al verificar token:", error.message);
    return res.status(403).json({ message: 'Token inválido o expirado. Acceso denegado.' });
  }
};

// Middleware para verificar roles específicos
// Toma un array de roles permitidos (ej: ['Administrador', 'Vendedor'])
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Primero, asegúrate de que verifyToken ya se ejecutó y adjuntó req.user
    if (!req.user || !req.user.role) {
      // Esto no debería ocurrir si verifyToken se ejecuta antes,
      // pero es una salvaguarda.
      return res.status(403).json({ message: 'Información de usuario no disponible. Acceso denegado.' });
    }

    // Verificar si el rol del usuario está incluido en los roles permitidos para esta ruta
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios para esta acción.' });
    }
    next(); // El usuario tiene el rol correcto, continuar
  };
};

module.exports = { verifyToken, authorizeRole };