const formidable = require('formidable');
const imagekit = require('../utils/imagekit'); // Ensure you have an ImageKit utility file for the configuration

const upload = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    req.body = fields;
    req.file = files.image ? files.image[0] : null; // Adjust if your field name is different

    if (req.file) {
      try {
        const uploadResponse = await imagekit.upload({
          file: req.file.filepath, // Path to the temporary file
          fileName: req.file.originalFilename
        });

        req.fileUrl = uploadResponse.url; // URL from ImageKit
        next();
      } catch (uploadError) {
        res.status(500).json({
          message: 'Error uploading image',
          error: uploadError.message
        });
      }
    } else {
      next(); // No file to upload, continue
    }
  });
};

module.exports = upload;
