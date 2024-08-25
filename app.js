const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Use CORS with configuration
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import dan gunakan route
const routes = require('./routes');
app.use(routes); // Gunakan route yang diimpor dari ./routes

// Konfigurasi port dan mulai server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
