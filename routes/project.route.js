const express = require('express');
const route = express.Router();
const multerUpload = require('../middleware/multerUpload'); // Ensure this path is correct
const uploads = require('../middleware/uploads'); // Ensure this path is correct
const { createProject, updateProject, getAllProjects, getProjectById, deleteProject } = require('../controllers/project.controller');
const { authenticateToken } = require('../middleware/authenticateToken');
const projectController = require('../controllers/project.controller');

// GET semua proyek
route.get("/", projectController.getAllProjects);

// GET proyek berdasarkan ID
route.get("/:id", projectController.getProjectById);

// POST untuk membuat proyek baru (memerlukan autentikasi dan upload)
route.post("/", authenticateToken, multerUpload.single('image'), uploads.upload, projectController.createProject);

// PUT untuk memperbarui proyek yang ada (memerlukan autentikasi dan upload)
route.put("/:id", authenticateToken, multerUpload.single('image'), uploads.upload, projectController.updateProject);

// DELETE untuk menghapus proyek berdasarkan ID (memerlukan autentikasi)
route.delete("/:id", authenticateToken, projectController.deleteProject);

module.exports = route;
