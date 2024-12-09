require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'FitnessTrackDB'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL...');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM Users WHERE email = ? AND password = ? LIMIT 1';
  db.execute(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      const user = results[0];
      // Returns all information that will be important for the profile tab on the UI
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          UserID: user.UserID,
          firstName: user.Fname,
          lastName: user.Lname,
          email: user.Email,
          dateOfBirth: user.DateOfBirth
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Signup endpoint
app.post('/signup', (req, res) => {
  const { email, password, firstName, lastName, dateOfBirth } = req.body;

  if (!email || !password || !firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ error: 'Please enter all fields'});
  }

  // Formatted date to match the required format for the query
  const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
  const query = 'INSERT INTO Users (Fname, Lname, Email, Password, DateOfBirth) VALUES (?, ?, ?, ?, ?)';
  console.log(query);
  db.execute(query, [firstName, lastName, email, password, formattedDate], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Account with that email already exists' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
