const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(
  // "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/SG_Decoding?retryWrites=true&w=majority"
  // "mongodb+srv://aileenlaksmono:sgdecoding@cluster0.ro7oklm.mongodb.net/?retryWrites=true&w=majority"
  // "mongodb://db:27017/demo"
  "mongodb://mongodb-app:27017/myapp"
  // MONGO_URL
);
const  db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Mongoose Connection Successful!");
});









// let url = `mongodb://${HOST}:${PORT}/${DATA}`;
// console.log(`URL: ${url}`);
// // Artificially delay the code
// setTimeout(function() {
//   MongoClient.connect(url, function(err, db) {
//     if(!err) {
//       console.log("Connected");
//     }
//   });
// }, WAIT);


// var mongoose = require('mongoose');

// var mongoURI = "db:27017";
// var MongoDB = mongoose.connect(mongoURI).connection;
// MongoDB.on('error', function(err) { console.log(err.message); });
// MongoDB.once('open', function() {
//   console.log("mongodb connection open");
// });