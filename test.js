const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:Gamebolt%401920@cluster0.wfntd.mongodb.net/ebike?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

app.listen(5000, (err) => console.log("Running on port 5000"));
