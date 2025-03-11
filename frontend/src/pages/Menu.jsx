import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
            <Link to="/">{t("Inicio")}</Link>
            <Link to="/contacto">{t("Contacto")}</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/register">{t("Registrarse")}</Link>
                    <Link to="/login">{t("Iniciar Sesión")}</Link>
                </>
            ) : (
                <button onClick={handleLogout} className="logout-button">
                    {t("Cerrar sesión")}
                </button>
            )}

            {/* Menú desplegable para idiomas */}
            <div className="language-dropdown">
                <button onClick={() => setShowDropdown(!showDropdown)} className="dropdown-toggle">
                    🌎 {t("Idioma")}
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
