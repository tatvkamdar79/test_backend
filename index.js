const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const server = express();

server.use(cors());
server.use(bodyParser.json());

const dbURI =
  "mongodb://tatv2:test@ac-elq9yoz-shard-00-00.qn7nfdz.mongodb.net:27017,ac-elq9yoz-shard-00-01.qn7nfdz.mongodb.net:27017,ac-elq9yoz-shard-00-02.qn7nfdz.mongodb.net:27017/?ssl=true&replicaSet=atlas-9zov7z-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // console.log(result);
    console.log("Connections to DB made.");
    server.listen(8080);
  })
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

server.post("/demo", async (req, res) => {
  console.log(req.body);
  let user = new User(req.body);
  const doc = await user.save();
  console.log(doc);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.json(doc);
});

server.post("/demo/update", async (req, res) => {
  console.log(req.body);
  const foundOrNot = await User.find(req.body);
  console.log(foundOrNot);
  if (foundOrNot == null) {
    res.json({});
  } else {
    const result = await User.findOneAndUpdate(req.body, {
      $set: {
        username: "Tatva-Kamdar",
      },
    });
    console.log(result);
    res.json(result);
  }
});

server.post("/demo/delete", async (req, res) => {
  console.log(req.body.id);

  const foundOrNot = await User.findById(req.body.id);
  if (foundOrNot == null) {
    res.send("Not Found");
  } else {
    const deleted = await User.findByIdAndDelete(req.body.id);
    res.json(deleted);
  }
  // const response = await User.findByIdAndDelete({ _id: req.body.id });
});

server.get("/demo", async (req, res) => {
  const docs = await User.find({});
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.json(docs);
});
