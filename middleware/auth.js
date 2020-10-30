const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check token
  if (!token) {
    return res.status(401).json({ msg: "Authentication failed" });
  }

  try {
    const code = jwt.verify(token, process.env.SECRET);
    req.user = code.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Authentication failed" });
  }
};
