// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ImageKit = require('imagekit');

// Initialize ImageKit
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory is writable
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize Multer
const upload = multer({ storage: storage });

// Middleware for uploading file to ImageKit
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

// Middleware for deleting image from ImageKit
const deleteImage = async (fileId) => {
  try {
    await imageKit.deleteFile(fileId);
  } catch (error) {
    console.error('Error deleting image from ImageKit:', error);
  }
};

module.exports = {
  upload,
  uploadToImageKit,
  deleteImage
};
