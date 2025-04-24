export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    // Configuración de headers por defecto
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers, // Permite sobrescribir headers
    };

    // Añadir token si existe
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        throw new Error('No se encontró token de autenticación');
    }

    try {
        // URL correcta sin /:token.id (el token va en los headers)
        const response = await fetch(url, {
            method: options.method || 'GET',
            ...options,
            headers,
        });

        // Manejo de respuestas no exitosas
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: response.statusText };
            }
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        // Manejo de respuestas sin contenido (204 No Content)
        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error en fetchWithAuth:', error);
        throw error;
    }
};