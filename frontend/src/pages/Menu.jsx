import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Menu = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    return (
        <nav className="menu">
            <Link to="/">Inicio</Link>
            <Link to="/contacto">Contacto</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Log in</Link>
                </>
            ) : (
                <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
            )}
        </nav>
    );
};
