require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const imageKit = require('./utils/imagekit'); // Import the ImageKit instance

const app = express();

// Konfigurasi multer untuk menangani file upload
const upload = multer({ dest: 'uploads/' });

// Gunakan middleware CORS dengan konfigurasi
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Sajikan file statis dari folder "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk meng-upload file ke ImageKit
const uploadToImageKit = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filePath = req.file.path;
    const result = await imageKit.upload({
      file: fs.readFileSync(filePath),
      fileName: req.file.originalname
    });

    req.imageUrl = result.url;

    // Clean up local file after upload
    fs.unlinkSync(filePath);

    next();
  } catch (error) {
    console.error('Error uploading file to ImageKit:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
};
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
