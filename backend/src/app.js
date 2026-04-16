const express = require('express')
const app = express()
const pool = require('./config/db');
const port = 3000
const postItRoutes = require('./routes/postItRoutes');

app.use(express.json());

app.use('/api/postits', postItRoutes);

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
