import { Link, useLocation , useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import '../styles/configuracion.css';

export const MenuCuenta = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/configuracion');
        }
    }, [location, navigate]);
    
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <div className="section-title">Cuenta personal</div>
                <ul className="section-links">
                    <li>
                        <Link 
                            to="/configuracion" className={location.pathname === "/configuracion" ? "active" : ""}>                          
                            Tu perfil
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/notificaciones" className={location.pathname === "/notificaciones" ? "active" : ""}>                          
                            Notificaciones
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
        
    );
};