// CdeCevin/INGSoftware/my-react-app/utils/api.js

const BASE_URL = 'http://localhost:3001/api';

const authenticatedFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        // Inicialmente, NO establecemos Content-Type aquí
        ...options.headers, // Permitir que se pasen otros encabezados
    };

    // Si el body NO es una instancia de FormData, entonces establecemos Content-Type a JSON
    // Multer (con FormData) ya maneja su propio Content-Type (multipart/form-data)
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    // Si hay un token, añadirlo al encabezado de autorización
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Configurar las opciones finales para fetch
    const finalOptions = {
        ...options, // Heredar todas las demás opciones (method, body, etc.)
        headers: headers, // Usar los encabezados configurados
    };

    // Si el body es FormData, asegúrate de que no se serialice como JSON.
    // fetch maneja FormData directamente.
    // Si estás pasando un objeto y NO es FormData, entonces asumimos que es JSON
    // y lo serializamos.
    if (options.body && !(options.body instanceof FormData)) {
        finalOptions.body = JSON.stringify(options.body);
    }


    // Realizar la petición
    const response = await fetch(`${BASE_URL}${endpoint}`, finalOptions);

    // Si el token es inválido o expiró
    if (response.status === 401 || response.status === 403) {
        console.warn('Token inválido o expirado. Limpiando sesión.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userRut');
    }

    return response;
};

export default authenticatedFetch;