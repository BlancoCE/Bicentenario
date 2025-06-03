// Agregar estas funciones al final de tu db.js, antes del module.exports

// Función para obtener eventos con filtros opcionales
const getEvents = async (options = {}) => {
  try {
    let queryText = `
      SELECT 
        id_evento,
        nombre,
        descripcion,
        fecha,
        ubicacion,
        departamento,
        tipo_evento,
        estado
      FROM eventos 
      WHERE estado = 'activo'
    `;
    
    const params = [];
    let paramCount = 0;

    // Filtro por ubicación/departamento
    if (options.location) {
      paramCount++;
      queryText += ` AND (LOWER(ubicacion) LIKE $${paramCount} OR LOWER(departamento) LIKE $${paramCount})`;
      params.push(`%${options.location.toLowerCase()}%`);
    }

    // Filtro por fecha (si se proporciona)
    if (options.date) {
      paramCount++;
      queryText += ` AND DATE(fecha) = $${paramCount}`;
      params.push(options.date);
    }

    // Ordenar por fecha
    queryText += ` ORDER BY fecha ASC`;

    // Limitar resultados si se especifica
    if (options.limit) {
      paramCount++;
      queryText += ` LIMIT $${paramCount}`;
      params.push(options.limit);
    }

    console.log('🔍 Ejecutando consulta de eventos:', { queryText, params });
    const result = await query(queryText, params);
    
    console.log(`📋 Encontrados ${result.rows.length} eventos`);
    return result.rows;
    
  } catch (error) {
    console.error('❌ Error al obtener eventos:', error);
    throw error;
  }
};

// Función para obtener expositores de un evento
const getEventSpeakers = async (eventId) => {
  try {
    const queryText = `
      SELECT 
        e.id_expositor,
        e.nombre,
        e.tema,
        e.institucion,
        e.especialidad,
        e.biografia
      FROM expositores e
      INNER JOIN evento_expositores ee ON e.id_expositor = ee.id_expositor
      WHERE ee.id_evento = $1
      ORDER BY e.nombre ASC
    `;

    console.log('🎤 Buscando expositores para evento ID:', eventId);
    const result = await query(queryText, [eventId]);
    
    console.log(`👨‍🏫 Encontrados ${result.rows.length} expositores`);
    return result.rows;
    
  } catch (error) {
    console.error('❌ Error al obtener expositores:', error);
    throw error;
  }
};

// Función para obtener la agenda de un evento
const getEventAgenda = async (eventId) => {
  try {
    const queryText = `
      SELECT 
        id_agenda,
        fecha,
        actividades,
        descripcion
      FROM agenda
      WHERE id_evento = $1
      ORDER BY fecha ASC
    `;

    console.log('⏰ Buscando agenda para evento ID:', eventId);
    const result = await query(queryText, [eventId]);
    
    console.log(`📅 Encontrados ${result.rows.length} elementos de agenda`);
    return result.rows;
    
  } catch (error) {
    console.error('❌ Error al obtener agenda:', error);
    throw error;
  }
};

// Actualizar el module.exports para incluir las nuevas funciones
module.exports = {
  pool,
  query,
  testConnection,
  getEvents,
  getEventSpeakers,
  getEventAgenda
};