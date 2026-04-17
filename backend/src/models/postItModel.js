const pool = require('../config/db');

// Get all post-its
const getAll = async (userId) => {
    const [results] = await pool.query('SELECT * FROM notes WHERE user_id = ?', [userId]);
    return results;
};

// Get a post-it by ID
const getById = async (id, userId) => {
    const [result] = await pool.query('SELECT * FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return result[0];
};

// Create a new post-it
const create = async (content, userId) => {
  const [result] = await pool.query(
    'INSERT INTO notes (content, created_at, user_id) VALUES (?, ?, ?)',
    [content, new Date(), userId]
  );
  return result.insertId;
};

// Update a post-it
const update = async (id, content, userId) => {
    const [result] = await pool.query(
        'UPDATE notes SET content = ?, created_at = ? WHERE id = ? AND user_id = ?',
        [content, new Date(), id, userId]
    );
    return result.affectedRows > 0 ? id : null;
};

// Delete a post-it
const remove = async (id, userId) => {
    const [result] = await pool.query ('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0 ? id : null;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};