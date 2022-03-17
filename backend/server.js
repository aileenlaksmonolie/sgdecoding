const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios").default;
const compression = require("compression");
const { setUpdatedFalse } = require("./helpers");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const httpProxy = require("http-proxy");
const jwt_decode = require("jwt-decode");
require('dotenv').config();

// Live Transcribe Proxy
var liveJobOpen = false;
var proxyUserID = "";
const proxy = httpProxy
  .createServer({
    target: "wss://gateway.speechlab.sg",
    changeOrigin: true,
    ws: true,
  })
  .listen(8080, () => console.log(`Live Transcribe Proxy Server started on port 8080`));

proxy.on("error", function (err, req, res) {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Live Transcribe Connection Failed");
});

proxy.on('proxyReqWs', function(proxyReqWs) {
  const path = proxyReqWs.path;
  const startPos = path.search("accessToken=");
  const endPos = path.search("&model");  
  const proxyToken = path.substring(startPos+12, endPos);
  proxyUserID = jwt_decode(proxyToken).sub;
});

proxy.on("open", function (proxySocket) {
  // listen for messages coming FROM the target here
  console.log("Live Transcribe Connection Open");
  liveJobOpen = true;
  proxySocket.on("data", (buffer) => {
    console.log(buffer.toString());
  });
});

proxy.on("close", function (res, socket, head) {
  // view disconnected websocket connections
  console.log("Live Transcribe Disconnected");
  if (liveJobOpen) {
    setUpdatedFalse(proxyUserID);
    liveJobOpen = false;
  }
});

// Mongoose (MongoDB) Database
mongoose.connect(
  // "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/SG_Decoding?retryWrites=true&w=majority"
  //"mongodb://localhost:27017/SG_Decoding?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
  //"mongodb://localhost:27017/SG_Decoding"
  // "mongodb://mongo:27017/SG_Decoding"
  process.env.DB_CONNECTION_STRING
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Mongoose Connection Successful!");
});

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


app.listen(2000, () => {
  console.log("Server started on port 2000");
});