// my-react-app/middleware/authMiddleware.js (
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Necesario para acceder a process.env.JWT_SECRET

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae el token después de "Bearer "

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
  }

  try {
    // Verificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
él.
    req.user = decoded; 
    
    next(); // Pasar a la función de la ruta
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return res.status(403).json({ message: 'Token inválido o expirado. Acceso denegado.' });
  }
};


const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {

      return res.status(403).json({ message: 'Información de usuario no disponible. Acceso denegado.' });
    }
   
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios para esta acción.' });
    }
    next(); // El usuario tiene el rol correcto, continuar
  };
};

module.exports = { verifyToken, authorizeRole };