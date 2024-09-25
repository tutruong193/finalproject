const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
routes(app)
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("hello world");
});
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("connect DB success");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("listening on port: " + port);
});
