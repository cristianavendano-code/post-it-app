const express = require('express');
const app = express();
const pool = require('./config/db');
const cors = require('cors');
const port = 3000;
const postItRoutes = require('./routes/postItRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/postits', postItRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//SELECT 1 + 1 AS test
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 + 1 AS test');
    console.log('Database connection successful:', rows);
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testDBConnection();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
