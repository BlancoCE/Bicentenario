import { useState } from "react";
import "../styles/register.css";

export const Recuperacion = () => {
    const [correo, setCorreo] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!correo.trim()) {
            setMensaje("Por favor, introduce un correo válido.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/recover-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo }),
            });

            const data = await response.json();
            if (response.ok) {
                setMensaje("Se ha enviado un correo con instrucciones.");
            } else {
                setMensaje("Error: " + data.error);
            }
        } catch (error) {
            setMensaje("Error en el servidor. Intenta más tarde.");
        }
    };

    return (
        <main>
            <form className="form" onSubmit={handleSubmit}>
                <p className="form-title">¿Olvidaste tu contraseña?</p>
                
                {mensaje && <p className="error-message">{mensaje}</p>}

                <div className="input-container">
                    <input
                        placeholder="Correo electrónico"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>

                <button className="submit" type="submit">
                    Enviar
                </button>
            </form>
        </main>
    );
};