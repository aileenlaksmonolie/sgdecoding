const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/SG_Decoding?retryWrites=true&w=majority"
);
const  db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Mongoose Connection Successful!");
});

