const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../config/auth");
const UserModel = require("../models/userModel");
const { sendConfirmationEmail, sendPasswordResetEmail } = require("../services/emailService");

const register = async (req, res) => {
    const { nombre, correo, password, telefono, pais, ciudad, genero } = req.body;
    try {
        // Verificar si el correo ya está registrado
        const existingUser = await UserModel.findUserByEmail(correo);
        if (existingUser) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const contraseñaHasheada = await bcrypt.hash(password, salt);

        const newUser = await UserModel.createUser({
            name: nombre,
            email: correo,
            password: contraseñaHasheada,
            telefono,
            pais,
            ciudad,
            genero,
        });

        const token = generateToken({ id: newUser.id_usuario });
        await sendConfirmationEmail(correo, token);

        res.status(201).json({ 
            success: true,
            message: "Usuario registrado con éxito. Revisa tu correo para confirmar la cuenta.", 
            usuario: {
                id: newUser.id_usuario,
                nombre: newUser.nombre,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error en el registro:", error.message);
        res.status(500).json({ 
            success: false,
            error: "Error en el servidor al registrar el usuario." 
        });
    }
};

const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await UserModel.findUserByEmail(correo);

        if (!user) {
            return res.status(400).json({ 
                success: false,
                error: "Correo o contraseña incorrectos." 
            });
        }
        const isValidPassword = await bcrypt.compare(password, user.contrasena);    
        if (!isValidPassword) {
            return res.status(400).json({ 
                success: false,
                error: "Correo o contraseña incorrectos." 
            });
        }
        if (!user.verificado) {
            return res.status(403).json({ 
                success: false,
                error: "Cuenta no verificada. Revisa tu correo electrónico para confirmar tu cuenta." 
            });
        }
        const token = generateToken({ id: user.id_usuario });
        res.json({ 
            success: true,
            message: "Inicio de sesión exitoso", 
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error en el login:", error.message);
        res.status(500).json({ 
            success: false,
            error: "Error en el servidor al iniciar sesión." 
        });
    }
};

const confirmAccount = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = verifyToken(token);
        const user = await UserModel.findUserById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "Usuario no encontrado." 
            });
        }
        if (user.verificado) {
            return res.status(200).json({ 
                success: true,
                message: "La cuenta ya estaba verificada." 
            });
        }
        const updatedUser = await UserModel.updateUserVerification(decoded.id);
        
        res.json({ 
            success: true,
            message: "Cuenta activada correctamente. Ya puedes iniciar sesión.",
            user: {
                id: updatedUser.id_usuario,
                email: updatedUser.email
            }
        });
        
    } catch (error) {
        console.error("Error al activar la cuenta:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: "El enlace de confirmación ha expirado. Solicita uno nuevo." 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ 
                success: false,
                error: "Token de confirmación inválido." 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error en el servidor al activar la cuenta." 
        });
    }
};

const recoverPassword = async (req, res) => {
    const { correo } = req.body;
    try {
        const user = await UserModel.findUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "Correo no registrado." 
            });
        }

        const token = generateToken({ id: user.id_usuario }, "1h");
        await UserModel.updateUserResetToken(user.id_usuario, token);
        await sendPasswordResetEmail(correo, token);

        res.json({ 
            success: true,
            message: "Correo enviado con éxito. Revisa tu bandeja de entrada." 
        });
    } catch (error) {
        console.error("Error en recuperación de contraseña:", error);
        res.status(500).json({ 
            success: false,
            error: "Error en el servidor al procesar la solicitud." 
        });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = verifyToken(token);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const updatedUser = await UserModel.updateUserPassword(decoded.id, hashedPassword);
        
        res.json({ 
            success: true,
            message: "Contraseña actualizada correctamente.",
            user: {
                id: updatedUser.id_usuario,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error("Error al restablecer contraseña:", error);
        
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: "El enlace ha expirado o es inválido. Solicita uno nuevo." 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error en el servidor al restablecer la contraseña." 
        });
    }
};

module.exports = { 
    register, 
    login, 
    confirmAccount, 
    recoverPassword, 
    resetPassword 
};