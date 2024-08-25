const { Project } = require('../models');
const imagekit = require('../utils/imagekit');

module.exports = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const { name, description, link_project } = req.body;
            const file = req.file;
            let imageUrl = null;

            if (file) {
                // Upload file to ImageKit
                const uploadResponse = await imagekit.upload({
                    file: file.buffer, // File buffer dari multer memory storage
                    fileName: file.originalname,
                });
                imageUrl = uploadResponse.url; // URL dari file yang diunggah ke ImageKit
            }

            const newProject = await Project.create({
                name,
                description,
                link_project,
                image: imageUrl // Menyimpan URL gambar dari ImageKit
            });

            res.status(201).json({
                message: "Project created successfully",
                data: newProject
            });
        } catch (error) {
            console.error('Error creating project:', error);
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
            const file = req.file;
            let newImageUrl = null;

            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (file) {
                // Delete old image from ImageKit
                if (project.image) {
                    const fileId = project.image.split('/').pop(); // Assuming last part is the ImageKit file ID
                    await imagekit.deleteFile(fileId);
                }

                // Upload new image to ImageKit
                const uploadResponse = await imagekit.upload({
                    file: file.buffer,
                    fileName: file.originalname,
                });
                newImageUrl = uploadResponse.url; // URL dari file yang diunggah ke ImageKit
            }

            await project.update({
                name,
                description,
                image: newImageUrl || project.image,
                link_project: link_project || project.link_project
            });

            res.json({
                message: "Project updated successfully",
                data: project
            });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({
                message: "Error updating project",
                error: error.message
            });
        }
    },

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

            // Delete image from ImageKit
            if (project.image) {
                const fileId = project.image.split('/').pop(); // Assuming last part is the ImageKit file ID
                await imagekit.deleteFile(fileId);
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
