"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
require("dotenv").config();
var bodyParser = require("body-parser");

var cors = require("cors");

var app = express();

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  url: String,
  shorturl: Number,
});

var Url = mongoose.model("Url", urlSchema);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  const shorturl = req.params.shorturl;
  let record = Url.findOne({ shorturl: shorturl }, function (error, data) {
    if (error) return error;
    res.redirect(data.url);
  });
});

app.post("/api/shorturl/new", (req, res) => {
  let url = req.body.url;
  Url.find()
    .sort({ shorturl: -1 })
    .limit(1)
    .exec(function (err, data) {
      if (err) return console.log(err);
      let newRecord;
      newRecord = new Url({ url: url, shorturl: data[0].shorturl + 1 });
      newRecord.save(function (error, data) {
        if (error) return error;
      });
      res.json({ url: url, shorturl: data[0].shorturl + 1 });
    });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
