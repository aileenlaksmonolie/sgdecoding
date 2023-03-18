const app = require("./app");
const { setUpdatedFalse } = require("./helpers");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const httpProxy = require("http-proxy");
const jwt_decode = require("jwt-decode");
const Notes = require("./models/notes.model");

require('dotenv').config();

////////////////////////////////////////////////////// Collaborative Editing //////////////////////////////////////////////////////
var http = require('http');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('websocket-json-stream');
ShareDB.types.register(richText.type);
const mongoDBUrl = "mongodb+srv://aileenlaksmono:sgdecoding@cluster0.ro7oklm.mongodb.net/?retryWrites=true&w=majority";
const shareMongoDB = require('sharedb-mongo')(mongoDBUrl);

// Create a web server to serve files and listen to WebSocket connections
var backend = new ShareDB({shareMongoDB});
var server = http.createServer(app);
var connection = backend.connect();

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({server: server});

wss.on('connection', function(ws, req) {
  var stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

server.listen(8081, () => console.log(`quilljs socket listening on port 8081`));

app.get('/notes/edit/:id', async (req, res) => {
  console.log("notesid",req.params.id);
  const id = req.params.id;
  var doc = connection.get('collaborative_community', id);
  doc.fetch(async function(err) {
    if (err) throw err;
    if (doc.type === null) {
      const foundNotes = await Notes.findOne({"_id":id});
      doc.create(JSON.parse(foundNotes.text), 'rich-text');
      return res.status(200).send();
    }
    return res.status(200).send();
  });
})

////////////////////////////////////////////////////// Collaborative Editing //////////////////////////////////////////////////////


////////////////////////////////////////////////////// Live Transcribe Proxy //////////////////////////////////////////////////////

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

////////////////////////////////////////////////////// Live Transcribe Proxy //////////////////////////////////////////////////////


////////////////////////////////////////////////////// MongoDB //////////////////////////////////////////////////////

mongoose.connect(
  // "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/SG_Decoding?retryWrites=true&w=majority"
  //"mongodb://localhost:27017/SG_Decoding?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
  //"mongodb://localhost:27017/SG_Decoding"
  // "mongodb://mongo:27017/SG_Decoding"
  // process.env.DB_CONNECTION_STRING
  // "mongodb://mongodb-app:27017/myapp"
  "mongodb+srv://aileenlaksmono:sgdecoding@cluster0.ro7oklm.mongodb.net/?retryWrites=true&w=majority"

  // MONGO_URL
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Mongoose Connection Successful!");
});

////////////////////////////////////////////////////// MongoDB //////////////////////////////////////////////////////


app.listen(2000,'0.0.0.0',()=>{
  console.log("server is listening on 2000 port");
});

