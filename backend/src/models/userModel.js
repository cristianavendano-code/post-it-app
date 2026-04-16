const pool = require('../config/db');

// Creat a new user
const create = async (data) => {
    const [result] =await pool.query(
        'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)',
        [data.username, data.email, data.password, new Date()]
    );
    return result.insertId;
}

module.exports = {
    create
};
