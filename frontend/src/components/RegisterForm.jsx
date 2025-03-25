import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/register.css";
import "../styles/exito.css";
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const RegisterForm = () => {
    const captcha = useRef(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility({
            ...passwordVisibility,
            [fieldName]: !passwordVisibility[fieldName],
        });
    };
    
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        telefono: "",
        genero: "",
        pais: "",
        ciudad: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [paises, setPaises] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    // Obtener la lista de paises al cargar la página
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then(response => response.json())
            .then(data => {
                const countryList = data.map(country => country.name.common).sort();
                setPaises(countryList);                
            })
            .catch(error => console.error("Error al cargar los países", error));
    }, []);

    // Obtener ciudades basadas en el país seleccionado
    useEffect(() => {
        if(formData.pais) {
            fetch(`https://countriesnow.space/api/v0.1/countries/cities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: formData.pais })
            })
            .then(response => response.json())
            .then(data => setCiudades(data.data || []))
            .catch(error => console.error("Error al cargar ciudades:", error));
        }
    }, [formData.pais]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const validarPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // 🔹 Validaciones
        if (!formData.nombre.trim() || !formData.correo.trim() || !formData.password.trim() ||
            !formData.pais.trim() || !formData.ciudad.trim() || !formData.telefono.trim()) {
            setErrorMessage("Todos los campos requeridos deben estar llenos.");
            return;
        }
        
        if (!captcha.current.getValue()) {
            setErrorMessage("Por favor, completa el CAPTCHA antes de continuar.");
            return;
        }

        if (!validarPassword(formData.password)) {
            setErrorMessage("La contraseña debe tener mínimo 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un caracter especial.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }
        
        if (!formData.genero.trim()) {
            setErrorMessage("Por favor, selecciona tu género.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    correo: formData.correo,
                    password: formData.password,
                    telefono: formData.telefono,
                    genero: formData.genero,
                    pais: formData.pais,
                    ciudad: formData.ciudad
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage("Error: " + data.error);
                return;
            }

            // 🔹 Registro exitoso
            setShowModal(true);
            setTimeout(() => navigate("/"), 2500);

        } catch (error) {
            console.error("Error al registrar:", error);
            setErrorMessage("Error en el servidor.");
        }
    };

    return (
        <main>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Registro Exitoso 🎉</h2>
                        <p>Serás redirigido a la página de inicio en instantes</p>
                    </div>
                </div>
            )}
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">{t("Bienvenido!")}</p>

                <div className="input-container">
                    <input placeholder="Nombre de usuario" type="text" name="nombre" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input placeholder="Correo electrónico" type="email" name="correo" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input 
                        placeholder="Contraseña" 
                        type={passwordVisibility.password ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => togglePasswordVisibility("password")}
                    >
                        {passwordVisibility.password ? <FiEyeOff /> : <FiEye />}
                    </span>
                </div>
                <div className="input-container">
                    <input 
                        placeholder="Confirmar contraseña" 
                        type={passwordVisibility.confirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                    >
                        {passwordVisibility.confirmPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                </div>
                <div className="input-container">
                    <input placeholder="Teléfono" type="text" name="telefono" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <select name="genero" className="styled-input" onChange={handleChange} value={formData.genero}>
                        <option value="">Selecciona tu género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>
                <div className="input-container">
                    <select name="pais" onChange={handleChange} value={formData.pais}>
                        <option>Selecciona un país</option>
                        {paises.map((pais, index) => (
                            <option key={index} value={pais}>{pais}</option>
                        ))}
                    </select>
                </div>
                <div className="input-container">                
                    <select name="ciudad" onChange={handleChange} value={formData.ciudad} disabled={!formData.pais}>
                        <option value="">Selecciona una ciudad</option>
                        {ciudades.map((ciudad, index) => (
                            <option key={index} value={ciudad}>{ciudad}</option>
                        ))}
                    </select>
                </div>

                <div className="ContainerCaptcha">
                    <ReCAPTCHA ref={captcha} sitekey="6LfF1OkqAAAAAECnyFaS_zNg7p7SvmABCvJScGo8" />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button className="submit" type="submit">
                    Crear Cuenta
                </button>
            </form>
        </main>
    );
};
