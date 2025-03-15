const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../config/auth");
const UserModel = require("../models/userModel");
const { sendConfirmationEmail, sendPasswordResetEmail } = require("../services/emailService");

const register = async (req, res) => {
    const { nombre, correo, password, telefono, pais, ciudad } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaHasheada = await bcrypt.hash(password, salt);

        const newUser = await UserModel.createUser({
            name: nombre,
            email: correo,
            password: contraseñaHasheada,
            telefono,
            pais,
            ciudad,
        });

        const token = generateToken({ id: newUser.id });
        await sendConfirmationEmail(correo, token);

        res.status(201).json({ 
            message: "Usuario registrado con éxito. Revisa tu correo para confirmar la cuenta.", 
            usuario: newUser 
        });
    } catch (error) {
        console.error("Error en el registro:", error.message);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await UserModel.findUserByEmail(correo);

        if (!user) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos." });
        }

        if (!user.is_verified) {
            return res.status(400).json({ error: "Cuenta no verificada. Revisa tu correo." });
        }

        const token = generateToken({ id: user.id });
        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error("Error en el login:", error.message);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

const confirmAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = verifyToken(token);
        await UserModel.updateUserVerification(decoded.id);
        res.json({ message: "Cuenta activada correctamente." });
    } catch (error) {
        console.error("Error al activar la cuenta:", error.message);
        res.status(400).json({ error: "Token inválido o expirado." });
    }
};

const recoverPassword = async (req, res) => {
    const { correo } = req.body;
    try {
        const user = await UserModel.findUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ error: "Correo no registrado." });
        }

        const token = generateToken({ id: user.id }, "1h");
        await UserModel.updateUserResetToken(user.id, token);
        await sendPasswordResetEmail(correo, token);

        res.json({ message: "Correo enviado con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor." });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = verifyToken(token);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.updateUserPassword(decoded.id, hashedPassword);
        res.json({ message: "Contraseña actualizada correctamente." });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Token inválido o expirado." });
    }
};

module.exports = { register, login, confirmAccount, recoverPassword, resetPassword };