import { Link, useLocation } from "react-router-dom";
import React from 'react';
import { 
    FaUser, FaBell, FaUniversalAccess, 
    FaCreditCard, FaFileInvoice, FaHome,
    FaSignOutAlt
} from 'react-icons/fa';
import '../styles/menucuenta.css';

export const MenuCuenta = ({ closeMenu }) => {
    const location = useLocation();
    
    return (
        <div className="mobile-menu-container">
            {/* Encabezado del menú móvil */}
            <div className="mobile-menu-header">
                <h3>Configuración</h3>
            </div>

            {/* Contenido del menú */}
            <div className="sidebar-content">
                <div className="sidebar-section">
                    <div className="section-title">Cuenta personal</div>
                    <ul className="section-links">
                        <li>
                            <Link 
                                to="/configuracion" 
                                className={location.pathname === "/configuracion" ? "active" : ""}
                                onClick={closeMenu}
                            >
                                <FaUser className="icon" /> Tu perfil
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/notificacion" 
                                className={location.pathname === "/notificacion" ? "active" : ""}
                                onClick={closeMenu}
                            >
                                <FaBell className="icon" /> Notificaciones
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/accesibilidad" 
                                className={location.pathname === "/accesibilidad" ? "active" : ""}
                                onClick={closeMenu}
                            >
                                <FaUniversalAccess className="icon" /> Accesibilidad
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <div className="section-title">Pagos y planes</div>
                    <ul className="section-links">
                        <li>
                            <Link 
                                to="/facturacion" 
                                className={location.pathname === "/facturacion" ? "active" : ""}
                                onClick={closeMenu}
                            >
                                <FaCreditCard className="icon" /> Facturación
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/pedidos" 
                                className={location.pathname === "/pedidos" ? "active" : ""}
                                onClick={closeMenu}
                            >
                                <FaFileInvoice className="icon" /> Pedidos y facturas
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <div className="section-title">Navegación</div>
                    <ul className="section-links">
                        <li>
                            <Link to="/" onClick={closeMenu}>
                                <FaHome className="icon" /> Volver al inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/logout" onClick={closeMenu}>
                                <FaSignOutAlt className="icon" /> Cerrar sesión
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};