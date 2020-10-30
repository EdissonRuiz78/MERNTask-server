const Project = require("../models/Project");
const { validationResult } = require("express-validator");

//Create a project
exports.createProject = async (req, res) => {
  //Find errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Creating a new project
    const project = new Project(req.body);

    //Saving the author of project
    project.author = req.user.id;

    //Saving project
    project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(400).send("Something isn´t working");
  }
};

//Get projects from database
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.user.id }).sort({
      createDate: -1,
    });
    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something isn´t working");
  }
};

//Update a project by id
exports.updateProject = async (req, res) => {
  //Find errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  const newProject = {};

  if (name) {
    newProject.name = name;
  }

  try {
    //Check id
    let project = await Project.findById(req.params.id);

    //Project exist
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Author of project
    if (project.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    //Update project
    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something isn´t working");
  }
};

//Remove project by id
exports.removeProject = async (req, res) => {
  try {
    //Check id
    let project = await Project.findById(req.params.id);

    //Project exist
    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    //Author of project
    if (project.author.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Access Denied" });
    }

    //Remove project
    await Project.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: "Project Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something isn´t working");
  }
};
