const { Project } = require('../models'); // Adjust path as necessary

module.exports = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.findAll();
      res.json({
        message: "Projects retrieved successfully",
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching projects",
        error: error.message
      });
    }
  },

  // Get a single project by ID
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
      res.json({
        message: "Project retrieved successfully",
        data: project
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching project",
        error: error.message
      });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    try {
      const { name, description, link_project } = req.body;
      const image = req.fileUrl; // URL from ImageKit

      const newProject = await Project.create({ name, description, link_project, image });
      res.status(201).json({
        message: "Project created successfully",
        data: newProject
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating project",
        error: error.message
      });
    }
  },

  // Update an existing project
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, link_project } = req.body;
      const image = req.fileUrl; // URL from ImageKit

      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      await project.update({ name, description, link_project, image });
      res.json({
        message: "Project updated successfully",
        data: project
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating project",
        error: error.message
      });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
      await project.destroy();
      res.json({
        message: "Project deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting project",
        error: error.message
      });
    }
  }
};
