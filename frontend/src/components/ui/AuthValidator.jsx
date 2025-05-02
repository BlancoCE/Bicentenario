import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Función para verificar si el token ha expirado
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (e) {
    return true;
  }
};

const logoutUser = (navigate) => {
    if(!localStorage.getItem('token')){
        return;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    // Elimina el reload y solo haz navigate
    navigate('/');
    // Opcional: puedes agregar un estado para mostrar mensaje
    navigate('/', { state: { sessionExpired: true } });
  };
  
  const AuthValidator = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      let originalFetch = window.fetch; // Guarda referencia aquí
  
      const setupResponseInterceptors = () => {
        originalFetch = window.fetch;
        window.fetch = async (...args) => {
          const response = await originalFetch(...args);
          if (response.status === 401) {
            logoutUser(navigate);
          }
          return response;
        };
      };
  
      const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
          logoutUser(navigate);
        }
      };
  
      setupResponseInterceptors();
      checkAuth();
      
      const interval = setInterval(checkAuth, 60000);
      
      return () => {
        clearInterval(interval);
        window.fetch = originalFetch;
      };
    }, [navigate]);
  
    return null;
  };

// Función para configurar interceptores (debe estar fuera del componente)
const setupResponseInterceptors = (navigate) => {
  // Guardar fetch original
  const originalFetch = window.fetch;
  
  // Sobrescribir fetch global
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (response.status === 401) {
      logoutUser(navigate);
    }
    return response;
  };
};

export default AuthValidator;