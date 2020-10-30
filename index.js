const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

//Express server
const app = express();

//Database connection
connectDB();

//Cors enable
app.use(cors());

//Express JSON
app.use(express.json({ extended: true }));

//Port app
const port = process.env.PORT || 4000;

//routes imports
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

//Start app listening on port PORT
app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});
