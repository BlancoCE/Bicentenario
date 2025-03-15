const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

pool.connect()
    .then(() => console.log("🟢 Conexión exitosa con PostgreSQL"))
    .catch(err => console.error("🔴 Error al conectar con PostgreSQL:", err.message));

module.exports = pool;