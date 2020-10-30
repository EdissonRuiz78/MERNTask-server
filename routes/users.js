const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");

//Create an user
//endpoint: api/users
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is no valid").isEmail(),
    check("password", "Minimum 6 characters required").isLength({ min: 6 }),
  ],
  userController.createUser
);

module.exports = router;
