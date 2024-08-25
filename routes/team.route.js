const express = require('express');
const route = express.Router();
const { createTeamMember, getTeamMemberById, updateTeamMember, deleteTeamMember, getAllTeamMembers } = require('../controllers/team.controller');
const { authenticateToken } = require('../middleware/authenticateToken');
const { upload } = require('../middleware/uploads'); // Import upload middleware

// GET all team members
route.get("/", getAllTeamMembers);

// GET a single team member by ID
route.get("/:id", getTeamMemberById);

// POST request to create a new team member (authentication required)
route.post("/", authenticateToken, upload, createTeamMember); // Apply upload middleware here

// PUT request to update an existing team member (authentication required)
route.put("/:id", authenticateToken, upload, updateTeamMember); // Apply upload middleware here

// DELETE request to delete a team member by ID (authentication required)
route.delete("/:id", authenticateToken, deleteTeamMember);

module.exports = route;
