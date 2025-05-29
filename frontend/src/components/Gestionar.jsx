import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pruebas.css';
import { Eventos } from './eventos';
import { Usuarios } from './Usuarios';
import { fetchWithAuth } from '../utils/api';
import { EventTypesChart } from './grafico';

export const Gestionar = () => {
  const [userRole, setUserRole] = useState('ADMINISTRADOR');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
      setUserRole(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/stats');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStats({
        users: data.users || 0,
        events: data.events || 0
      });
      
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
      // Opcional: resetear a valores por defecto
      setStats({ users: 0, events: 0 });
    } finally {
      setLoadingStats(false);
    }
  };

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al cargar los datos");
        setLoading(false);
      }
    };
    fetchData();
    fetchUserRole();
    fetchStats();
  }, []);

  // Cuando se cambia el evento a editar
  useEffect(() => {
    if (editingEventId) {
      fetchEventById(editingEventId);
    }
  }, [editingEventId]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
    if (isEditing) {
      setIsEditing(false);
      setEditingEventId(null);
      setCurrentEvent(null);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  useEffect(() => {
  const handleOutsideClick = (e) => {
      if (mobileSidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [mobileSidebarOpen]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }


  return (
    <div className={`dashboard-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <nav className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'open' : ''}`}>
        <button 
          className="toggle-sidebar"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
        
        <div className="sidebar-header">
          <h4>Gestión Cultural</h4>
        </div>
        
        <ul className="sidebar-nav">
          <li className={activeSection === 'dashboard' ? 'active' : ''}>
            <button onClick={() => handleSectionChange('dashboard')}>
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </button>
          </li>

          {(userRole.rol === 'SUPERADMINISTRADOR' || userRole.rol === 'ADMINISTRADOR' || userRole.rol === 'ORGANIZADOR') && (
            <li className={activeSection === 'eventos' ? 'active' : ''}>
              <button onClick={() => handleSectionChange('eventos')}>
                <i className="bi bi-calendar-event"></i>
                <span>Eventos</span>
              </button>
            </li>
          )}

          {(userRole.rol === 'SUPERADMINISTRADOR' || userRole.rol === 'ADMINISTRADOR') && (
            <>
              <li className={activeSection === 'usuarios' ? 'active' : ''}>
                <button onClick={() => handleSectionChange('usuarios')}>
                  <i className="bi bi-people"></i>
                  <span>Usuarios</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
          
      {/* Main Content */}
      <main className="main-content">
      
        <header className="main-header">

          {isMobile && (
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          )}
          
          <h1>
            {activeSection === 'dashboard' && 'Dashboard'} 
            {activeSection === 'eventos' && 'Gestión de Eventos'}
            {activeSection === 'usuarios' && 'Gestión de Usuarios'}
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
        <div className="content-section">
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
              </div>

              <div className="charts-row">
                <div className="chart-container">
                  <div className="chart-placeholder"><EventTypesChart /></div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'eventos' && <Eventos />}
          {activeSection === 'usuarios' && <Usuarios />}
        </div>
      </main>
    </div>
  );
};