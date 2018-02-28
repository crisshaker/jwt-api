const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = app => {
  app.get("/profile", requireAuth, (req, res) => {
    res.send({ message: "some super secret information" });
  });
};
