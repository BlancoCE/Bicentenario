import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/register.css";

export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje("Contraseña actualizada. Redirigiendo...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setMensaje("Error: " + data.error);
            }
        } catch (error) {
            setMensaje("Error en el servidor.");
        }
    };

    return (
        <main>
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">Restablecer Contraseña</p>
                {mensaje && <p className="error-message">{mensaje}</p>}
                <div className="input-container">
                    <input
                        placeholder="Nueva contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="submit" type="submit">
                    Guardar nueva contraseña
                </button>
            </form>
        </main>
    );
};
