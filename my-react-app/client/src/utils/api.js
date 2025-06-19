// CdeCevin/INGSoftware/my-react-app/client/src/utils/api.js

const BASE_URL = 'http://localhost:3001/api'; // Asegúrate de que esta sea la URL base de tu backend

const authenticatedFetch = async (endpoint, options = {}) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    // Configurar los encabezados
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Permitir que se pasen otros encabezados
    };

    // Si hay un token, añadirlo al encabezado de autorización
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Configurar las opciones finales para fetch
    const finalOptions = {
        ...options, // Heredar todas las demás opciones (method, body, etc.)
        headers: headers, // Usar los encabezados configurados
    };

    // Realizar la petición
    const response = await fetch(`<span class="math-inline">\{BASE\_URL\}</span>{endpoint}`, finalOptions);

    // Si el token es inválido o expiró (Status 401 o 403), puedes manejarlo aquí
    if (response.status === 401 || response.status === 403) {
        // Opcional: Limpiar el localStorage y redirigir al login
        console.warn('Token inválido o expirado. Limpiando sesión.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRut');
        // Nota: Para redirigir, necesitarías pasar una función navigate o usar window.location
        // Por ahora, solo lo logueamos y limpiamos. La redirección se hará en el componente que llame a esto.
    }

    return response; // Devolver la respuesta para que el componente que llama la procese
};

export default authenticatedFetch;