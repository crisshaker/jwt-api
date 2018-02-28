const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const jwtOptions = {
  secretOrKey: keys.jwtSecret,
  jwtFromRequest: ExtractJwt.fromHeader("authentication")
};

const jwtStrategy = new Strategy(jwtOptions, async function(payload, done) {
  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);
