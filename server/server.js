const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/number-selector',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.post('/save', async (req, res) => {
  const { characterName, selectedNumbers } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO numbers (character_name, selected_numbers) VALUES ($1, $2) ON CONFLICT (character_name) DO UPDATE SET selected_numbers = EXCLUDED.selected_numbers',
      [characterName, selectedNumbers]
    );
    client.release();
    res.json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data. Please try again.' });
  }
});

app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM numbers');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
