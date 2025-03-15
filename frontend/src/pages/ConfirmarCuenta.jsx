import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ConfirmarCuenta = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState("Confirmando cuenta...");

    useEffect(() => {
        const confirmarRegistro = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/confirmar/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setMensaje("✅ Cuenta activada con éxito. Redirigiendo...");
                    setTimeout(() => navigate("/login"), 3000);
                } else {
                    setMensaje("❌ Error: " + data.error);
                }
            } catch (error) {
                setMensaje("❌ Error en el servidor.");
            }
        };

        confirmarRegistro();
    }, [token, navigate]);

    return (
        <div className="confirmacion-container">
            <h2>{mensaje} Esto se devuelve</h2>
        </div>
    );
};
