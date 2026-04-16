const pool = require('../config/db');

// Get all post-its
const getAll = async () => {
    const [results] = await pool.query('SELECT * FROM notes');
    return results;
};

// Get a post-it by ID
const getById = async (id) => {
    const [result] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return result[0];
};

// Create a new post-it
const create = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO notes (content, created_at, user_id) VALUES (?, ?, ?)',
    [data.content, new Date(), data.userId]
  );
  return result.insertId;
};

// Update a post-it
const update = async (id, data) => {
    const [result] = await pool.query(
        'UPDATE notes SET content = ?, created_at = ? WHERE id = ?',
        [data.content, new Date(), id]
    );
    return result.affectedRows > 0 ? id : null;
};

// Delete a post-it
const remove = async (id) => {
    const [result] = await pool.query ('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0 ? id : null;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};