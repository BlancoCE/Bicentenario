const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Función para manejar errores de conexión
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getEvents: async (options = {}) => {
    const { date, location, type, limit = 5 } = options;
    let queryText = `
      SELECT e.id_evento, e.nombre, e.fecha, e.descripcion, e.tipo, 
             u.descripcion as ubicacion, u.departamento
      FROM Eventos e
      LEFT JOIN Ubicacion u ON e.id_evento = u.id_evento
    `;
    const params = [];
    const conditions = [];

    if (date) {
      conditions.push(`e.fecha = $${params.length + 1}`);
      params.push(date);
    }
    if (location) {
      conditions.push(`(u.departamento ILIKE $${params.length + 1} OR u.descripcion ILIKE $${params.length + 1})`);
      params.push(`%${location}%`);
    }
    if (type) {
      conditions.push(`e.tipo ILIKE $${params.length + 1}`);
      params.push(`%${type}%`);
    }

    if (conditions.length) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ` ORDER BY e.fecha LIMIT $${params.length + 1}`;
    params.push(limit);

    try {
      const result = await pool.query(queryText, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  getEventSpeakers: async (eventId) => {
    const queryText = `
      SELECT ex.nombre, ex.especialidad, ex.institucion, ee.tema
      FROM Eventos_Expositores ee
      JOIN Expositores ex ON ee.id_expositor = ex.id_expositor
      WHERE ee.id_evento = $1
    `;
    const result = await pool.query(queryText, [eventId]);
    return result.rows;
  },
  getEventAgenda: async (eventId) => {
    const queryText = `
      SELECT actividades, fecha
      FROM Agenda
      WHERE id_evento = $1
      ORDER BY fecha
    `;
    const result = await pool.query(queryText, [eventId]);
    return result.rows;
  }
};