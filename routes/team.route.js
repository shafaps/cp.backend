const express = require('express');
const route = express.Router();
const { createTeamMember, getTeamMemberById, updateTeamMember, deleteTeamMember,getAllTeamMembers } = require('../controllers/team.controller');
const { authenticateToken } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploads'); // Middleware for handling file uploads
const multerUpload = require('../middleware/multerUpload'); // Ensure this path is correct
const teamController = require('../controllers/team.controller');

// GET all projects
route.get("/", teamController.getAllTeamMembers);

// GET a single project by ID
route.get("/:id", teamController.getTeamMemberById);

// POST request to create a new project (authentication required)
route.post("/", authenticateToken, multerUpload.single('image'), teamController.createTeamMember);

// PUT request to update an existing project (authentication required)
route.put("/:id", authenticateToken, multerUpload.single('image'), teamController.updateTeamMember);

// DELETE request to delete a project by ID (authentication required)
route.delete("/:id", authenticateToken, teamController.deleteTeamMember);

module.exports = route;
