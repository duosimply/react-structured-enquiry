// server.js

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const url = require('url')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./config/db')

const app = express()

const SECRET_KEY = '99dd2dfba85f2305e35b1d1c92a4387d69c4f54409b197148ba42c0abfa59efd43dd6ccd794bcf80515edad6be2a06891558a5aee47e174642e2a6eff76444ae';

// Middleware to parse JSON bodies
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)
app.use(bodyParser.json())

const storage = multer.memoryStorage();  // Store the file in memory
const upload = multer({ storage });

app.post('/register', async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!['employee', 'employer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }

  // Only employers should have a company value
  if (role === 'employer' && !company) {
    return res.status(400).json({ message: 'Company name is required for employers.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let query = `
      INSERT INTO users (name, email, password, role
    `;
    let queryParams = [name, email, hashedPassword, role];
    console.log(queryParams)
    if (role === 'employer') {
      query += ', company) VALUES (?, ?, ?, ?, ?)';
      queryParams.push(company);
    } else {
      query += ') VALUES (?, ?, ?, ?)';
    }

    await db.promise().query(query, queryParams);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email already exists.' });
    } else {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Failed to register user.' });
    }
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const query = `
      SELECT * FROM users WHERE email = ?
    `;
    const [results] = await db.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Create JWT with user ID and role
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    // Return both token and role in the response
    res.status(200).json({ message: 'Login successful.', token, role: user.role, company: user.company });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Failed to log in.' });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};


app.get('/employer/applications', authenticateToken, async (req, res) => {
  try {
    const { company } = req.headers; // Get the employer's company from the request headers
    // Check if company is provided
    if (!company) {
      return res.status(400).json({ message: 'Company information is required.' });
    }

    // Query to fetch applications based on the employer's company
    const query = `
      SELECT * FROM jobs
      WHERE company = ?
    `;
    const [applicationsResults] = await db.promise().query(query, [company]);

    if (applicationsResults.length === 0) {
      return res.status(200).json([]); // Return empty array if no applications
    }

    res.status(200).json(applicationsResults); // Send the applications
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});



app.get('/locations', authenticateToken, async (req, res) => {
  const query = `
    SELECT DISTINCT location FROM jobs
  `

  let [result] = await db.promise().query(query)
  let locations = result.map(row => row.location)
  res.json(locations)
})

app.get('/jobs', authenticateToken, async (req, res) => {
  let params = url.parse(req.url, true).query
  console.log(params)
  let min = 0,
    max = 10
  switch (Number(params.salary)) {
    case 1:
      min = 0
      max = 50000
      break
    case 2:
      min = 50000
      max = 100000
    case 3:
      min = 100000
      max = 99999999
      break
  }

  const query = `
    SELECT * FROM jobs
    WHERE experience = ? AND location = ? AND salary >= ? AND salary < ?
  `
  const values = [params.experienceLevel, params.location, min, max]
  let [result] = await db.promise().query(query, values)

  res.json(result)
})

app.post('/jobs', authenticateToken, async (req, res) => {
  const { title, company, salary, experience, location } = req.body;

  // Ensure the required fields are provided
  if (!title || !company || !salary || !experience || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the user is an employer (assuming the role is attached to the token)
  const { role } = req.user; // Assuming the decoded user object is attached in `req.user`
  if (role !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Only employers can post jobs.' });
  }

  const query = `
    INSERT INTO jobs (title, company, salary, experience, location)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [title, company, salary, experience, location];

  try {
    const [results] = await db.promise().query(query, values); // Use promise-based query
    // Respond with a success message and the created job ID
    res.status(201).json({ message: 'Job posted successfully!', jobId: results.insertId });
  } catch (err) {
    console.error('Error inserting job:', err);
    res.status(500).json({ message: 'Failed to post job.' });
  }
});


app.get('/applications/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT j.title, j.company, a.status
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = ?
    `;
    const [results] = await db.promise().query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No applications found for this user ID.' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error retrieving application status:', err);
    res.status(500).json({ message: 'Error retrieving application status.' });
  }
});

app.post('/applications', upload.single('resume'), authenticateToken, (req, res) => {
  const { jobId, applicantName, applicantEmail } = req.body;
  const resume = req.file.buffer;  // File content as a buffer

  if (!jobId || !applicantName || !applicantEmail || !resume) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO applications (job_id, name, email, resume, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [jobId, applicantName, applicantEmail, resume, 'Applied'], (err, results) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ message: 'Failed to upload application.' });
    }

    res.status(201).json({ message: 'Application submitted successfully!' });
  });
});

app.post('/user-id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    const query = `
      SELECT id FROM applications
      WHERE name = ? AND email = ?
    `;
    const [results] = await db.promise().query(query, [name, email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userId = results[0].id;
    res.status(200).json({ userId });
  } catch (err) {
    console.error('Error retrieving user ID:', err);
    res.status(500).json({ message: 'Error retrieving user ID.' });
  }
});

// Start the server
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
