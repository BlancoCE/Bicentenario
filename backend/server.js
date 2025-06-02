require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chat");

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://joax2020.github.io'] // Cambia por tu URL de GitHub Pages
    : ['http://localhost:5173', 'http://127.0.0.1:5500'],
  credentials: true
}));

// Ruta de salud para verificar que todo funciona
app.get('/health', async (req, res) => {
  try {
    // Importar y probar conexión a base de datos
    const db = require('./db'); // o el archivo donde tengas tu pool
    const dbStatus = await db.testConnection();
    
    res.status(200).json({ 
      status: 'OK', 
      message: 'Servidor del Bicentenario funcionando correctamente',
      database: dbStatus ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error en el servidor',
      error: error.message
    });
  }
});

// Rutas principales
app.use("/api", authRoutes);
app.use('/api/chat', chatRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({ 
    message: '🇧🇴 API del Bicentenario de Bolivia',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api',
      chat: '/api/chat'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor del Bicentenario corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Memoria utilizada: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`);
});

module.exports = app;