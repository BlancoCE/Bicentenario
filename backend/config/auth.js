const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateToken = (payload, expiresIn = "1d") => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado en las variables de entorno");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado en las variables de entorno");
    }
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };