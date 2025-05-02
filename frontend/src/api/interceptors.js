export const setupResponseInterceptors = (navigate) => {
    // Interceptor para fetch nativo
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login?session=expired');
      }
      return response;
    };
  
    // Si usas Axios (opcional)
    if (window.axios) {
      window.axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login?session=expired');
          }
          return Promise.reject(error);
        }
      );
    }
  };