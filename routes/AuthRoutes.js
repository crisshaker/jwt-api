const AuthController = require("../controllers/AuthController");

module.exports = app => {
  app.post("/register", AuthController.Register);
  app.post("/login", AuthController.Login);
};
