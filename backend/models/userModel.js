const pool = require("../config/db");

class UserModel {
    static async createUser({ name, email, password, telefono, pais, ciudad, genero }) {
        const query = `
            INSERT INTO usuarios (nombre, email, contrasena, verificado, telefono, pais, ciudad, genero, fechacreacion,id_rol)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP,1)
            RETURNING id_usuario, nombre, email, verificado
        `;
        const values = [name, email, password, false, telefono, pais, ciudad, genero];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findUserByEmail(email) {
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findUserById(id) {
        const query = "SELECT * FROM usuarios WHERE id_usuario = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async updateUserVerification(userId) {
        const query = `
            UPDATE usuarios 
            SET verificado = true
            WHERE id_usuario = $1
            RETURNING id_usuario, nombre, email, verificado
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    }

    static async updateUserResetToken(userId, token) {
        const query = `
            UPDATE usuarios 
            SET tokenrecuperacion = $1 
            WHERE id_usuario = $2
            RETURNING id_usuario, email
        `;
        const result = await pool.query(query, [token, userId]);
        return result.rows[0];
    }

    static async updateUserPassword(userId, password) {
        const query = `
            UPDATE usuarios 
            SET contrasena = $1, 
                tokenrecuperacion = NULL 
            WHERE id_usuario = $2
            RETURNING id_usuario, email
        `;
        const result = await pool.query(query, [password, userId]);
        return result.rows[0];
    }
}

module.exports = UserModel;