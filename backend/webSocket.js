const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
//const server = require('http').createServer(app);
//const WebSocket = require('ws');
//const wss = new WebSocket.Server({ server:server });

const wsProxy = createProxyMiddleware( {
    target: 'wss://gateway.speechlab.sg', 
    changeOrigin: true,
    ws: true,
    
 });

app.use(wsProxy);
app.listen(8080, () => console.log(`Listening on port: 8080`))

//const server = app.listen(8080);
//server.on('upgrade', wsProxy.upgrade); // optional: upgrade externally

