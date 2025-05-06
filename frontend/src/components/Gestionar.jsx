import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pruebas.css';
import { Eventos } from './eventos';
import { Usuarios } from './Usuarios';
import { fetchWithAuth } from '../utils/api';

export const Gestionar = () => {
  const [userRole, setUserRole] = useState('ADMINISTRADOR');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    comments: 0,
    resources: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();


  // Función para obtener un evento específico por ID
  const fetchEventById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el evento');
      }
      const data = await response.json();
      setCurrentEvent(data);
      setIsEditing(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserRole = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth(`http://localhost:5000/api/rol`);
      setUserRole(data); // Asume que quieres el primer rol
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos de ejemplo
        setStats({
          users: 0,
          events: 0,
          comments: 0,
          resources: 0
        });


        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
    fetchUserRole();
  }, []);

  // Cuando se cambia el evento a editar
  useEffect(() => {
    if (editingEventId) {
      fetchEventById(editingEventId);
    }
  }, [editingEventId]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Cerrar el panel de edición al cambiar de sección
    if (isEditing) {
      setIsEditing(false);
      setEditingEventId(null);
      setCurrentEvent(null);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const renderStars = (rating) => {
    return (
      <>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </>
    );
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h4>Gestión Cultural</h4>
        </div>
        <ul className="sidebar-nav">
          <li className={activeSection === 'dashboard' ? 'active' : ''}>
            <button onClick={() => handleSectionChange('dashboard')}>
              <i className="bi bi-speedometer2"></i> Dashboard
            </button>
          </li>

          {(userRole.rol === 'SUPERADMINISTRADOR' || userRole.rol === 'ADMINISTRADOR' || userRole.rol === 'organizador') && (
            <li className={activeSection === 'eventos' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('eventos')}>
                <i className="bi bi-calendar-event"></i> Eventos
              </button>
            </li>
          )}

          {(userRole.rol === 'SUPERADMINISTRADOR' || userRole.rol === 'ADMINISTRADOR') && (
            <>
              <li className={activeSection === 'usuarios' ? 'active' : ''}>
                <button onClick={() => handleSectionChange('usuarios')}>
                  <i className="bi bi-people"></i> Usuarios
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>
            {activeSection === 'dashboard' && 'Dashboard'}
            {activeSection === 'historia' && 'Gestión de Historia'}
            {activeSection === 'cultura' && 'Gestión de Cultura'}
            {activeSection === 'eventos' && 'Gestión de Eventos'}
            {activeSection === 'biblioteca' && 'Gestión de Biblioteca'}
            {activeSection === 'noticias' && 'Gestión de Noticias'}
            {activeSection === 'usuarios' && 'Gestión de Usuarios'}
            {activeSection === 'comentarios' && 'Moderación de Comentarios'}
          </h1>
          <div className="user-actions">
            <button className="btn btn-profile">
              <i className="bi bi-person-circle"></i> Perfil
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Salir
            </button>
          </div>
        </header>

        {/* Contenido principal basado en la sección activa */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-section">
            <div className="stats-cards">
              <div className="stat-card bg-primary">
                <i className="bi bi-people"></i>
                <h3>Usuarios</h3>
                <p>{stats.users}</p>
              </div>
              <div className="stat-card bg-success">
                <i className="bi bi-calendar-event"></i>
                <h3>Eventos</h3>
                <p>{stats.events}</p>
              </div>
              <div className="stat-card bg-warning">
                <i className="bi bi-chat-left-text"></i>
                <h3>Comentarios</h3>
                <p>{stats.comments}</p>
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-container">
                <h3>Registro de Usuarios</h3>
                <div className="chart-placeholder">Gráfico de usuarios</div>
              </div>
              <div className="chart-container">
                <h3>Tipos de Eventos</h3>
                <div className="chart-placeholder">Gráfico de eventos</div>
              </div>
            </div>

            <div className="chart-container full-width">
              <h3>Tráfico del Sitio</h3>
              <div className="chart-placeholder">Gráfico de tráfico</div>
            </div>
          </div>
        )}

        {activeSection === 'eventos' && (<Eventos/>
        )}
        {activeSection === 'usuarios' && (<Usuarios/>
        )}
        {/* Otras secciones pueden agregarse aquí */}
      </main >
    </div >
  );
};

// Función auxiliar para determinar el color del badge según el tipo de evento
function getEventTypeBadge(type) {
  if (!type) return 'secondary';

  switch (type.toLowerCase()) {
    case 'cultural':
      return 'primary';
    case 'académico':
    case 'academico':
    case 'educativo':
      return 'success';
    case 'deportivo':
      return 'warning';
    case 'social':
      return 'info';
    default:
      return 'secondary';
  }
}