const pool = require("../config/db");
const jwt = require('jsonwebtoken');

// GET todos los eventos
const geteventos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Eventos order by fecha");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const get5eventos = async (req, res) => {
  try {
    const result = await pool.query("select * from eventos where fecha>=CURRENT_TIMESTAMP limit 5");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getexpositores = async (req, res) => {
  try {
    const result = await pool.query("SELECT nombre, id_expositor FROM Expositores ORDER BY NOMBRE");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener expositores:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getpatrocinadores = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Patrocinadores");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener patrocinadores:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// GET un solo evento por ID
const geteventoe = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM Eventos WHERE id_evento = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    console.log(result);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// POST nuevo evento
const postevento = async (req, res) => {
  try {
    const { 
      nombre, enlace, fecha, descripcion, tipo, ubicacion, 
      hora, modalidad, imagen, fecha2, hora2, ubicacion2, 
      numero, expositor 
    } = req.body;
    
    // Validación de campos obligatorios
    if (!nombre || !fecha || !hora || !modalidad) {
      return res.status(400).json({ 
        error: "Campos obligatorios: nombre, fecha, hora y modalidad" 
      });
    }

    // Determinar el lugar basado en la modalidad
    const lugar = modalidad === 'presencial' ? ubicacion : enlace;
    
    // Preparar datos para la inserción
    const eventData = [
      nombre, fecha, descripcion, tipo, lugar, hora, 
      modalidad, fecha2 || null, hora2 || null, numero || null
    ];
    
    // Insertar evento en la base de datos
    const eventQuery = `
      INSERT INTO Eventos (
        nombre, fecha, descripcion, tipo, lugar, hora, 
        modalidad, fecha_final, hora_final, contacto
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`;
    
    const result = await pool.query(eventQuery, eventData);
    
    // Devolver el evento creado
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al añadir evento:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// PUT actualizar evento
const putevento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha, descripcion, tipo } = req.body;
 /*   const { 
      nombre, enlace, fecha, descripcion, tipo, ubicacion, 
      hora, modalidad, imagen, fecha2, hora2, ubicacion2, 
      numero, expositor 
    } = req.body;*/
    const result = await pool.query(
      "UPDATE Eventos SET nombre = $1, fecha = $2, descripcion = $3, tipo = $4 WHERE id_evento = $5 RETURNING *",
      [nombre, fecha, descripcion, tipo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// DELETE evento
const deleteevento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID es un número entero
    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({ message: "ID de evento no válido" });
    }

    const result2 = await pool.query(
      "DELETE FROM participantes_eventos WHERE id_evento = $1 RETURNING *", 
      [id]
    );

    const result = await pool.query(
      "DELETE FROM Eventos WHERE id_evento = $1 RETURNING *", 
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Respuesta exitosa sin contenido (204)
    res.status(204).end();
    
    // O si prefieres enviar un mensaje (entonces usar 200)
    // res.status(200).json({ message: "Evento eliminado exitosamente" });
    
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const subscribirse = async (req, res) => {
  // 1. Validar token de autenticación
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Token de autenticación requerido" 
    });
  }

  try {
    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 3. Validar datos de entrada
    const { id_evento } = req.body;
    if (!id_evento) {
      return res.status(400).json({
        success: false,
        message: "El ID del evento es requerido"
      });
    }

    // 4. Verificar si el evento existe
    const eventoExistente = await pool.query(
      'SELECT id_evento FROM eventos WHERE id_evento = $1',
      [id_evento]
    );
    
    if (eventoExistente.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El evento no existe"
      });
    }

    // 5. Verificar si el usuario ya está suscrito
    const suscripcionExistente = await pool.query(
      `SELECT * FROM participantes_eventos 
       WHERE id_usuario = $1 AND id_evento = $2`,
      [userId, id_evento]
    );

    if (suscripcionExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "El usuario ya está suscrito a este evento"
      });
    }

    // 6. Crear la suscripción
    const result = await pool.query(
      `INSERT INTO participantes_eventos (id_usuario, id_evento)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, id_evento]
    );

    // 7. Responder con éxito
    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Suscripción realizada correctamente"
    });

  } catch (error) {
    console.error('Error en suscripción:', error);
    
    // Manejar diferentes tipos de errores
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Token inválido"
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expirado"
      });
    }

    // Errores de base de datos
    if (error.code === '23505') { // Violación de unique constraint
      return res.status(409).json({
        success: false,
        message: "El usuario ya está suscrito a este evento"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const registerToEvent = async (req, res) => {
    const { eventId } = req.params;
     const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: "No autorizado" });
        }
    
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Asume que el token contiene el ID del usuario

    try {

        // 1. Verificar que el usuario no esté ya registrado
        const existingRegistration = await pool.query(
            'SELECT * FROM participantes_eventos WHERE id_evento = $1 AND id_usuario = $2',
            [eventId, userId]
        );

        if (existingRegistration.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya estás registrado en este evento' 
            });
        }

        // 4. Registrar al usuario en el evento
        const registration = await pool.query(
            `INSERT INTO participantes_eventos 
            (id_evento, id_usuario) 
            VALUES ($1, $2) 
            RETURNING *`,
            [eventId, userId]
        );

        res.status(201).json({
            success: true,
            message: 'Registro exitoso',
            registration: registration.rows[0],
        });

    } catch (error) {
        console.error('Error en el registro al evento:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

// En tu controlador (ej. eventosController.js)
const getEventosPorTipo = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tipo, COUNT(*) as cantidad 
       FROM eventos 
       GROUP BY tipo 
       ORDER BY cantidad DESC`
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error al obtener eventos por tipo:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de eventos"
    });
  }
};

module.exports = {
  geteventos,
  geteventoe,
  postevento,
  putevento,
  deleteevento,
  getexpositores,
  getpatrocinadores,
  get5eventos,
  subscribirse,
  getEventosPorTipo,
  registerToEvent,
};
