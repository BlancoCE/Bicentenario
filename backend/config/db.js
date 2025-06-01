const { Pool } = require('pg');

// Configuración que funciona tanto en local como en Railway
const createPool = () => {
  // Si existe DATABASE_URL (Railway/producción), usarla
  if (process.env.DATABASE_URL) {
    console.log('🚀 Conectando usando DATABASE_URL (Railway)');
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  
  // Si no, usar variables individuales (desarrollo local)
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

// Probar conexión al inicio
testConnection();

module.exports = {
  pool,
  query,
  testConnection
};
