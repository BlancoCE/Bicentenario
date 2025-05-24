import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // Añadimos useRef
import { useTranslation } from "react-i18next";
import logo from '../assets/logo2.png';
import "../styles/menu.css";

export const Menu = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null); // Referencia para el menú

    // Efecto para cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        // Agregar el listener cuando el menú está abierto
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Limpiar el listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Resto de tus funciones existentes...
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowDropdown(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="menu" ref={menuRef}>
            <img src={logo} alt="Logo de la página" className="menu_logo" />
            
            {/* Botón hamburguesa */}
            <div className="hamburger" onClick={toggleMobileMenu}>
                <div className={isMobileMenuOpen ? "line open-line1" : "line"}></div>
                <div className={isMobileMenuOpen ? "line open-line2" : "line"}></div>
                <div className={isMobileMenuOpen ? "line open-line3" : "line"}></div>
            </div>

            {/* Menú para desktop (oculto en móviles) */}
            <div className="menu-links">
                <Link to="/">{t("Inicio")}</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to="/register">{t("Registrarse")}</Link>
                        <Link to="/login">{t("Iniciar Sesión")}</Link>
                    </>
                ) : (
                    <>
                        <Link to="/agente">Agente</Link>
                        <Link to="/gestionar">{t("Gestionar")}</Link>
                        <Link to="/contacto">{t("Contacto")}</Link>
                        <Link to="/menucuenta">{t("Cuenta")}</Link>
                        <Link onClick={handleLogout} to="/">{t("Cerrar sesión")}</Link>
                    </>
                )}
            </div>

            {/* Menú móvil (aparece al hacer clic) */}
            <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
                <Link to="/" onClick={toggleMobileMenu}>{t("Inicio")}</Link>
                {!isAuthenticated ? (
                    <>
                        <Link to="/register" onClick={toggleMobileMenu}>{t("Registrarse")}</Link>
                        <Link to="/login" onClick={toggleMobileMenu}>{t("Iniciar Sesión")}</Link>
                    </>
                ) : (
                    <>
                        <Link to="/agente" onClick={toggleMobileMenu}>Agente</Link>
                        <Link to="/gestionar" onClick={toggleMobileMenu}>{t("Gestionar")}</Link>
                        <Link to="/contacto" onClick={toggleMobileMenu}>{t("Contacto")}</Link>
                        <Link to="/configuracion" onClick={toggleMobileMenu}>{t("Configuración")}</Link>
                        <Link onClick={() => { handleLogout(); toggleMobileMenu(); }} to="/">{t("Cerrar sesión")}</Link>
                    </>
                )}
            </div>

            {/* Selector de idioma (visible en ambos) */}
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