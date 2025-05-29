import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaUser, FaBell, FaHome,
    FaSignOutAlt
} from 'react-icons/fa';
import '../styles/cuentaMenu.css';

export const CuentaMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload(); // Para asegurar la actualización del estado de autenticación
    };

    return (
        <div className="cuenta-menu">
            <h3>Configuración</h3>
            
            <div className="menu-section">
                <div className="section-titlee">CUENTA PERSONAL</div>
                <ul>
                    <li className={location.pathname.includes('configuracion') ? 'active' : ''}>
                        <Link to="/cuentamenu/configuracion">
                            <FaUser className="icon" /> Tu perfil
                        </Link>
                    </li>
                    <li className={location.pathname.includes('notificaciones') ? 'active' : ''}>
                        <Link to="/cuentamenu/notificaciones">
                            <FaBell className="icon" /> Notificaciones
                        </Link>
                    </li>
                </ul>
            </div>
            
            <div className="menu-section">
                <div className="section-titlee">NAVEGACIÓN</div>
                <ul>
                    <li>
                        <Link to="/">
                            <FaHome className="icon" /> Volver al inicio
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
                            <FaSignOutAlt className="icon" /> Cerrar sesión
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};