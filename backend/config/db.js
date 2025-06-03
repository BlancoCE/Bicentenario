const { Pool } = require('pg');

// Debug: Mostrar variables de entorno (sin contraseñas)
console.log('🔍 DEBUG - Variables de entorno:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   DATABASE_URL existe:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log('   DATABASE_URL (parcial):', process.env.DATABASE_URL.substring(0, 20) + '...');
} else {
  console.log('   DATABASE_URL: NO DEFINIDA');
}

// Configuración que funciona tanto en local como en Railway
const createPool = () => {
  // Si existe DATABASE_URL (Railway/producción), usarla
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://username:password@host:port/database') {
    console.log('🚀 Conectando usando DATABASE_URL (Railway)');
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  
  // Si DATABASE_URL tiene el valor por defecto o no existe, usar variables individuales
  console.log('🏠 Conectando usando variables locales');
  return new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'BICENTENARIO'
  });
};

const pool = createPool();

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa con PostgreSQL');
    
    // Mostrar información de la base de datos
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Error al conectar con PostgreSQL:', err.message);
    console.error('🔧 Configuración actual:');
    if (process.env.DATABASE_URL) {
      console.error('   DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
    } else {
      console.error('   HOST:', process.env.DB_HOST || 'localhost');
      console.error('   PORT:', process.env.DB_PORT || 5432);
      console.error('   USER:', process.env.DB_USER || 'postgres');
      console.error('   DATABASE:', process.env.DB_NAME || 'BICENTENARIO');
    }
    return false;
  }
};

// Función genérica para consultas con manejo de errores
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📝 Consulta ejecutada:', {
      query: text.substring(0, 50) + '...',
      duration: duration + 'ms',
      rows: res.rowCount
    });
    return res;
  } catch (error) {
    console.error('❌ Error en consulta SQL:', {
      query: text.substring(0, 100),
      error: error.message,
      params: params
    });
    throw error;
  }
};

// Funciones básicas para eventos (versión segura)
const getEvents = async (options = {}) => {
  try {
    console.log('🔍 getEvents llamada con opciones:', options);
    
    // Verificar que el pool esté configurado correctamente
    if (!pool) {
      throw new Error('Pool de conexiones no inicializado');
    }
    
    // Consulta básica muy simple para probar
    let queryText = 'SELECT 1 as test';
    const params = [];
    
    const result = await query(queryText, params);
    console.log('✅ Consulta de prueba exitosa');
    
    // Retornar datos de prueba por ahora
    return [
      {
        id_evento: 1,
        nombre: 'Evento de Prueba',
        descripcion: 'Descripción de prueba',
        fecha: new Date(),
        ubicacion: 'La Paz',
        departamento: 'La Paz'
      }
    ];
    
  } catch (error) {
    console.error('❌ Error en getEvents:', error);
    throw error; // Re-lanzar el error para que se maneje arriba
  }
};

const getEventSpeakers = async (eventId) => {
  try {
    console.log('🎤 getEventSpeakers para evento:', eventId);
    return []; // Retornar array vacío por ahora
  } catch (error) {
    console.error('❌ Error en getEventSpeakers:', error);
    return [];
  }
};

const getEventAgenda = async (eventId) => {
  try {
    console.log('⏰ getEventAgenda para evento:', eventId);
    return []; // Retornar array vacío por ahora
  } catch (error) {
    console.error('❌ Error en getEventAgenda:', error);
    return [];
  }
};

// Probar conexión al inicio
testConnection();

module.exports = {
  pool,
  query,
  testConnection,
  getEvents,
  getEventSpeakers,
  getEventAgenda
};