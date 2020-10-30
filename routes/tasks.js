const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//endpoint: api/tasks
//Create task
router.post(
  "/",
  auth,
  [
    check("name", "Task name is required").not().isEmpty(),
    check("project", "Project id is required").not().isEmpty(),
  ],
  taskController.createTask
);

//Get tasks from database
router.get("/", auth, taskController.getTasks);

//Update task in database
router.put(
  "/:id",
  auth,
  [check("project", "Project id is required").not().isEmpty()],
  taskController.updateTask
);

//Remove task from database
router.delete("/:id", auth, taskController.removeTask);

module.exports = router;
