const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Use CORS middleware with proper configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use routes
const routes = require('./routes');
app.use('/projects', routes); // Adjust if routes are mounted on a different path

// Configure port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
