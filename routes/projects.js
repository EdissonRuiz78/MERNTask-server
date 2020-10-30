const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//endpoint: api/projects
//Create project
router.post(
  "/",
  auth,
  [check("name", "Project name is required").not().isEmpty()],
  projectController.createProject
);

//Get projects from database
router.get("/", auth, projectController.getProjects);

//Update project in database
router.put(
  "/:id",
  auth,
  [check("name", "Project name is required").not().isEmpty()],
  projectController.updateProject
);

//Remove project from database
router.delete("/:id", auth, projectController.removeProject);

module.exports = router;
