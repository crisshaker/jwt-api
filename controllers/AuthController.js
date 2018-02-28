const Util = require("../util");
const jwt = require("jwt-simple");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const keys = require("../config/keys");

const generateToken = user => jwt.encode({ sub: user._id }, keys.jwtSecret);

module.exports.Register = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email.trim() || !password || !confirmPassword) {
    return Util.error("All fields required", next);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return Util.error("Email taken", next);
  }

  if (password !== confirmPassword) {
    return Util.error("Passwords do not match", next);
  }

  const user = await User.create(req.body);

  const token = generateToken(user);
  return res.json({
    token
  });
};

module.exports.Login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email.trim() || !password) {
    return Util.error("All fields required", next);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return Util.error("Email incorrect", next);
  }

  user.authenticate(password, (err, matching) => {
    if (err) return Util.error(err.message, next);
    if (!matching) return Util.error("Password incorrect", next);

    const token = generateToken(user);
    return res.json({
      token
    });
  });
};
