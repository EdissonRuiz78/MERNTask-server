const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

//endpoint: api/auth
//Login
router.post("/", authController.authUser);

//Get login user
router.get("/", auth, authController.getUser);

module.exports = router;
