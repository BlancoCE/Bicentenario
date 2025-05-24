import React, { useState, useEffect, useRef } from 'react';
import { MenuCuenta } from './MenuCuenta';
import '../styles/notificacion.css';
import { FaBell, FaRegBell, FaTrashAlt, FaSearch, FaBars } from 'react-icons/fa';

export const Notificacion = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Nuevo mensaje recibido",
            message: "Tienes un nuevo mensaje de Juan Pérez sobre tu reserva",
            date: "15 de mayo de 2023, 10:30",
            read: false,
            type: "Mensaje"
        },
        {
            id: 2,
            title: "Pago confirmado",
            message: "Tu pago por $150.00 ha sido confirmado exitosamente",
            date: "14 de mayo de 2023, 15:45",
            read: true,
            type: "Pago"
        }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target) && 
                (!hamburgerRef.current || !hamburgerRef.current.contains(event.target))) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification => 
            notification.id === id ? {...notification, read: true} : notification
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => 
            ({...notification, read: true})
        ));
    };

    const deleteAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || notification.type.toLowerCase() === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="notifications-container">
            {/* Botón hamburguesa para móviles */}
            <div 
                ref={hamburgerRef}
                className={`config-hamburger ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <FaBars size={20} color="white" />
            </div>

            {/* Overlay para el menú */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Menú de configuración */}
            <div 
                ref={menuRef}
                className={`sidebar ${isMenuOpen ? 'open' : ''}`}
            >
                <MenuCuenta closeMenu={() => setIsMenuOpen(false)} />
            </div>

            {/* Contenido principal */}
            <div className="notifications-content">
                <div className="notifications-header">
                    <h1><FaBell className="header-icon" /> Notificaciones</h1>
                    
                    <div className="header-actions">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Buscar notificaciones..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="actions-container">
                            <button onClick={markAllAsRead} className="btn-mark-all">
                                Marcar todas como leídas
                            </button>
                            <button onClick={deleteAll} className="btn-delete-all">
                                Eliminar todas
                            </button>
                        </div>
                    </div>
                    
                    <div className="tabs-container">
                        <button 
                            className={activeTab === 'all' ? 'active' : ''} 
                            onClick={() => setActiveTab('all')}
                        >
                            Todas
                        </button>
                        <button 
                            className={activeTab === 'mensaje' ? 'active' : ''} 
                            onClick={() => setActiveTab('mensaje')}
                        >
                            Mensajes
                        </button>
                        <button 
                            className={activeTab === 'pago' ? 'active' : ''} 
                            onClick={() => setActiveTab('pago')}
                        >
                            Pagos
                        </button>
                    </div>
                </div>
                
                <div className="notifications-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`notification-card ${!notification.read ? 'unread' : ''}`}
                            >
                                <div className="notification-content">
                                    <h3>{notification.title}</h3>
                                    <p>{notification.message}</p>
                                    <div className="notification-footer">
                                        <span className="date">{notification.date}</span>
                                        <span className="type">{notification.type}</span>
                                    </div>
                                </div>
                                <div className="notification-actions">
                                    {!notification.read && (
                                        <button 
                                            onClick={() => markAsRead(notification.id)}
                                            className="btn-mark-read"
                                        >
                                            Marcar como leída
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteNotification(notification.id)}
                                        className="btn-delete"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-notifications">
                            <FaRegBell className="empty-icon" />
                            <p>No hay notificaciones para mostrar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};