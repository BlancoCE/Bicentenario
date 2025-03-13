require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Configuración de la base de datos
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

const transporter = nodemailer.createTransport({
    service: "gmail",
    
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 🔹 Función para enviar correo de confirmación
const sendConfirmationEmail = async (email, token) => {
    const confirmLink = `${process.env.FRONTEND_URL}/confirmar/${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Confirma tu Registro",
        html: `
            <h2>Hola, confirma tu registro</h2>
            <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:</p>
            <a href="${confirmLink}" style="
                background-color: #4CAF50;
                color: white;
                padding: 10px 15px;
                text-decoration: none;
                display: inline-block;
                margin-top: 10px;
                border-radius: 5px;
            ">Confirmar Registro</a>
            <p>Si no solicitaste este correo, ignóralo.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

// 🔹 Ruta para registrar usuario
app.post("/api/register", async (req, res) => {
    const { nombre, correo, password, telefono, pais, ciudad } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaHasheada = await bcrypt.hash(password, salt);

        // 🔹 Insertar usuario en la base de datos con `is_verified = false`
        const newUser = await pool.query(      
            "INSERT INTO users (name, email, password, is_verified, telefono, pais, ciudad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [nombre, correo, contraseñaHasheada, false, telefono, pais, ciudad]
        );
        
        // 🔹 Generar token de confirmación
        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // 🔹 Enviar correo de confirmación
        await sendConfirmationEmail(correo, token);

        res.status(201).json({ 
            message: "Usuario registrado con éxito. Revisa tu correo para confirmar la cuenta.", 
            usuario: newUser.rows[0] 
        });

    } catch (error) {
        console.error("Error en el registro:", error.message);

        if (error.code === "23505") {
            return res.status(400).json({ error: "El correo ya está registrado." });
        }
        if (error.code === "22P02") {
            return res.status(400).json({ error: "Formato de datos inválido." });
        }

        res.status(500).json({ error: "Error en el servidor." });
    }
});

app.post("/api/login", async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 🔹 Verificar si el usuario existe
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [correo]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        // 🔹 Comparar la contraseña con el hash almacenado
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        // 🔹 Verificar si la cuenta está confirmada
        if (!user.rows[0].is_verified) {
            return res.status(400).json({ error: "Cuenta no verificada. Revisa tu correo." });
        }

        // 🔹 Generar token JWT
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Inicio de sesión exitoso", token });

    } catch (error) {
        console.error("Error en el login:", error.message);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};

// 🔹 Ejemplo de ruta protegida
app.get("/api/perfil", verifyToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.userId]);
        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor." });
    }
});

// 🔹 Ruta para confirmar la cuenta
app.get("/api/confirmar/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔹 Activar la cuenta en la base de datos
        await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [decoded.id]);

        res.json({ message: "Cuenta activada correctamente." });

    } catch (error) {
        console.error("Error al activar la cuenta:", error.message);
        res.status(400).json({ error: "Token inválido o expirado." });
    }
});

app.post("/api/recover-password", async (req, res) => {
    const { correo } = req.body;

    try {

        const user = await pool.query("SELECT id FROM users WHERE email = $1", [correo]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: "Correo no registrado." });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        await pool.query("UPDATE users SET reset_token = $1 WHERE id = $2", [token, user.rows[0].id]);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: correo,
            subject: "Recuperación de Contraseña",
            html: `
                <h2>Recuperación de Contraseña</h2>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}" style="background-color:#4CAF50; color:white; padding:10px 15px; text-decoration:none; border-radius:5px;">
                    Restablecer Contraseña
                </a>
                <p>Este enlace expira en 1 hora.</p>`
        });

        res.json({ message: "Correo enviado con éxito." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
});

app.post("/api/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Actualizar la contraseña y eliminar el token
        await pool.query("UPDATE users SET password = $1, reset_token = NULL WHERE id = $2", [hashedPassword, decoded.id]);

        res.json({ message: "Contraseña actualizada correctamente." });

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Token inválido o expirado." });
    }
});


// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

module.exports = pool;
