import React from 'react';
import { MenuCuenta } from './MenuCuenta';
import '../styles/configuracion.css';

export const Notificaciones = () => {
    return (
        <div className="profile-container">
            <MenuCuenta />
            <div className="profile-cont">
                <h1>Notificaciones</h1>
                {/* ... (contenido de Notificaciones) ... */}
            </div>
        </div>
    );
};