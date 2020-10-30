const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");
const { json } = require("express");

// Create a new task
exports.createTask = async (req, res) => {
  //Find errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { project } = req.body;

  try {
    let currentproject = await Project.findById(project);
    //Check if project exists
    if (!currentproject) {
      return res.status(404), json({ msg: "Project not found " });
    }

    //Check author of project
    if (currentproject.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    //Create task
    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Something isn´t working");
  }
};

//Get tasks by project id
exports.getTasks = async (req, res) => {
  //Find errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { project } = req.query;

  try {
    let currentproject = await Project.findById(project);
    //Check if project exists
    if (!currentproject) {
      return res.status(404), json({ msg: "Project not found " });
    }

    //Check author of project
    if (currentproject.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    //Get tasks by project
    const tasks = await Task.find({ project }).sort({ createDate: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    return res.status(404).send("Something isn´t working");
  }
};

//Update a task by id
exports.updateTask = async (req, res) => {
  //Destructuring const from body request
  const { project, name, state } = req.body;

  try {
    let currentproject = await Project.findById(project);

    //Check author of project
    if (currentproject.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    let currenttask = await Task.findById(req.params.id);
    //Check if task exists
    if (!currenttask) {
      return res.status(404), json({ msg: "Task not found " });
    }

    const newtask = {};
    newtask.name = name;
    newtask.state = state;

    //Update task in database
    currenttask = await Task.findOneAndUpdate({ _id: req.params.id }, newtask, {
      new: true,
    });
    res.json({ currenttask });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something isn´t working");
  }
};

//Remove a task by id
exports.removeTask = async (req, res) => {
  //Destructuring const from body request
  const { project } = req.query;

  try {
    let currentproject = await Project.findById(project);

    //Check author of project
    if (currentproject.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" });
    }

    let currenttask = await Task.findById(req.params.id);
    //Check if task exists
    if (!currenttask) {
      return res.status(404), json({ msg: "Task not found " });
    }

    //Remove task from database
    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Task deleted" });
  } catch (error) {
    console.log(error);
  }
};
