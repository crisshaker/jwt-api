const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/smart-api");
const db = mongoose.connection;
db.on("open", () => console.log("Success: Database Connection successful"));
db.on("error", () => console.log("Error: Database Connection failed"));

// Requires
require("./models");
require("./services/passport");
require("./routes")(app);

// Not Found
app.use((req, res, next) => {
  const error = new Error("oooops..... Not Found");
  error.status = 404;

  return next(error);
});

// Error Handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Setup Server
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`Server is running on PORT ${PORT}`);
