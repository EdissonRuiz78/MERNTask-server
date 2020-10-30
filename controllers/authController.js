const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

//Login user
exports.authUser = async (req, res) => {
  //Find errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email doesn´t exist" });
    }

    const passwordValidation = await bcryptjs.compare(password, user.password);
    if (!passwordValidation) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }

    //Auth with jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 360000,
      },
      (error, token) => {
        if (error) {
          throw error;
        } else {
          res.json({ token: token });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something isn´t working" });
  }
};
