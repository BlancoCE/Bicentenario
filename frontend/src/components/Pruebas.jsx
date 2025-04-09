import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pruebas.css';

export const Dashboard = () => {
  const [userRole, setUserRole] = useState('admin');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    comments: 0,
    resources: 0
  });
  const [histories, setHistories] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Datos de ejemplo para gráficos
  const userStats = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Usuarios registrados',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const eventStats = {
    labels: ['Conferencias', 'Talleres', 'Exposiciones', 'Seminarios'],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      }
    ]
  };

  const trafficStats = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Visitas',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
      }
    ]
  };

  // Función para obtener eventos desde la API
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/eventos');
      if (!response.ok) {
        throw new Error('Error al obtener los eventos');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  };

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

  // Función para eliminar un evento
  const eliminarEvento = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este evento?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }
      
      // Actualizar la lista de eventos después de eliminar
      setEvents(events.filter(event => event.id !== id));
      
      if (editingEventId === id) {
        setEditingEventId(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('No se pudo eliminar el evento');
    }
  };

  // Función para manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: value
    });
  };

  // Función para guardar los cambios del evento
  const guardarEvento = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${editingEventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentEvent),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el evento');
      }
      
      // Actualizar la lista de eventos
      await fetchEvents();
      
      // Cerrar el panel de edición
      setIsEditing(false);
      setEditingEventId(null);
      setCurrentEvent(null);
      
      alert('Evento actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando evento:', error);
      alert('No se pudo actualizar el evento');
    }
  };

  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setIsEditing(false);
    setEditingEventId(null);
    setCurrentEvent(null);
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

        setHistories([
          { id: 1, title: "Revolución de 1952", description: "La revolución nacional que cambió Bolivia", sources: "Libros de historia", rating: 4 },
          { id: 2, title: "Guerra del Pacífico", description: "Conflicto entre Bolivia, Chile y Perú", sources: "Archivos nacionales", rating: 5 }
        ]);

        setCultures([
          { id: 1, name: "Aymara", type: "Indígena", description: "Cultura originaria del altiplano", rating: "Alta" },
          { id: 2, name: "Quechua", type: "Indígena", description: "Cultura originaria de los valles", rating: "Alta" }
        ]);

        // Obtener eventos reales desde la API
        await fetchEvents();

        setUsers([
          { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "admin", status: "active" },
          { id: 2, name: "María Gómez", email: "maria@example.com", role: "cultural", status: "active" }
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };

    fetchData();
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
    navigate('/login');
  };

  const renderStars = (rating) => {
    return (
      <>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no definida';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch {
      return dateString; // Si hay error al parsear, devolver el string original
    }
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

          {(userRole === 'admin' || userRole === 'cultural' || userRole === 'academico') && (
            <li className={activeSection === 'historia' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('historia')}>
                <i className="bi bi-book"></i> Historia
              </button>
            </li>
          )}

          {(userRole === 'admin' || userRole === 'cultural') && (
            <li className={activeSection === 'cultura' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('cultura')}>
                <i className="bi bi-globe"></i> Cultura
              </button>
            </li>
          )}

          {(userRole === 'admin' || userRole === 'organizador') && (
            <li className={activeSection === 'eventos' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('eventos')}>
                <i className="bi bi-calendar-event"></i> Eventos
              </button>
            </li>
          )}

          {(userRole === 'admin' || userRole === 'academico') && (
            <li className={activeSection === 'biblioteca' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('biblioteca')}>
                <i className="bi bi-collection"></i> Biblioteca
              </button>
            </li>
          )}

          {userRole === 'admin' && (
            <>
              <li className={activeSection === 'noticias' ? 'active' : ''}>
                <button onClick={() => handleSectionChange('noticias')}>
                  <i className="bi bi-newspaper"></i> Noticias
                </button>
              </li>
              <li className={activeSection === 'usuarios' ? 'active' : ''}>
                <button onClick={() => handleSectionChange('usuarios')}>
                  <i className="bi bi-people"></i> Usuarios
                </button>
              </li>
              <li className={activeSection === 'comentarios' ? 'active' : ''}>
                <button onClick={() => handleSectionChange('comentarios')}>
                  <i className="bi bi-chat-left-text"></i> Comentarios
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
              <div className="stat-card bg-info">
                <i className="bi bi-book"></i>
                <h3>Recursos</h3>
                <p>{stats.resources}</p>
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

        {activeSection === 'eventos' && (
          <div className="crud-section">
            <div className="section-header">
              <h2>Lista de Eventos</h2>
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle"></i> Nuevo Evento
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <tr key={event.id || event._id}>
                        <td>{event.nombre || event.name || 'Sin nombre'}</td>
                        <td>{formatDate(event.fecha || event.date)}</td>
                        <td>
                          <span className={`badge bg-${getEventTypeBadge(event.tipo || event.type)}`}>
                            {event.tipo || event.type || 'Sin tipo'}
                          </span>
                        </td>
                        <td>{event.descripcion || event.description || 'Sin descripción'}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => setEditingEventId(event.id_evento || event.id)}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => eliminarEvento(event.id_evento || event.id)}
                          >
                            <i className="bi bi-trash"></i> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No hay eventos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Panel de edición de eventos */}
            {isEditing && currentEvent && (
              <div className="edit-panel">
                <div className="edit-panel-content">
                  <div className="edit-panel-header">
                    <h3>Editar Evento</h3>
                    <button 
                      className="btn btn-close" 
                      onClick={cancelarEdicion}
                    >
                      &times;
                    </button>
                  </div>
                  
                  <form onSubmit={guardarEvento}>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={currentEvent.nombre || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="fecha" className="form-label">Fecha</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="fecha"
                        name="fecha"
                        value={currentEvent.fecha ? new Date(currentEvent.fecha).toISOString().slice(0, 16) : ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="tipo" className="form-label">Tipo</label>
                      <select
                        className="form-select"
                        id="tipo"
                        name="tipo"
                        value={currentEvent.tipo || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Académico">Académico</option>
                        <option value="Deportivo">Deportivo</option>
                        <option value="Social">Social</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        rows="3"
                        value={currentEvent.descripcion || ''}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ubicacion"
                        name="ubicacion"
                        value={currentEvent.ubicacion || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="edit-panel-actions">
                      <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Otras secciones pueden agregarse aquí */}
      </main>
    </div>
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