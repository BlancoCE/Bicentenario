import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import logo from '../assets/logo2.png'

export const Menu = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
       
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowDropdown(false); // Cierra el menú después de seleccionar un idioma
    };

    return (
        <nav className="menu">
            <img src={logo} alt="Logo de la página" className="menu_logo" />
            
            <Link to="/">{t("Inicio")}</Link>
            <Link to="/eventos">{t("Eventos")}</Link>
            <Link to="/agente">Agente</Link>
            {!isAuthenticated ? (
                <>
                    <Link to="/register">{t("Registrarse")}</Link>
                    <Link to="/login">{t("Iniciar Sesión")}</Link>
                </>
            ) : (
                <>
                
                    <Link to="/gestionar">{t("Gestionar")}</Link>
                    <Link to="/contacto">{t("Contacto")}</Link>
                    <Link to="">{t("Agenda")}</Link>
                    <Link to="/configuracion">{t("Configuración")}</Link>
                    <Link onClick={handleLogout} to="/">{t("Cerrar sesión")}</Link>
                </>
            )}

            {/* Menú desplegable para idiomas */}
            <div className="language-dropdown">
                <button onClick={() => setShowDropdown(!showDropdown)}>
                    {t("Idioma")}
                </button> 
                {showDropdown && (
                    <ul className="dropdown-menu">
                        <li onClick={() => changeLanguage("es")}>🇪🇸 Español</li>
                        <li onClick={() => changeLanguage("en")}>🇺🇸 English</li>
                        <li onClick={() => changeLanguage("ay")}>🌄 Aymara</li>
                        <li onClick={() => changeLanguage("qu")}>🏔️ Quechua</li>
                    </ul>
                )}
            </div>
            
        </nav>
    );
};
