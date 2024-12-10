"use strict";

import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("index.html");
});

app.listen(3003, () => {
  console.log("Visualization running on port 3003...");
});
