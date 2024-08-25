const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// Konfigurasi multer untuk menangani file upload
const upload = multer({ dest: 'uploads/' }); // Gunakan sesuai kebutuhan

// Gunakan middleware CORS dengan konfigurasi
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sajikan file statis dari folder "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware lainnya
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
