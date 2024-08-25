// routes/project.route.js
const express = require('express');
const route = express.Router();
const { upload, uploadToImageKit, deleteImage } = require('../middleware/uploadMiddleware');
const { createProject, updateProject, getAllProjects, getProjectById, deleteProject } = require('../controllers/project.controller');
const { authenticateToken } = require('../middleware/authenticateToken');

// GET all projects
route.get("/", getAllProjects);

// GET project by ID
route.get("/:id", getProjectById);

// POST to create a new project (requires authentication and file upload)
route.post("/", authenticateToken, upload.single('image'), uploadToImageKit, createProject);

// PUT to update an existing project (requires authentication and file upload)
route.put("/:id", authenticateToken, upload.single('image'), uploadToImageKit, updateProject);

// DELETE to remove a project by ID (requires authentication)
route.delete("/:id", authenticateToken, deleteProject);

module.exports = route;
