const express = require("express");
const app = express();
// const { createProxyMiddleware } = require('http-proxy-middleware');

// const wsProxy = createProxyMiddleware( {
//     target: 'wss://gateway.speechlab.sg',
//     changeOrigin: true,
//     ws: true,

//  });

// app.use(wsProxy);
// app.listen(8080, () => console.log(`Listening on port: 8080`))

var httpProxy = require("http-proxy");
let isOpen = false;

const proxy = httpProxy
  .createServer({
    target: "wss://gateway.speechlab.sg",
    changeOrigin: true,
    ws: true,
  })
  .listen(8080);

proxy.on("error", function (err, req, res) {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });

  res.end("Live Transcribe Connection Failed");
});

proxy.on("open", function (proxySocket) {
  // listen for messages coming FROM the target here
  console.log("Live Transcribe Connection Open");
  isOpen = true;
  proxySocket.on("data", (buffer) => {
    console.log(buffer.toString());
  });

});

proxy.on("close", function (res, socket, head) {
  // view disconnected websocket connections
  console.log("Live Transcribe Disconnected");
  if (isOpen) {
    console.log("live job complete");
    isOpen = false;
  } else {
    console.log("not submitted");
  }
});