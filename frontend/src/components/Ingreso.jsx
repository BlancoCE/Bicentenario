import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/register.css";

export const Ingreso = () => {
    const captcha = useRef(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
    });

    const togglePasswordVisibility = (fieldName) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [fieldName]: !prev[fieldName],
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!captcha.current.getValue()) {
            setErrorMessage("Por favor, completa el CAPTCHA.");
            return;
        }

        try {
            const response = await fetch("https://bicentenario-production.up.railway.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.error);
                return;
            }

            localStorage.setItem("token", data.token); // 🔹 Guardar token en localStorage

            navigate("/#/inicio"); // 🔹 Redirigir al inicio
            window.location.reload();

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorMessage("Error en el servidor.");
        }
    };

    return (
        <main>
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">Inicia sesión en tu cuenta</p>

                {errorMessage && <p className="error-messages">{errorMessage}</p>}

                <div className="input-container">
                    <input 
                        placeholder="Ingrese su correo electrónico" 
                        type="email" 
                        name="correo" 
                        value={formData.correo} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="input-container">
                    <input 
                        placeholder="Introduce tu contraseña" 
                        type={passwordVisibility.password ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => togglePasswordVisibility("password")}
                        >
                    {passwordVisibility.password ? <FiEyeOff  color="#004d40"/> : <FiEye  color="#004d40"/>}
                    </span>
                </div>

                <div className="ContainerCaptcha">
                    <ReCAPTCHA ref={captcha} sitekey="6LfF1OkqAAAAAECnyFaS_zNg7p7SvmABCvJScGo8" />
                </div>
                
                <button className="submit" type="submit">
                    Iniciar sesión
                </button>

                <p className="signup-link">
                    ¿Sin cuenta? <Link to="/#/register">Registrarse</Link>
                </p>
                <p className="signup-link2">
                    <Link to="/#/recuperacion">Me olvide mi contraseña</Link>
                </p>
            </form>
        </main>
    );
};