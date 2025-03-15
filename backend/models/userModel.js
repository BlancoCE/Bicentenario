const pool = require("../config/db");

class UserModel {
    static async createUser({ name, email, password, telefono, pais, ciudad }) {
        const query = `
            INSERT INTO users (name, email, password, is_verified, telefono, pais, ciudad)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [name, email, password, false, telefono, pais, ciudad];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async updateUserVerification(userId) {
        const query = "UPDATE users SET is_verified = true WHERE id = $1";
        await pool.query(query, [userId]);
    }

    static async updateUserResetToken(userId, token) {
        const query = "UPDATE users SET reset_token = $1 WHERE id = $2";
        await pool.query(query, [token, userId]);
    }

    static async updateUserPassword(userId, password) {
        const query = "UPDATE users SET password = $1, reset_token = NULL WHERE id = $2";
        await pool.query(query, [password, userId]);
    }
}

module.exports = UserModel;