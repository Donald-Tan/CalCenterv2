require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection setup
const mysql = require('mysql2/promise'); // promise required for CalorieLossScreen
console.log("Creating connection pool...");
const pool = mysql.createPool({ // createConnection for mysql2/promise
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'FitnessTrackDB'
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('\n------> Connected to MySQL Server <------\n');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1);
  }
})();

module.exports = pool; // Export the pool for usage in queries

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM Users WHERE email = ? AND password = ? LIMIT 1';
  try {
    const [results] = await pool.execute(query, [email, password]);

    if (results.length > 0) {
      const user = results[0];
      // Returns all information that will be important for the profile tab on the UI
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          userID: user.UserID,
          firstName: user.Fname,
          lastName: user.Lname,
          email: user.Email,
          dateOfBirth: user.DateOfBirth
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, dateOfBirth } = req.body;

  if (!email || !password || !firstName || !lastName || !dateOfBirth) {
    return res.status(400).json({ error: 'Please enter all fields'});
  }

  // Formatted date to match the required format for the query
  const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
  const query = 'INSERT INTO Users (Fname, Lname, Email, Password, DateOfBirth) VALUES (?, ?, ?, ?, ?)';
  try {
    await pool.execute(query, [firstName, lastName, email, password, formattedDate]);
    return res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Account with that email already exists' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activities from the Activities table
app.get('/activities', async (req, res) => {
  // Returns all activities from table for dropdown
  try {
    const [entries] = await pool.query('SELECT ActivityId AS ActivityID, Name AS ActivityName, CaloriesPerHour FROM Activities');
    res.json({ activities: entries });
  } catch (err) {
    console.error('Error fetching activities:', err.message);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Log activity to ActivityLogs table
app.post('/activity-logs', async (req, res) => {
  const { UserID, ActivityID, Date, Duration } = req.body;
  const query = 'INSERT INTO ActivityLogs (UserID, ActivityID, Date, Duration) VALUES (?, ?, ?, ?)';
  // Logs the provided activity and duration into table for other calculations
  try {
    await pool.execute(query, [UserID, ActivityID, Date, Duration]);
    res.status(201).json({ success: true, message: 'Activity logged successfully' });
  } catch (err) {
    console.error('Error logging activity:', err);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

app.get('/activity-logs', async (req, res) => {
  const { userID, date } = req.query;
  if (!userID || !date) {
    return res.status(400).json({ error: 'userID and date are required' });
  }
  // Selects all entries from current date and with the correct user id
  const query = 'SELECT * FROM ActivityLogs WHERE UserID = ? AND Date = ?';
  try {
    const [results] = await pool.execute(query, [userID, date]);
    res.status(200).json({ success: true, loggedActivities: results });
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to retrieve activities' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
