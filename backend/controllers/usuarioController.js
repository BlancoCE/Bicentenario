const pool = require("../config/db");
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para manejar variables de entorno

const getperfil = async (req, res) => {
    try {
        // Obtener el ID del usuario del token JWT
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Asume que el token contiene el ID del usuario
        
        const result = await pool.query(
            "SELECT id, name, email, telefono, pais, ciudad FROM users WHERE id = $1",
            [userId]  // Usar el ID del token, no de los parámetros
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // No devolver la contraseña ni datos sensibles
        const userData = result.rows[0];
        res.json({
            nombre: userData.name,
            correo: userData.email,
            telefono: userData.telefono,
            pais: userData.pais,
            ciudad: userData.ciudad,
        });
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Token inválido" });
        }
        res.status(500).json({ error: "Error del servidor" });
    }
};

  module.exports = {
    getperfil,
  };