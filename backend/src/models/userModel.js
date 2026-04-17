const pool = require('../config/db');

// Creat a new user
const create = async (data) => {
    const [result] =await pool.query(
        'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)',
        [data.username, data.email, data.password, new Date()]
    );
    return result.insertId;
}

// Get a user by email
const getByEmail = async (email) => {
    const [result] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return result[0];
}

module.exports = {
    create,
    getByEmail
};
