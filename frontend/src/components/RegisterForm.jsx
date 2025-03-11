import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/register.css";
import "../styles/exito.css";

export const RegisterForm = () => {
    const captcha = useRef(null);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        telefono: "",
        pais: "",
        ciudad: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!captcha.current.getValue()) {
            setErrorMessage("Por favor, completa el CAPTCHA antes de continuar.");
            return;
        }

        if (!formData.nombre.trim() || !formData.correo.trim() || !formData.password.trim() ||
            !formData.pais.trim() || !formData.ciudad.trim()) {
            setErrorMessage("Todos los campos requeridos deben estar llenos.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
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
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMessage("Error: " + data.error);
                return;
            }
            setShowModal(true);

            setTimeout(() => {
                navigate("/");
            }, 2500);

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
                <p className="form-title">Registrarse</p>

                <div className="input-container">
                    <input placeholder="Nombre de usuario" type="text" name="nombre" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input placeholder="Ingrese su correo electrónico" type="email" name="correo" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input 
                        placeholder="Contraseña" 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="input-container">
                    <input 
                        placeholder="Confirmar contraseña" 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                    />
                </div>
                
                <div className="input-container">
                    <input placeholder="Teléfono" type="number" name="telefono" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input placeholder="País" type="text" name="pais" onChange={handleChange} />
                </div>
                <div className="input-container">
                    <input placeholder="Ciudad" type="text" name="ciudad" onChange={handleChange} />
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
