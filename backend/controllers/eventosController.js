const pool = require("../config/db");

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
    
    // Si hay un expositor asociado, crear la relación en otra tabla
  /*  if (expositor) {
      await pool.query(
        "INSERT INTO eventos_expositores (id_evento, id_expositor) VALUES ($1, $2)",
        [result.rows[0].id_evento, expositor]
      );
    }*/
    
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

module.exports = {
  geteventos,
  geteventoe,
  postevento,
  putevento,
  deleteevento,
  getexpositores,
  getpatrocinadores,
  get5eventos,
};
