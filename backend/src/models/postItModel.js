const pool = require('../config/db');

const create = async (data) => {
  const [result] = await pool.query(
    'INSERT INTO notes (content, created_at, user_id) VALUES (?, ?, ?)',
    [data.content, new Date(), data.userId]
  );
  return result.insertId;
};

exports.create = create;