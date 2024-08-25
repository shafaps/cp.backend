const ImageKit = require('imagekit');
const fs = require('fs');
const path = require('path');

// Initialize ImageKit
const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Middleware for handling file uploads
const upload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Upload file to ImageKit
    const filePath = req.file.path;
    const result = await imageKit.upload({
      file: fs.readFileSync(filePath),
      fileName: req.file.originalname
    });

    // Add the uploaded image URL to request object
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
  deleteImage
};
