require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api", authRoutes);

// Ruta para el chat
app.use('/api/chat', chatRoutes); // Esto hace que las rutas en chat.js estén bajo /api/chat

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
  });

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor encendido`));
