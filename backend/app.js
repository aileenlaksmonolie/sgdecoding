const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
const compression = require("compression");
const User = require("./models/user.model");

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use(require('./routes'));

app.post("/add_user", async (request, response) => {
  const user = new User(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users", async (request, response) => {
  const users = await User.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});


app.get("/files/:id/download", async (req, res) => {
  const { id } = req.params;

  await axios
    .get(
      `https://gateway.speechlab.sg/files/${id}/download`,
      {
        headers: {
          Authorization: `${req.headers.authorization}`,
        },
      },
      { responseType: "json" }
    )
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong with your request!" });
    });
});

module.exports = app;
