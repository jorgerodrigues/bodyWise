const express = require("express");
require("./db/mongoose");
const User = require("./models/user");

const app = express();
// Automatically parse objects into json
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Success!");
});

app.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = app;
