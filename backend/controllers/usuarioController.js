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
            "SELECT id_usuario, nombre, email, telefono, pais, ciudad FROM usuarios WHERE id_usuario = $1",
            [userId]  // Usar el ID del token, no de los parámetros
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        // No devolver la contraseña ni datos sensibles
        const userData = result.rows[0];
        res.json({
            nombre: userData.nombre,
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

const getusuarios = async (req, res) => {
    try {
      const result = await pool.query("SELECT u.apellidopaterno,u.apellidomaterno,u.usuario,u.nombre,u.email,u.telefono,u.genero,u.verificado,r.nombre as rol FROM Usuarios u, Roles r Where u.id_rol=r.id_rol");
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };


  const getrol = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token expirado" });
        }
        return res.status(401).json({ message: "Token inválido" });
      }
  
      const userId = decoded.id;
      if (!userId) {
        return res.status(400).json({ message: "ID de usuario no encontrado en token" });
      }
  
      const { rows } = await pool.query(
        `SELECT r.nombre as rol 
         FROM Usuarios u
         INNER JOIN Roles r ON u.id_rol = r.id_rol
         WHERE u.id_usuario = $1`,
        [userId]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(rows[0]); // Devuelve solo el primer resultado
    } catch (error) {
      console.error("Error al obtener rol:", error);
      res.status(500).json({ 
        error: "Error del servidor",
        details: error.message 
      });
    }
  };

  module.exports = {
    getperfil,
    getusuarios,
    getrol,
  };