const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
dotenv.config();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // Giới hạn dung lượng JSON
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
routes(app);
const port = process.env.PORT || 5000;

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
