const pool = require("../config/db");

// GET todos los eventos
const getstats = async (req, res) => {
    try {
      const result = await pool.query(`
        WITH 
        usuarios_verificados AS (
            SELECT COUNT(*) AS total 
            FROM usuarios 
            WHERE verificado = TRUE
        ),
        eventos_futuros AS (
            SELECT COUNT(*) AS total 
            FROM eventos 
            WHERE fecha >= CURRENT_TIMESTAMP
        )
        SELECT 
            u.total AS users,
            e.total AS events
        FROM 
            usuarios_verificados u
        CROSS JOIN 
            eventos_futuros e
      `);
      
      // Asegurar que siempre devuelva los datos en el formato esperado
      const stats = result.rows[0] || { users: 0, events: 0 };
      
      res.json(stats); // Envía el objeto directamente, no el array rows
      
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({ 
        error: "Error del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

module.exports = {
  getstats,

};
