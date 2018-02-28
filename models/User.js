const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: true
  },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  const user = this;

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    return next();
  });
});

UserSchema.methods.authenticate = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, matching) {
    if (err) return cb(err);

    return cb(null, matching);
  });
};

module.exports = UserSchema;
